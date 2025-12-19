# ChatBridge

<img src="public/icons/128.png" alt="ChatBridge Icon" width="128" height="128">

Chrome extension that connects Kick and Twitch chats together, allowing you to easily read messages from both platforms in one place. Watching multistreams becomes much easier!

## How it works?

ChatBridge intercepts WebSocket connections from both platforms and "adds" messages from one platform as native messages on the other. This way, messages don't look different and work as native chat messages.

- **On Twitch**: you see Kick messages as native Twitch messages
- **On Kick**: you see Twitch messages as native Kick messages

## Installation

1. Go to the [Releases](https://github.com/ike-gg/chatbridge/releases) section and download the latest ZIP file
2. Extract the downloaded ZIP file
3. Open Chrome and go to `chrome://extensions/`
4. Enable Developer mode in the top right corner
5. Click "Load unpacked"
6. Select the folder with the extracted extension

Done! The extension will automatically connect chats when you're on Twitch or Kick.

## Usage

By default, channels are connected by the same name. For example, if you visit `xqc` on Twitch, it will automatically connect to `xqc` on Kick.

If channels have different usernames, you can click the extension icon to change the channel mapping and connect them manually.
