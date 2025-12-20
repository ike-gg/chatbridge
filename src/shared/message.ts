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
		name: string;
		id: string;
	};
	displayChannel: {
		name: string;
		id: string;
	};
}
