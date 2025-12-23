import { BaseMessageDetector } from "./base-message-detector";

export class KickMessageDetector extends BaseMessageDetector {
  protected getChatContainerSelector(): string {
    return "#chatroom-messages";
  }

  protected findBadgesContainer(
    messageElement: HTMLElement
  ): HTMLElement | null {
    const timestamp = Array.from(messageElement.querySelectorAll("*")).find(
      (el) => {
        const style = (el as HTMLElement).style.cssText || "";
        return (
          style.includes("--chatroom-timestamps-display") ||
          style.includes("var(--chatroom-timestamps-display)")
        );
      }
    ) as HTMLElement | undefined;

    if (!timestamp) {
      return null;
    }

    let sibling = timestamp.nextElementSibling;
    while (sibling) {
      if (sibling.tagName === "DIV") {
        const badgesContainer = sibling.firstElementChild;
        if (badgesContainer instanceof HTMLElement) {
          return badgesContainer;
        }
      }
      sibling = sibling.nextElementSibling;
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

    messageElement.style.background =
      "linear-gradient(to right, #9147FF35, transparent 120px)";

    const wrapper = document.createElement("div");
    wrapper.className =
      "inline-flex shrink-0 items-center size-[calc(1em*(18/13))]";
    wrapper.setAttribute("data-chatbridge-badge-wrapper", "true");
    wrapper.setAttribute("data-provider", "chatbridge");
    wrapper.setAttribute("data-badge", "chatbridge");
    wrapper.setAttribute("data-version", "1");
    wrapper.setAttribute("data-tooltip-type", "badge");
    wrapper.setAttribute("data-badge-idx", "0");

    wrapper.style.backgroundImage =
      "url('https://assets.twitch.tv/assets/favicon-16-52e571ffea063af7a7f4.png')";
    wrapper.style.backgroundSize = "contain";
    wrapper.style.backgroundRepeat = "no-repeat";
    wrapper.style.backgroundPosition = "center";

    if (badgesContainer.firstChild) {
      badgesContainer.insertBefore(wrapper, badgesContainer.firstChild);
    } else {
      badgesContainer.appendChild(wrapper);
    }
  }

  protected setupObserver(chatContainer: Element): void {
    this.observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of Array.from(mutation.addedNodes)) {
          if (!(node instanceof HTMLElement)) continue;

          const checkForMarker = (element: HTMLElement): void => {
            if (this.containsMarker(element)) {
              let current: HTMLElement | null = element;
              let messageElement: HTMLElement | null = null;

              while (current && current !== chatContainer) {
                if (this.findBadgesContainer(current)) {
                  messageElement = current;
                  break;
                }
                current = current.parentElement;
              }

              if (messageElement) {
                const elementToProcess = messageElement;
                setTimeout(() => {
                  this.addBadgeToMessage(elementToProcess);
                }, 0);
              }
            }

            for (const child of Array.from(element.children)) {
              if (child instanceof HTMLElement) {
                checkForMarker(child);
              }
            }
          };

          checkForMarker(node);
        }
      }
    });

    this.observer.observe(chatContainer, {
      childList: true,
      subtree: true,
    });
  }

  protected processExistingMessages(chatContainer: Element): void {
    const allElements = chatContainer.querySelectorAll("*");
    for (const element of Array.from(allElements)) {
      if (element instanceof HTMLElement && this.containsMarker(element)) {
        let messageElement: HTMLElement | null = element;
        while (messageElement && messageElement !== chatContainer) {
          if (this.findBadgesContainer(messageElement)) {
            const elementToProcess = messageElement;
            setTimeout(() => {
              this.addBadgeToMessage(elementToProcess);
            }, 0);
            break;
          }
          messageElement = messageElement.parentElement;
        }
      }
    }
  }
}
