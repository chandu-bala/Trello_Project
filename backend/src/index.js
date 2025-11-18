// Load environment variables at the very top
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

// Routes
const taskRoutes = require("./routes/tasks");
const boardRoutes = require("./routes/boards");
const webhookHandler = require("./webhook");

// Initialize Express
const app = express();

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Create HTTP server for WebSockets
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Attach io instance globally so routes & webhook handler can use it
app.set("io", io);

// Log when a client connects to WebSocket
io.on("connection", (socket) => {
  console.log("🔥 WebSocket Client Connected:", socket.id);
});

// Debug: Confirm env variables are loaded
console.log("Trello Key Loaded:", process.env.TRELLO_KEY ? "YES" : "NO");
console.log("Trello Token Loaded:", process.env.TRELLO_TOKEN ? "YES" : "NO");

// Routes (Order matters: webhook should not be behind authentication)
app.use("/api/tasks", taskRoutes);
app.use("/api/boards", boardRoutes);

// Trello webhook verification (GET)
app.get("/trello/webhook", (req, res) => {
  res.status(200).send("Webhook Verified");
});

// Trello webhook listener (POST)
app.post("/trello/webhook", webhookHandler);

// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
