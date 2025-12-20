import { WebSocketInjector } from "./websocket-injector";

const MESSAGE_MARKER = WebSocketInjector.getMessageMarker();
const CHECK_INTERVAL = 500;
const MAX_ATTEMPTS = 30;

export abstract class BaseMessageDetector {
	protected messageMarker = MESSAGE_MARKER;
	protected observer: MutationObserver | null = null;

	protected containsMarker(element: HTMLElement): boolean {
		const textContent = element.textContent || "";
		return textContent.includes(this.messageMarker);
	}

	protected abstract getChatContainerSelector(): string;
	protected abstract processExistingMessages(container: Element): void;
	protected abstract setupObserver(container: Element): void;
	protected abstract addBadgeToMessage(messageElement: HTMLElement): void;

	start(maxAttempts = MAX_ATTEMPTS): void {
		let attempts = 0;

		const checkContainer = (): void => {
			const container = document.querySelector(this.getChatContainerSelector());

			if (container) {
				this.setupObserver(container);
				this.processExistingMessages(container);
			} else {
				attempts++;
				if (attempts < maxAttempts) {
					setTimeout(checkContainer, CHECK_INTERVAL);
				}
			}
		};

		checkContainer();
	}

	stop(): void {
		if (this.observer) {
			this.observer.disconnect();
			this.observer = null;
		}
	}
}
