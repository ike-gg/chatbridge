export interface Message {
	content: string;
	sender: {
		username: string;
		color: string;
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
