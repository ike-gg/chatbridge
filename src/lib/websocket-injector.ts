import type { Message } from "src/shared/message";

export class WebSocketInjector {
	private injectMessage(data: string, target: "twitch" | "kick") {
		window.postMessage(
			{
				type:
					target === "twitch"
						? "__extension_inject_twitch_message"
						: "__extension_inject_kick_message",
				data,
			},
			window.location.origin,
		);
	}

	injectTwitchMessage(message: Message) {
		const badges = [];

		if (message.sender.isMod) {
			badges.push("moderator/1");
		}

		if (message.sender.isVip) {
			badges.push("vip/1");
		}

		if (message.sender.subscriberMonths) {
			badges.push(`subscriber/${message.sender.subscriberMonths}`);
		}

		const badgesString = badges.join(",");

		const template = [
			"@badge-info=",
			`badges=${badgesString}`,
			`client-nonce=${Math.random().toString(36).substring(2, 34)}`,
			`color=${message.sender.color}`,
			`display-name=${message.sender.username}`,
			"emotes=",
			"first-msg=0",
			"flags=",
			`id=${Math.random().toString(36).substring(2, 34)}`,
			"mod=0",
			"returning-chatter=0",
			"subscriber=1",
			"turbo=0",
			`user-type= :KICK!${message.sender.username}@${message.sender.username}45.tmi.twitch.tv PRIVMSG #${message.displayChannel.name} : ${message.content}`,
		];

		this.injectMessage(template.join(";"), "twitch");
	}

	injectKickMessage(message: Message) {
		const badges = [];

		if (message.sender.isMod) {
			badges.push({ type: "moderator", text: "Moderator" });
		}

		if (message.sender.isVip) {
			badges.push({ type: "vip", text: "VIP" });
		}

		if (message.sender.subscriberMonths) {
			badges.push({
				type: "subscriber",
				text: "Subscriber",
				count: message.sender.subscriberMonths,
			});
		}

		const payload = {
			event: "App\\Events\\ChatMessageEvent",
			data: JSON.stringify({
				// id: crypto.randomUUID(),
				chatroom_id: message.displayChannel.id,
				content: message.content,
				type: "message",
				created_at: new Date().toISOString(),
				sender: {
					id: 1,
					username: `${message.sender.username} (TWITCH)`,
					slug: message.sender.username.toLowerCase(),
					identity: {
						color: message.sender.color,
						badges: badges,
					},
				},
				metadata: {
					message_ref: Date.now().toString(),
				},
			}),
			channel: `chatrooms.${message.displayChannel.id}.v2`,
		};

		this.injectMessage(JSON.stringify(payload), "kick");
	}
}
