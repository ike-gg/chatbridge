import { useEffect, useState } from "react";
import { ChannelConfig } from "src/popup/channel-config-view";
import { ErrorView } from "src/popup/error-view";
import { getCurrentTab } from "src/utils";

export function App() {
	const [activeTab, setActiveTab] = useState<chrome.tabs.Tab | null>(null);

	useEffect(() => {
		const fetchCurrentTab = async () => {
			const tab = await getCurrentTab();
			setActiveTab(tab);
		};

		fetchCurrentTab();
	}, []);

	if (!activeTab || !activeTab.url) {
		return <ErrorView message="No active tab found" />;
	}

	const isTwitch = activeTab.url.includes("twitch.tv");
	const isKick = activeTab.url.includes("kick.com");

	const type = isTwitch ? "twitch" : isKick ? "kick" : null;

	if (!type) {
		return (
			<ErrorView
				title="Invalid website"
				message="Open this extension on a Twitch or Kick channel."
			/>
		);
	}

	return <ChannelConfig href={activeTab.url} type={type} />;
}
