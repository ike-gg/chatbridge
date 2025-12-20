(window as unknown as { twitchWebSocket: WebSocket | null }).twitchWebSocket =
	null;
(window as unknown as { kickWebSocket: WebSocket | null }).kickWebSocket = null;

const wsInstances = new WeakMap<
	WebSocket,
	{
		messageListeners: Array<(event: MessageEvent) => void>;
		originalOnMessage: ((event: MessageEvent) => void) | null;
	}
>();

const originalAddEventListener = WebSocket.prototype.addEventListener;
const originalOnMessageDescriptor =
	Object.getOwnPropertyDescriptor(WebSocket.prototype, "onmessage") ||
	Object.getOwnPropertyDescriptor(
		Object.getPrototypeOf(WebSocket.prototype),
		"onmessage",
	);

WebSocket.prototype.addEventListener = function (
	type: string,
	listener: EventListener | EventListenerObject | null,
	options?: boolean | AddEventListenerOptions,
) {
	if (type === "message" && listener) {
		const wsData = wsInstances.get(this);
		if (wsData) {
			wsData.messageListeners.push(listener as (event: MessageEvent) => void);
		}
	}
	if (listener) {
		return originalAddEventListener.call(this, type, listener, options);
	}
	return undefined;
};

Object.defineProperty(WebSocket.prototype, "onmessage", {
	get() {
		const wsData = wsInstances.get(this);
		return wsData?.originalOnMessage || null;
	},
	set(handler: ((event: MessageEvent) => void) | null) {
		const wsData = wsInstances.get(this);
		if (wsData) {
			wsData.originalOnMessage = handler;
		}
		if (originalOnMessageDescriptor?.set) {
			originalOnMessageDescriptor.set.call(this, handler);
		}
	},
	configurable: true,
	enumerable: true,
});

const OriginalWebSocket = window.WebSocket;
(window.WebSocket as unknown) = function (
	this: WebSocket,
	url: string | URL,
	protocols?: string | string[],
): WebSocket {
	const ws = new OriginalWebSocket(url, protocols);

	const urlString = typeof url === "string" ? url : url.toString();
	const isTwitchWebSocket =
		urlString.includes("wss://irc-ws.chat.twitch.tv/") ||
		urlString.includes("irc-ws.chat.twitch.tv");
	const isKickWebSocket = urlString.includes("ws-us2.pusher.com");

	if (isTwitchWebSocket) {
		console.log("Twitch WebSocket detected and stored", urlString);
		(window as unknown as { twitchWebSocket: WebSocket }).twitchWebSocket = ws;
	}

	if (isKickWebSocket) {
		console.log("Kick WebSocket detected and stored", urlString);
		(window as unknown as { kickWebSocket: WebSocket }).kickWebSocket = ws;
	}

	wsInstances.set(ws, {
		messageListeners: [],
		originalOnMessage: null,
	});

	const originalOnMessage = ws.onmessage;
	ws.onmessage = function (event: MessageEvent) {
		if (originalOnMessage) {
			originalOnMessage.call(this, event);
		}

		const wsData = wsInstances.get(ws);
		if (wsData) {
			for (const listener of wsData.messageListeners) {
				try {
					listener.call(this, event);
				} catch (error) {
					console.error("Error in message listener:", error);
				}
			}
		}
	};

	return ws;
} as unknown as typeof WebSocket;

Object.setPrototypeOf(window.WebSocket, OriginalWebSocket);
Object.defineProperty(window.WebSocket, "prototype", {
	value: OriginalWebSocket.prototype,
	writable: false,
});

function injectWebSocketMessage(ws: WebSocket, data: string | object) {
	const wsData = wsInstances.get(ws);
	if (!wsData) {
		console.warn("WebSocket instance not tracked");
		return;
	}

	const messageData = typeof data === "string" ? data : JSON.stringify(data);
	const fakeEvent = new MessageEvent("message", {
		data: messageData,
		origin: ws.url,
		lastEventId: "",
		source: null,
		ports: [],
	});

	if (wsData.originalOnMessage) {
		try {
			wsData.originalOnMessage.call(ws, fakeEvent);
		} catch (error) {
			console.error("Error in original onmessage handler:", error);
		}
	}

	for (const listener of wsData.messageListeners) {
		try {
			listener.call(ws, fakeEvent);
		} catch (error) {
			console.error("Error in message listener:", error);
		}
	}
}

(
	window as unknown as { injectWebSocketMessage: typeof injectWebSocketMessage }
).injectWebSocketMessage = injectWebSocketMessage;

window.addEventListener("message", ((event: MessageEvent) => {
	if (
		event.data?.type === "__extension_inject_twitch_message" &&
		event.data?.data
	) {
		const twitchWs = (
			window as unknown as {
				twitchWebSocket: WebSocket | null;
			}
		).twitchWebSocket;
		if (twitchWs && injectWebSocketMessage) {
			injectWebSocketMessage(twitchWs, event.data.data);
		}
	}
}) as EventListener);

window.addEventListener("message", ((event: MessageEvent) => {
	if (
		event.data?.type === "__extension_inject_kick_message" &&
		event.data?.data
	) {
		const kickWs = (
			window as unknown as {
				kickWebSocket: WebSocket | null;
			}
		).kickWebSocket;
		if (kickWs && injectWebSocketMessage) {
			injectWebSocketMessage(kickWs, event.data.data);
		}
	}
}) as EventListener);

export type InjectWebSocketMessage = typeof injectWebSocketMessage;
