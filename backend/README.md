# Trello Real-Time Backend
Node.js + Express + WebSockets + Trello REST API + Webhooks

## 📘 Overview

This backend is built as part of the “Trello Real-Time WebSockets + API Frontend Assignment”.

This backend powers a Trello-like real-time board application by integrating:

- Trello’s REST API for data storage

- Webhooks for change detection

- WebSockets for instant UI updates

- Secure server-side Trello API integration

- Custom APIs for frontend communication

---
## ✨ Key Features

### 1. 🌐 REST API Wrapper
Direct access to core Trello functionality via custom, simplified endpoints:
* **Board/Card Management:** Create, Update, Delete Cards and Boards.
* **Data Retrieval:** Get Lists in a Board and Cards in a specific List.

### 2. ⚡ Real-Time Sync
Leverages **Socket.IO** for instant, multi-user collaboration.
* The backend emits a `"trello-event"` to all connected clients.
* The frontend instantly refreshes, providing a live view of changes.

### 3. 🎣 Trello Webhook Integration
Enables external Trello changes to be reflected immediately in the application.
1.  Receives the Trello webhook at `/trello/webhook`.
2.  Normalizes the event data.
3.  Broadcasts the event via WebSockets for instant frontend updates.

### 4. 🧩 Clean Abstraction Layer
A dedicated **`services/trelloClient.js`** file centralizes all Trello API interactions, including URL building and secure key management via environment variables.

### 5. 🔄 Full CRUD Support
Standard REST endpoints for complete task lifecycle management:
* `POST /api/tasks` → **Create** Task
* `PUT /api/tasks/:cardId` → **Update** Task
* `DELETE /api/tasks/:cardId` → **Delete** Task
* All changes trigger real-time updates.
---
# 🔑 Environment Variables (.env)

Create a file .env inside backend folder:
```bash
TRELLO_KEY=your_trello_api_key
TRELLO_TOKEN=your_trello_api_token
PORT=4000
```
---
# 📦 Prerequisites

Before running the backend, install:



✔ ngrok

Required for Trello webhook
Download → 
```
https://ngrok.com/download
```

✔ Trello Developer API Key
```
https://trello.com/app-key
```
✔ Trello Token (Manual OAuth Token)

You get it after clicking “Generate Token” on the same page.

---

# ⚙️ Installation & Execution
### 1. Install Dependencies
```bash
cd backend
npm install
```
### 2. Run Backend Server
```bash
npm run dev
```

Expected output:
```bash
Trello Key Loaded: YES
Trello Token Loaded: YES
🚀 Backend running at http://localhost:4000
🔥 WebSocket Client Connected: <socket-id>
```
---
# 🌍 Expose Localhost via ngrok (Webhook Required)

### Trello requires a public URL.

Run:
```bash
ngrok http 4000
```

You will get:
```bash
Forwarding https://xyz.ngrok-free.dev → http://localhost:4000
```
Use this HTTPS URL for webhook registration.

---

📌 UPDATE THIS NGROK URL INSIDE THE WEBHOOK REGISTRATION COMMAND

This is the ONLY place where ngrok URL must be updated.

---


# 🔗 Webhook Registration Command (PowerShell Compatible)

Replace:

- `<NGROK_URL>` with your ngrok HTTPS URL

- ``<TRELLO_TOKEN>`` with your Trello token
```bash

Invoke-RestMethod `
  -Uri "https://api.trello.com/1/webhooks?key=$env:TRELLO_KEY&token=<TRELLO_TOKEN>" `
  -Method Post `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body "{
    \"description\": \"Realtime Webhook\",
    \"callbackURL\": \"<NGROK_URL>/trello/webhook\",
    \"idModel\": \"<BOARD_ID>\"
  }"
```
---

# 🔥 API Endpoints
### 📌 1. Create Board
POST /api/boards


Body:
```json
{
  "name": "Hiring Test Board",
  "defaultLists": true
}
```
Copy Id:"__" from the response Section. 
### 📌 2. Create Task (Card)

POST /api/tasks


Body:
```json
{
  "boardId": "xxx",
  "listId": "xxx",
  "name": "Task title",
  "desc": "Task details"
}
```
Copy card Id:"__" from the response Section. 
### 📌 3. Update Task
PUT /api/tasks/:cardId

Body:
```json
{
  "name": "Updated title",
  "desc": "Updated description",
  "idList": "new_list_id"
}
```

### 📌 4. Delete Task
DELETE /api/tasks/:cardId


Behavior:

- Trello card is marked closed=true

- Trigger webhook → WebSocket event → UI updates

### 📌 5. Get All Lists of Board
```ruby
GET /api/boards/:boardId/lists
```
### 📌 6. Get Cards in a List
```ruby
GET /api/boards/:boardId/lists/:listId/cards
```

---
# 🔥 Real-Time Event Flow
### ▶ 1. Any action happens (create/move/edit/delete)

Either from frontend or Trello UI

### ▶ 2. Trello sends webhook → backend /trello/webhook
### ▶ 3. Backend normalizes event

Example:
```bash
{
  "action": "updateCard",
  "cardId": "...",
  "listId": "..."
}
```

### ▶ 4. Backend emits event via WebSocket
```bash
io.emit("trello-event", event)
```
### ▶ 5. All clients instantly reload board data

---
# 🛠 Tech Stack
| Component | Technology |
| :--- | :--- |
| **Server Framework** | Express.js |
| **WebSockets** | Socket.IO |
| **API Client** | Axios |
| **Trello API** | REST (v1) |
| **Webhooks** | Trello Webhooks |
| **Tunnel** | ngrok |