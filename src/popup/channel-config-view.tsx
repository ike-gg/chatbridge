import { useEffect, useState } from "react";
import { storage } from "src/utils";

interface ChannelConfigProps {
	href: string;
	type: "twitch" | "kick";
}

const getChannelNameFromUrl = (url: string): string | null => {
	if (url.includes("twitch.tv")) {
		const slugs = url.split("/");
		const channelSlug = slugs.includes("popout") ? slugs.at(4) : slugs.at(3);
		return channelSlug ?? null;
	}

	if (url.includes("kick.com")) {
		const slugs = url.split("/");
		return slugs.at(3) ?? null;
	}

	return null;
};

export const ChannelConfig = ({ href, type }: ChannelConfigProps) => {
	const currentChannel = getChannelNameFromUrl(href);
	const [linkedChannel, setLinkedChannel] = useState<string>("");
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [showRefreshMessage, setShowRefreshMessage] = useState(false);

	useEffect(() => {
		const loadLinkedChannel = async () => {
			if (!currentChannel) return;

			const storageKey = `${type}:${currentChannel}`;
			const storedValue = await storage.get(storageKey);
			setLinkedChannel(storedValue ?? "");
			setLoading(false);
		};

		loadLinkedChannel();
	}, [currentChannel, type]);

	const handleSave = async () => {
		if (!currentChannel) return;

		setSaving(true);
		const finalLinkedChannel = linkedChannel.trim() || currentChannel;

		const storageKey1 = `${type}:${currentChannel}`;
		await storage.set(storageKey1, finalLinkedChannel);

		const oppositeType = type === "twitch" ? "kick" : "twitch";
		const storageKey2 = `${oppositeType}:${finalLinkedChannel}`;
		await storage.set(storageKey2, currentChannel);

		setSaving(false);
		setShowRefreshMessage(true);
	};

	if (loading) {
		return (
			<div className="min-h-[200px] flex items-center justify-center">
				<div className="flex flex-col items-center gap-2">
					<div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
					<p className="text-sm text-gray-500">Loading...</p>
				</div>
			</div>
		);
	}

	if (!currentChannel) {
		return (
			<div className="p-6 w-80">
				<p className="text-red-500">Could not extract channel name from URL</p>
			</div>
		);
	}

	const currentPlatform = type === "twitch" ? "Twitch" : "Kick";
	const linkedPlatform = type === "twitch" ? "Kick" : "Twitch";
	const currentPlatformColor =
		type === "twitch" ? "text-purple-600" : "text-green-600";
	const linkedPlatformColor =
		type === "twitch" ? "text-green-600" : "text-purple-600";

	return (
		<div className="bg-gradient-to-br from-gray-50 to-white p-6 w-80 min-h-[400px]">
			<div className="mb-6">
				<h1 className="text-2xl font-bold text-gray-800 mb-1">
					Channel Configuration
				</h1>
				<p className="text-xs text-gray-500">
					Link channels between Twitch and Kick
				</p>
			</div>

			<div className="space-y-5">
				<div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
					<label
						htmlFor="current-channel"
						className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2"
					>
						<span className={currentPlatformColor}>{currentPlatform}</span>{" "}
						Channel
					</label>
					<div className="relative">
						<input
							id="current-channel"
							type="text"
							value={currentChannel}
							disabled
							className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 font-medium cursor-not-allowed"
						/>
						<div
							className={`absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${
								type === "twitch" ? "bg-purple-500" : "bg-green-500"
							}`}
						/>
					</div>
				</div>

				<div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
					<label
						htmlFor="linked-channel"
						className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2"
					>
						<span className={linkedPlatformColor}>{linkedPlatform}</span>{" "}
						Channel
					</label>
					<input
						id="linked-channel"
						type="text"
						value={linkedChannel}
						onChange={(e) => setLinkedChannel(e.target.value)}
						placeholder={currentChannel}
						className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white text-gray-800 placeholder:text-gray-400"
					/>
					<p className="text-xs text-gray-400 mt-2">
						Leave empty to use{" "}
						<span className="font-medium">{currentChannel}</span> as default
					</p>
				</div>

				<button
					type="button"
					onClick={handleSave}
					disabled={saving}
					className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-md hover:shadow-lg disabled:shadow-none disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
				>
					{saving ? (
						<span className="flex items-center justify-center gap-2">
							<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
							Saving...
						</span>
					) : (
						"Save Configuration"
					)}
				</button>

				{showRefreshMessage && (
					<div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg shadow-sm transition-all duration-300">
						<div className="flex items-start gap-3">
							<div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
								<svg
									className="w-3 h-3 text-white"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									aria-label="Success"
								>
									<title>Success</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={3}
										d="M5 13l4 4L19 7"
									/>
								</svg>
							</div>
							<div>
								<p className="text-sm font-semibold text-yellow-900">
									Configuration saved!
								</p>
								<p className="text-xs text-yellow-700 mt-1">
									Please refresh the page for changes to take effect.
								</p>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
