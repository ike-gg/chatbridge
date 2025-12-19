import type { Message } from "../shared/message";

interface KickChatMessageEventPayload {
	content: string;
	id: string;
	sender: {
		id: number;
		identity: {
			/** Color in Hex */
			color: string;
			badges: {
				type: string;
				text: string;
				count: number;
			}[];
		};
		username: string;
	};
}

export class KickSourceChat {
	private wsEndpoint =
		"wss://ws-us2.pusher.com/app/32cbd69e4b950bf97679?protocol=7&client=js&version=8.4.0&flash=false";

	private ws: WebSocket;
	private messageCallbacks: ((message: Message) => void)[] = [];

	channelId: number | null = null;

	private sourceChannelName: string;
	private displayChannelName: string;

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

		KickSourceChat.getChannelId(sourceChannelName).then((channelId) => {
			if (!channelId) return;
			this.channelId = channelId;
			this.setupMessageListener();

			if (this.ws.readyState === WebSocket.OPEN) {
				this.subscribeChannels(channelId);
			} else {
				this.ws.addEventListener("open", () => {
					this.subscribeChannels(channelId);
				});
			}
		});
	}

	onMessage(callback: (message: Message) => void) {
		this.messageCallbacks.push(callback);
	}

	private removeEmotes(content: string): string {
		// Remove emotes in format [emote:number:name]
		return content.replaceAll(/\[emote:\d+:\w+\]/g, "").trim();
	}

	private setupMessageListener() {
		this.ws.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);

				if (data && data.event !== "App\\Events\\ChatMessageEvent") return;

				const payload = JSON.parse(data.data) as KickChatMessageEventPayload;

				const cleanedContent = this.removeEmotes(payload.content);
				if (!cleanedContent) {
					return;
				}

				const isMod = payload.sender.identity.badges.some(
					(badge) => badge.type === "moderator",
				);

				const isVip = payload.sender.identity.badges.some(
					(badge) => badge.type === "og",
				);

				const subscriberMonths =
					payload.sender.identity.badges.find(
						(badge) => badge.type === "subscriber",
					)?.count ?? undefined;

				const message: Message = {
					content: cleanedContent,
					sender: {
						color: payload.sender.identity.color,
						username: payload.sender.username,
						isMod,
						isVip,
						subscriberMonths,
					},
					sourceChannel: {
						id: this.channelId?.toString() ?? "",
						name: this.sourceChannelName,
					},
					displayChannel: {
						id: "",
						name: this.displayChannelName,
					},
				};

				for (const callback of this.messageCallbacks) {
					callback(message);
				}
			} catch (error) {
				console.error("Error parsing WebSocket message:", error);
			}
		};
	}

	private async subscribeChannels(channelId: number) {
		const channels = [
			`chatrooms.${channelId}.v2`,
			`chatroom_${channelId}`,
			`chatrooms.${channelId}`,
		];

		for (const sourceChannel of channels) {
			const data = {
				event: "pusher:subscribe",
				data: { auth: "", channel: sourceChannel },
			};
			this.ws.send(JSON.stringify(data));
		}
	}

	static async getChannelId(channelName: string) {
		const endpoint = `https://kick.com/api/v2/channels/${channelName}`;

		const response = await fetch(endpoint);

		if (!response.ok) return null;

		try {
			const data = await response.json();
			if ("chatroom" in data && "id" in data.chatroom)
				return data.chatroom.id as number;
			return null;
		} catch (error) {
			console.error(error);
			return null;
		}
	}
}
