import { KickSourceChat } from "src/lib/kick-source-chat";
import { TwitchSourceChat } from "src/lib/twitch-source-chat";
import { WebSocketInjector } from "src/lib/websocket-injector";
import { KickMessageDetector } from "src/lib/kick-message-detector";
import { TwitchMessageDetector } from "src/lib/twitch-message-detector";
import { DemoMode, isDemoMode } from "src/lib/demo";
import { getChannelName, storage } from "src/utils";

const HREF = window.location.href;

const WebsocketInjector = new WebSocketInjector();

(async () => {
  const demoMode = isDemoMode();

  if (HREF.includes("twitch.tv")) {
    const channelSlug = getChannelName();
    if (!channelSlug) return;

    const detector = new TwitchMessageDetector();
    detector.start();

    if (demoMode) {
      const demo = new DemoMode(channelSlug);
      await demo.start();
      return;
    }

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

    const detector = new KickMessageDetector();
    detector.start();

    if (demoMode) {
      const demo = new DemoMode(channelSlug);
      await demo.start();
      return;
    }

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
