// src/webSocket/ws.js
import {
  ArrayQueue,
  ConstantBackoff,
  WebsocketBuilder,
} from "websocket-ts"; // Correct default import

export const ws = async function(groupId, accessToken) {
    const baseUrl = import.meta.env.VITE_WEBSOCKET_URL || 'ws://localhost:8000/ws';
    const url = `${baseUrl}/chat/${groupId}/?token=${accessToken}`;
    try {
        // This ensures the third argument is correctly interpreted as the options object.
        const socketInstance = new WebsocketBuilder(url)
            .withBuffer(new ArrayQueue())           // buffer messages when disconnected
            .withBackoff(new ConstantBackoff(1000)) // retry every 1s
            .build();

        return socketInstance;
    } catch (error) {
        console.error("[ws.js] Error creating WebSocket instance:", error);
        return null; // Ensure null is returned on error
    }
}
