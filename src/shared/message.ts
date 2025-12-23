export interface Message {
  content: string;
  sender: {
    username: string;
    color: string;
    isBroadcaster: boolean;
    isMod: boolean;
    isVip: boolean;
    subscriberMonths: number | undefined;
  };
  sourceChannel: {
    type: "twitch" | "kick";
    name: string;
    id: string;
  };
  displayChannel: {
    type: "twitch" | "kick";
    name: string;
    id: string;
  };
}
