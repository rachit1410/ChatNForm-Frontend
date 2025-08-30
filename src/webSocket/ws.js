// src/webSocket/ws.js
import {
  ArrayQueue,
  WebsocketBuilder,
} from "websocket-ts"; // Correct default import

export const ws = async function(groupId, accessToken) {
    const baseUrl = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:8000/ws';
    // encode path/query parts to avoid malformed handshake URLs
    const encGroupId = encodeURIComponent(String(groupId));
    const encToken = encodeURIComponent(String(accessToken));
    const url = `${baseUrl}/chat/${encGroupId}/?token=${encToken}`;
    console.debug("[ws.js] connecting to", url);
    try {
        // This ensures the third argument is correctly interpreted as the options object.
        const socketInstance = new WebsocketBuilder(url)
            .withBuffer(new ArrayQueue())           // buffer messages when disconnected
            .build();

        return socketInstance;
    } catch (error) {
        console.error("[ws.js] Error creating WebSocket instance:", error);
        return null; // Ensure null is returned on error
    }
}
