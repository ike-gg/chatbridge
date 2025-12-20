import { BaseMessageDetector } from "./base-message-detector";

export class TwitchMessageDetector extends BaseMessageDetector {
	protected getChatContainerSelector(): string {
		return ".chat-scrollable-area__message-container";
	}

	protected findBadgesContainer(
		messageElement: HTMLElement,
	): HTMLElement | null {
		const ffzBadgesContainer = messageElement.querySelector(
			".chat-line__message--badges",
		);
		if (ffzBadgesContainer instanceof HTMLElement) {
			return ffzBadgesContainer;
		}

		const usernameContainer = messageElement.querySelector(
			".chat-line__username-container",
		);
		if (usernameContainer instanceof HTMLElement) {
			const firstSpan = usernameContainer.querySelector("span:not([class])");
			if (firstSpan instanceof HTMLElement) {
				return firstSpan;
			}
		}

		return null;
	}

	protected addBadgeToMessage(messageElement: HTMLElement): void {
		const badgesContainer = this.findBadgesContainer(messageElement);
		if (!badgesContainer) {
			return;
		}

		if (badgesContainer.querySelector('[data-provider="chatbridge"]')) {
			return;
		}

		const badge = document.createElement("span");
		badge.setAttribute("data-provider", "chatbridge");
		badge.setAttribute("data-badge", "chatbridge");
		badge.setAttribute("data-version", "1");
		badge.setAttribute("data-tooltip-type", "badge");
		badge.setAttribute("data-badge-idx", "0");

		badge.style.background = "url('https://kick.com/favicon.ico')";
		badge.style.backgroundSize = "1.8rem";
		badge.style.backgroundRepeat = "no-repeat";
		badge.style.backgroundPosition = "center";
		badge.style.borderRadius = "0.2rem";
		badge.style.width = "1.8rem";
		badge.style.height = "1.8rem";
		badge.style.display = "inline-block";
		badge.style.verticalAlign = "middle";

		if (badgesContainer.firstChild) {
			badgesContainer.insertBefore(badge, badgesContainer.firstChild);
		} else {
			badgesContainer.appendChild(badge);
		}
	}

	protected setupObserver(chatContainer: Element): void {
		this.observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				for (const node of Array.from(mutation.addedNodes)) {
					if (!(node instanceof HTMLElement)) continue;

					let messageElement: HTMLElement | null = null;

					if (
						node.classList.contains("chat-line__message") ||
						node.querySelector(".chat-line__message") ||
						node.getAttribute("data-a-target") === "chat-line-message"
					) {
						messageElement = node.classList.contains("chat-line__message")
							? node
							: (node.querySelector(".chat-line__message") as HTMLElement);
					}

					if (!messageElement) continue;

					if (this.containsMarker(messageElement)) {
						this.addBadgeToMessage(messageElement);
					}
				}
			}
		});

		this.observer.observe(chatContainer, {
			childList: true,
			subtree: true,
		});
	}

	protected processExistingMessages(chatContainer: Element): void {
		const existingMessages = chatContainer.querySelectorAll(
			".chat-line__message, [data-a-target='chat-line-message']",
		);
		for (const message of Array.from(existingMessages)) {
			if (message instanceof HTMLElement && this.containsMarker(message)) {
				this.addBadgeToMessage(message);
			}
		}
	}
}
