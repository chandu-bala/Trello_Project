const express = require("express");
const router = express.Router();
const trello = require("../services/trelloClient");
const axios = require("axios");

const BASE_URL = "https://api.trello.com/1";
const key = process.env.TRELLO_KEY;
const token = process.env.TRELLO_TOKEN;

/**
 * ---------------------------------------------------------
 * CREATE BOARD
 * POST /api/boards
 * ---------------------------------------------------------
 */
router.post("/", async (req, res) => {
  try {
    const { name, defaultLists } = req.body;
    const result = await trello.createBoard(name, defaultLists);
    res.json(result.data);
  } catch (err) {
    console.error("❌ Error creating board:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * ---------------------------------------------------------
 * GET LISTS FOR A BOARD
 * GET /api/boards/:boardId/lists
 * ---------------------------------------------------------
 */
router.get("/:boardId/lists", async (req, res) => {
  const { boardId } = req.params;

  try {
    const url = `${BASE_URL}/boards/${boardId}/lists?key=${key}&token=${token}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    console.error("❌ Error fetching lists:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * ---------------------------------------------------------
 * GET CARDS FOR A LIST
 * GET /api/boards/:boardId/lists/:listId/cards
 * ---------------------------------------------------------
 */
router.get("/:boardId/lists/:listId/cards", async (req, res) => {
  const { listId } = req.params;

  try {
    const url = `${BASE_URL}/lists/${listId}/cards?key=${key}&token=${token}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    console.error("❌ Error fetching cards:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
