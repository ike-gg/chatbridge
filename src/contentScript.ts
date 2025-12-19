import { KickSourceChat } from "src/lib/kick-source-chat";
import { TwitchSourceChat } from "src/lib/twitch-source-chat";
import { WebSocketInjector } from "src/lib/websocket-injector";
import { getChannelName, storage } from "src/utils";

const HREF = window.location.href;

const WebsocketInjector = new WebSocketInjector();

(async () => {
	if (HREF.includes("twitch.tv")) {
		const channelSlug = getChannelName();
		if (!channelSlug) return;

		const storageLink = await storage.get(`twitch:${channelSlug}`);
		const kickChannelName = storageLink ?? channelSlug;

		if (kickChannelName) {
			const KickChat = new KickSourceChat({
				displayChannelName: channelSlug,
				sourceChannelName: kickChannelName,
			});

			KickChat.onMessage((message) => {
				WebsocketInjector.injectTwitchMessage(message);
			});
		}
	}

	if (HREF.includes("kick.com")) {
		const channelSlug = getChannelName();
		if (!channelSlug) return;

		const storageLink = await storage.get(`kick:${channelSlug}`);
		const twitchChannelName = storageLink ?? channelSlug;

		if (twitchChannelName) {
			const TwitchChat = new TwitchSourceChat({
				displayChannelName: channelSlug,
				sourceChannelName: twitchChannelName,
			});

			TwitchChat.onMessage((message) => {
				WebsocketInjector.injectKickMessage(message);
			});
		}
	}
})();
