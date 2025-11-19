# 🚀 Trello Real-Time Frontend: React + Vite + WebSockets + Drag & Drop

This repository contains the frontend component for the "Trello Real-Time WebSockets + API Frontend Assignment." It implements a **Trello-like board user interface (UI)** designed for real-time collaboration and synchronization.

## 📘 Overview

This application fulfills the requirement of building a single-page Trello-style UI that leverages **WebSockets** for live, multi-client updates.

Key features include:

* **Real-time Updates:** Live synchronization across multiple browser clients via WebSockets.
* **Drag & Drop:** Intuitive movement of cards between lists using the drag-and-drop feature.
* **CRUD Operations:** Full functionality for creating, updating, and deleting Trello cards.
* **Dynamic Rendering:** Displaying lists and cards fetched from the integrated backend API.

## 🧱 Tech Stack

| Component | Technology Used |
| :--- | :--- |
| **Frontend Framework** | React (Vite) |
| **Networking** | Axios |
| **Real-time Sync** | Socket.IO Client |
| **Drag & Drop** | `react-beautiful-dnd` |
| **Styling** | Inline CSS / Custom |
| **Backend Interaction** | REST API + WebSockets |

---

## 📦 Prerequisites

Before running the frontend, ensure the following are installed and configured:

* **Node.js** (v16+ recommended)
* **npm** or **yarn**
* **Backend Server:** The associated backend must be running and accessible at:
    `http://localhost:4000`
* **Backend Webhook:** The backend requires an ngrok tunnel (or similar) configured for the Trello API webhook.

> **Note:** Trello API Key and Token are securely managed by the backend and are **never** exposed in the frontend.

---

## ⚙️ Installation & Setup

Follow these steps to get the frontend server running:

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/chandu-bala/Trello_Project
cd frontend
```
### 2️⃣ Install Dependencies
```Bash
npm install
```
or
```
yarn install
```

### 3️⃣ Start Frontend Server
```
npm run dev
```

The application will typically be accessible at: http://localhost:5173

---
# ⚙️ Technical Deep Dive

This section provides a closer look at the frontend project's structure, API communication, and core real-time synchronization mechanisms.

## 🧩 Project Structure

The project is structured following standard React conventions for clarity and maintainability.

| Path | Description | Key Files |
| :--- | :--- | :--- |
| `frontend/src/api/` | Handles all **Axios HTTP requests** to the dedicated backend service. | `trello.js` |
| `frontend/src/components/` | Contains the reusable UI building blocks for the Trello board. | `Board.jsx` (Main container), `List.jsx` (Droppable area), `CardItem.jsx` (Draggable item) |
| `frontend/src/hooks/` | Houses custom React hooks, crucial for abstracting logic like real-time connectivity. | `useTrelloSocket.js` (WebSocket connection logic) |
| `frontend/` (Root) | Main application entry points and configuration. | `App.jsx`, `main.jsx`, `package.json`, `vite.config.js` |

---

## 🔌 Backend Connectivity (REST API)

The frontend only communicates with the dedicated intermediate backend service, ensuring the **Trello API Keys are never exposed**. The backend is responsible for all interactions with the external Trello platform.

| Action | Backend Route | HTTP Method |
| :--- | :--- | :--- |
| Get board lists | `/api/boards/:boardId/lists` | `GET` |
| Get cards in a list | `/api/boards/:boardId/lists/:listId/cards` | `GET` |
| Create card | `/api/tasks` | `POST` |
| Update card | `/api/tasks/:cardId` | `PUT` |
| Delete card | `/api/tasks/:cardId` | `DELETE` |

---

## 🔥 WebSockets (Real-Time Sync)

Real-time updates are the core feature, implemented using the **Socket.IO Client** for instant synchronization across all connected clients (browser windows).

* **Location:** `src/hooks/useTrelloSocket.js`
* **Connection:** Establishes a connection to the backend Socket.IO server at `http://localhost:4000`.
* **Mechanism:**
    1.  The backend receives a Trello webhook event.
    2.  The backend processes the event and broadcasts a `"trello-event"` via WebSocket.
    3.  The `useTrelloSocket` hook listens for this event.
    4.  The hook triggers a provided callback (e.g., `fetchBoard()`) within `Board.jsx` to **re-fetch the current board state**.

> **Example Usage in Board.jsx:**
> ```javascript
> useTrelloSocket(() => {
>   fetchBoard(); // Forces UI reload on any received real-time event
> });
> ```

This ensures the UI remains up-to-date **without a manual page refresh**. 

---

## 🧲 Drag & Drop Implementation (Bonus Feature)

The visual card manipulation is handled by the `react-beautiful-dnd` library.

| Component | `react-beautiful-dnd` Role | Description |
| :--- | :--- | :--- |
| **Board.jsx** | `DragDropContext` | Wraps the entire board, managing drag operations. |
| **List.jsx** | `Droppable` | Defines the vertical list area where cards can be dropped. |
| **CardItem.jsx**| `Draggable` | Represents an item that can be picked up and moved. |

### Movement API Action

When a card is successfully dropped into a new list, the `onDragEnd` handler triggers an API call to update its list ID:

**PUT /api/tasks/:cardId**
```json
{
  "idList": "<new_list_id>"
}
```
---
## 🧪 How to Test the Frontend

To verify the real-time functionality and data synchronization of the Trello UI:

1.  **Open two browser windows**
    * `http://localhost:5173`

2.  **Perform actions** (in either window):
    * Add a new card
    * Edit card title
    * Delete a card
    * Drag a card between lists
    * Update card directly in Trello UI (external action)

3.  **Expected Outcome:**
    * Both windows update instantly
    * Backend logs show WebSocket connections
    * Webhook events broadcast correctly
    * UI reloads without refresh