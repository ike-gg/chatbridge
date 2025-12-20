import elementReady, { type Options } from "element-ready";

export function $<T extends Element>(selector: string) {
	return document.querySelector<T>(selector);
}

export function $$<T extends Element>(selector: string) {
	return document.querySelectorAll<T>(selector);
}

export const waitFor = async (duration = 1000) =>
	new Promise((resolve) => setTimeout(resolve, duration));

export const waitForElement = async (selector: string, options?: Options) => {
	return elementReady(selector, {
		stopOnDomReady: false,
		...options,
	});
};

export const getCurrentTab = async () => {
	const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
	return tab;
};

export const storage = {
	set: async (key: string, value: unknown) => {
		return chrome.storage.sync.set({ [key]: value }).then(() => value);
	},
	get: async (key: string) => {
		return chrome.storage.sync.get(key).then((result) => result[key]);
	},
};

export const getChannelName = () => {
	const HREF = window.location.href;

	if (HREF.includes("twitch.tv")) {
		const slugs = HREF.split("/");

		let channelSlug: string | undefined;

		if (slugs.includes("popout")) {
			channelSlug = slugs.at(4);
		} else if (slugs.includes("embed")) {
			channelSlug = slugs.at(4);
		} else {
			channelSlug = slugs.at(3);
		}

		return channelSlug;
	}

	if (HREF.includes("kick.com")) {
		const slugs = HREF.split("/");
		return slugs.at(3);
	}
};
