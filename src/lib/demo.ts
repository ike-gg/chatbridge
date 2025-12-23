import type { Message } from "../shared/message";
import { WebSocketInjector } from "./websocket-injector";

const DEMO_MESSAGES: Message[] = [
  {
    content: "nice stream",
    sender: {
      username: "alice123",
      color: "#00FF00",
      isBroadcaster: false,
      isMod: true,
      isVip: false,
      subscriberMonths: undefined,
    },
    sourceChannel: {
      type: "twitch",
      name: "demo",
      id: "46158",
    },
    displayChannel: {
      type: "kick",
      name: "demo",
      id: "46158",
    },
  },
  {
    content: "gg wp",
    sender: {
      username: "charlie99",
      color: "#FFFF00",
      isBroadcaster: false,
      isMod: false,
      isVip: false,
      subscriberMonths: undefined,
    },
    sourceChannel: {
      type: "kick",
      name: "demo",
      id: "46158",
    },
    displayChannel: {
      type: "twitch",
      name: "demo",
      id: "46158",
    },
  },
  {
    content: "this is cool",
    sender: {
      username: "frank_cool",
      color: "#FF8800",
      isBroadcaster: true,
      isMod: false,
      isVip: false,
      subscriberMonths: undefined,
    },
    sourceChannel: {
      type: "twitch",
      name: "demo",
      id: "46158",
    },
    displayChannel: {
      type: "kick",
      name: "demo",
      id: "46158",
    },
  },
  {
    content: "can we chat?",
    sender: {
      username: "henry_chat",
      color: "#FF4444",
      isBroadcaster: false,
      isMod: true,
      isVip: false,
      subscriberMonths: undefined,
    },
    sourceChannel: {
      type: "twitch",
      name: "demo",
      id: "46158",
    },
    displayChannel: {
      type: "kick",
      name: "demo",
      id: "46158",
    },
  },
  {
    content: "hey what's up",
    sender: {
      username: "john_doe",
      color: "#FF0000",
      isBroadcaster: false,
      isMod: false,
      isVip: false,
      subscriberMonths: undefined,
    },
    sourceChannel: {
      type: "kick",
      name: "demo",
      id: "46158",
    },
    displayChannel: {
      type: "twitch",
      name: "demo",
      id: "46158",
    },
  },
  {
    content: "what time is it?",
    sender: {
      username: "eddie_time",
      color: "#00FFFF",
      isBroadcaster: false,
      isMod: false,
      isVip: false,
      subscriberMonths: undefined,
    },
    sourceChannel: {
      type: "kick",
      name: "demo",
      id: "46158",
    },
    displayChannel: {
      type: "twitch",
      name: "demo",
      id: "46158",
    },
  },
  {
    content: "keep it up",
    sender: {
      username: "jack_keep",
      color: "#4444FF",
      isBroadcaster: false,
      isMod: false,
      isVip: true,
      subscriberMonths: undefined,
    },
    sourceChannel: {
      type: "twitch",
      name: "demo",
      id: "46158",
    },
    displayChannel: {
      type: "kick",
      name: "demo",
      id: "46158",
    },
  },
  {
    content: "thanks for everything",
    sender: {
      username: "mia_thanks",
      color: "#FFFF44",
      isBroadcaster: false,
      isMod: false,
      isVip: false,
      subscriberMonths: undefined,
    },
    sourceChannel: {
      type: "kick",
      name: "demo",
      id: "46158",
    },
    displayChannel: {
      type: "twitch",
      name: "demo",
      id: "46158",
    },
  },
  {
    content: "can you play this game?",
    sender: {
      username: "bob_gamer",
      color: "#0000FF",
      isBroadcaster: false,
      isMod: true,
      isVip: false,
      subscriberMonths: undefined,
    },
    sourceChannel: {
      type: "twitch",
      name: "demo",
      id: "46158",
    },
    displayChannel: {
      type: "kick",
      name: "demo",
      id: "46158",
    },
  },
  {
    content: "how are you doing?",
    sender: {
      username: "grace_hello",
      color: "#8800FF",
      isBroadcaster: false,
      isMod: false,
      isVip: true,
      subscriberMonths: undefined,
    },
    sourceChannel: {
      type: "kick",
      name: "demo",
      id: "46158",
    },
    displayChannel: {
      type: "twitch",
      name: "demo",
      id: "46158",
    },
  },
  {
    content: "amazing gameplay",
    sender: {
      username: "leo_game",
      color: "#44FFFF",
      isBroadcaster: false,
      isMod: true,
      isVip: false,
      subscriberMonths: undefined,
    },
    sourceChannel: {
      type: "twitch",
      name: "demo",
      id: "46158",
    },
    displayChannel: {
      type: "kick",
      name: "demo",
      id: "46158",
    },
  },
  {
    content: "thanks for the stream",
    sender: {
      username: "diana_stream",
      color: "#FF00FF",
      isBroadcaster: false,
      isMod: false,
      isVip: true,
      subscriberMonths: undefined,
    },
    sourceChannel: {
      type: "twitch",
      name: "demo",
      id: "46158",
    },
    displayChannel: {
      type: "kick",
      name: "demo",
      id: "46158",
    },
  },
  {
    content: "lol that was funny",
    sender: {
      username: "iris_laugh",
      color: "#44FF44",
      isBroadcaster: false,
      isMod: true,
      isVip: false,
      subscriberMonths: undefined,
    },
    sourceChannel: {
      type: "kick",
      name: "demo",
      id: "46158",
    },
    displayChannel: {
      type: "twitch",
      name: "demo",
      id: "46158",
    },
  },
  {
    content: "see you tomorrow",
    sender: {
      username: "nick_see",
      color: "#FF8844",
      isBroadcaster: false,
      isMod: false,
      isVip: true,
      subscriberMonths: undefined,
    },
    sourceChannel: {
      type: "twitch",
      name: "demo",
      id: "46158",
    },
    displayChannel: {
      type: "kick",
      name: "demo",
      id: "46158",
    },
  },
  {
    content: "what's next?",
    sender: {
      username: "kate_next",
      color: "#FF44FF",
      isBroadcaster: false,
      isMod: false,
      isVip: false,
      subscriberMonths: undefined,
    },
    sourceChannel: {
      type: "kick",
      name: "demo",
      id: "46158",
    },
    displayChannel: {
      type: "twitch",
      name: "demo",
      id: "46158",
    },
  },
  {
    content: "have a good day",
    sender: {
      username: "olivia_day",
      color: "#8844FF",
      isBroadcaster: false,
      isMod: true,
      isVip: false,
      subscriberMonths: undefined,
    },
    sourceChannel: {
      type: "kick",
      name: "demo",
      id: "46158",
    },
    displayChannel: {
      type: "twitch",
      name: "demo",
      id: "46158",
    },
  },
];

export class DemoMode {
  private injector: WebSocketInjector;
  private channelName: string;

  constructor(channelName: string) {
    this.injector = new WebSocketInjector();
    this.channelName = channelName;
  }

  async start() {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // const messages = DEMO_MESSAGES.map((msg) => ({
    //   ...msg,
    //   sourceChannel: {
    //     ...msg.sourceChannel,
    //     name: this.channelName,
    //   },
    //   displayChannel: {
    //     ...msg.displayChannel,
    //     name: this.channelName,
    //   },
    // }));

    for (const message of DEMO_MESSAGES) {
      // if (message.sourceChannel.type === "kick") {
      //   this.injector.injectKickMessage(message);
      // } else {
      //   this.injector.injectTwitchMessage(message);
      // }
      this.injector.injectKickMessage(message);
      this.injector.injectTwitchMessage(message);

      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
}

export function isDemoMode(): boolean {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("demo") === "true";
}
