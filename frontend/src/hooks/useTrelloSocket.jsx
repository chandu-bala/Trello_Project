import { useEffect } from "react";
import { io } from "socket.io-client";

export default function useTrelloSocket(onEvent) {
  useEffect(() => {
    const socket = io("http://localhost:4000");

    socket.on("connect", () => {
      console.log("🟢 Connected to WebSocket:", socket.id);
    });

    socket.on("trello-event", (event) => {
      console.log("📩 Trello Webhook Event:", event);
      onEvent(event);
    });

    return () => socket.disconnect();
  }, []);
}
