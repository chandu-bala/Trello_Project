const express = require("express");
const router = express.Router();
const trello = require("../services/trelloClient");

// CREATE Card
router.post("/", async (req, res) => {
  try {
    const { listId, name, desc } = req.body;
    const result = await trello.createCard(listId, name, desc);
    res.json(result.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE Card
router.put("/:cardId", async (req, res) => {
  try {
    const cardId = req.params.cardId;
    const result = await trello.updateCard(cardId, req.body);
    res.json(result.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE Card (closed=true)
router.delete("/:cardId", async (req, res) => {
  try {
    const cardId = req.params.cardId;
    await trello.deleteCard(cardId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
