module.exports = (req, res) => {
  res.status(200).send("OK");          // MUST respond immediately

  const io = req.app.get("io");
  const action = req.body.action;

  if (!action) return;

  // Normalize event shape
  const event = {
    type: action.type,
    boardId: action.data.board?.id,
    list: action.data.list || null,
    card: action.data.card || null,
    timestamp: Date.now(),
  };

  // Emit global real-time event
  io.emit("trello-event", event);

  console.log("🔁 Event Broadcasted:", event.type);
};
