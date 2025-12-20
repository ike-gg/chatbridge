import { KickSourceChat } from "src/lib/kick-source-chat";
import type { Message } from "../shared/message";

export class TwitchSourceChat {
	private wsEndpoint = "wss://irc-ws.chat.twitch.tv/";

	private ws: WebSocket;
	private messageCallbacks: ((message: Message) => void)[] = [];

	channelId: number | null = null;

	private sourceChannelName: string;
	private displayChannelName: string;

	private displayChannelId: number | null = null;

	constructor({
		displayChannelName,
		sourceChannelName,
	}: {
		sourceChannelName: string;
		displayChannelName: string;
	}) {
		this.sourceChannelName = sourceChannelName;
		this.displayChannelName = displayChannelName;

		this.ws = new WebSocket(this.wsEndpoint);

		this.ws.addEventListener("open", () => {
			this.subscribeChannels(this.sourceChannelName);
			this.setupPongResponseListener();
		});

		this.setupMessageListener();

		KickSourceChat.getChannelId(displayChannelName).then((channelId) => {
			this.displayChannelId = channelId;
		});
	}

	onMessage(callback: (message: Message) => void) {
		this.messageCallbacks.push(callback);
	}

	private setupMessageListener() {
		this.ws.onmessage = (event) => {
			if (!event.data.includes("PRIVMSG")) return;
			/** payload body structure */
			// [
			//     "@badge-info=subscriber/12",
			//     "badges=broadcaster/1",
			//     "client-nonce=x",
			//     "color=#123123",
			//     "display-name=x",
			//     "emotes=",
			//     "first-msg=0",
			//     "flags=",
			//     "id=x",
			//     "mod=0",
			//     "returning-chatter=0",
			//     "room-id=x",
			//     "subscriber=1",
			//     "tmi-sent-ts=x",
			//     "turbo=0",
			//     "user-id=x",
			//     "user-type= :y!y@y.tmi.twitch.tv PRIVMSG #y :message_content"
			// ]

			const properties = event.data.split(";");

			const badges =
				properties
					.find((property: string) => property.startsWith("badges="))
					?.split("=")[1] ?? ("" as string);

			const isMod = badges.includes("moderator");
			const isVip = badges.includes("vip");
			const isBroadcaster = badges.includes("broadcaster");

			const badgesArray = badges.split(",");

			const subscriberBadge =
				badgesArray
					.find((badge: string) => badge.includes("subscriber"))
					?.split("/")[1] ?? undefined;

			const color =
				properties
					.find((property: string) => property.startsWith("color="))
					?.split("=")[1] ?? "#808080";

			const displayName =
				properties
					.find((property: string) => property.startsWith("display-name="))
					?.split("=")[1] ?? "Anonymous";

			const privmsgProperty = properties.find((property: string) =>
				property.toLowerCase().includes("privmsg"),
			);

			let messageContent = "";

			if (privmsgProperty) {
				const afterPrivmsg = privmsgProperty.split("PRIVMSG")[1]?.trim() ?? "";
				const colonIndex = afterPrivmsg.indexOf(":");
				if (colonIndex !== -1) {
					messageContent = afterPrivmsg.substring(colonIndex + 1).trim();
				}
			}

			const message: Message = {
				content: messageContent,
				sender: {
					color,
					username: displayName,
					isMod,
					isVip,
					subscriberMonths: subscriberBadge
						? parseInt(subscriberBadge as string, 10)
						: undefined,
					isBroadcaster,
				},
				sourceChannel: {
					name: this.sourceChannelName,
					id: this.channelId?.toString() ?? "",
				},
				displayChannel: {
					name: this.displayChannelName,
					id: this.displayChannelId?.toString() ?? "",
				},
			};

			for (const callback of this.messageCallbacks) {
				callback(message);
			}
		};
	}

	private async subscribeChannels(channelName: string) {
		const annonymousUsername = `justinfan${Math.floor(
			Math.random() * 1000000,
		)}`;

		const messages = [
			`CAP REQ :twitch.tv/tags twitch.tv/commands`,
			`PASS SCHMOOPIIE`,
			`NICK ${annonymousUsername}`,
			`USER ${annonymousUsername} 8 * :${annonymousUsername}`,
			`JOIN #${channelName}`,
		];

		for (const message of messages) {
			this.ws.send(message);
		}
	}

	private setupPongResponseListener() {
		this.ws.addEventListener("message", (event) => {
			if ((event.data as string).startsWith("PING")) {
				this.ws.send("PONG");

				setTimeout(() => {
					this.ws.send("PING");
				}, 1500);
			}
		});
	}
}
