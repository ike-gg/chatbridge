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
		const template = [
			"@badge-info=",
			"badges=",
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
						badges: [
							{
								type: "twitch",
								text: "Twitch",
								count: 1,
							},
						],
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
