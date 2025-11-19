# 📌 Trello Real-Time Backend  
Node.js + Express + WebSockets + Trello REST API + Webhooks

This backend is built for the “**Trello Real-time WebSockets + API Frontend Assignment**”.

It integrates Trello’s REST API with a custom WebSocket server to enable **real-time multi-client updates**.

---

# 🚀 Features

### ✔ CRUD APIs (Required)
Implements all required endpoints:

| Operation | Method | Endpoint |
|----------|--------|----------|
| Create Task (Card) | POST | `/api/tasks` |
| Update Task | PUT | `/api/tasks/:cardId` |
| Delete Task | DELETE | `/api/tasks/:cardId` |
| Create Board | POST | `/api/boards` |

### ✔ Additional Supporting APIs
| Operation | Endpoint |
|----------|----------|
| Get Lists of a Board | `/api/boards/:boardId/lists` |
| Get Cards in a List | `/api/boards/:boardId/lists/:listId/cards` |

These endpoints help the frontend fetch complete board → lists → cards.

---

# 🔁 Webhooks + Real-Time Sync

### ✔ Trello → Webhook → WebSocket → Frontend

1. Any Trello action occurs (create/move/edit/delete card).  
2. Trello sends a webhook to:  
```
POST /trello/webhook
```
3. Backend broadcasts the event using Socket.IO:  

```
io.emit("trello-event", event)
```
4. All frontend clients instantly refresh UI.

This satisfies the assignment’s **real-time synchronization requirement**.

---

# 🔑 Environment Variables

Create `.env` inside `backend/`:


```bash
TRELLO_KEY=your_trello_api_key
TRELLO_TOKEN=your_trello_token
PORT=4000
```


---

# 📦 Installation

```bash
cd backend
npm install
```

### ▶️ Run Backend
```
npm run dev
```

### Expected output:
```
Trello Key Loaded: YES
Trello Token Loaded: YES
🚀 Backend running at http://localhost:4000
🔥 WebSocket Client Connected: <id>
```
# 🌍 Expose Backend Using ngrok

Trello webhooks require a public URL.
```
ngrok http 4000
```

You will get:
```bash
Forwarding https://xxxxxx.ngrok-free.dev → http://localhost:4000
```

Use this HTTPS URL when creating the Trello webhook.

# 🔗 Register Trello Webhook

**Replace:**

< TOKEN > → your Trello token

< BOARD_ID > → your board ID

< NGROK_URL > → your ngrok URL

### PowerShell command:
```bash
Invoke-RestMethod `
  -Uri "https://api.trello.com/1/webhooks?key=<TRELLO_KEY>&token=<TOKEN>" `
  -Method Post `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body "{
    \"description\": \"Realtime Webhook\",
    \"callbackURL\": \"<NGROK_URL>/trello/webhook\",
    \"idModel\": \"<BOARD_ID>\"
  }"
  ```
  ---
  # 🛠 Tech Stack

  | Component         | Tech            |
| ----------------- | --------------- |
| Backend Framework | Express.js      |
| Trello API Client | Axios           |
| Real-Time Engine  | Socket.IO       |
| Webhooks          | Trello Webhooks |
| Local Tunnel      | ngrok           |

---

# ▶️ Run Frontend
```
npm run dev
```

The app opens at:
```
http://localhost:5173/
```

# 🔌API Configuration

Frontend expects backend at:
```
http://localhost:4000
```

All API calls go through:
```
src/api/trello.js
```

# 🔥 WebSocket Integration (Real-Time)
```
src/hooks/useTrelloSocket.js
```

Connects to backend WebSocket

Receives `"trello-event"`

Calls `fetchBoard()` to refresh UI

This fulfills the assignment’s real-time requirement.

# 🎯 Drag & Drop

Using:
```
react-beautiful-dnd
```

Implemented via:

- < DragDropContext onDragEnd={handleDragEnd}>

- < Droppable droppableId={list.id}>

- < Draggable draggableId={card.id}>

On drag end:
```
PUT /api/tasks/:cardId   { idList: newListId }
```

Backend updates Trello → Webhook broadcasts → UI syncs.

---

# 🛠 Tech Stack(Frontend)

| Component          | Tech                |
| ------------------ | ------------------- |
| Frontend Framework | React + Vite        |
| HTTP Client        | Axios               |
| Real-Time          | Socket.IO Client    |
| Drag & Drop        | react-beautiful-dnd |
