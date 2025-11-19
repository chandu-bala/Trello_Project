import axios from "axios";

const API_BASE = "http://localhost:4000/api";

// Get all lists + cards for a board
export const getBoardData = async (boardId) => {
  const listsRes = await axios.get(`${API_BASE}/boards/${boardId}/lists`);
  const lists = listsRes.data;

  // Fetch cards for each list

  const listsWithCards = await Promise.all(
    lists.map(async (list) => {
      const cardsRes = await axios.get(`${API_BASE}/boards/${boardId}/lists/${list.id}/cards`);
      return {
        ...list,
        cards: cardsRes.data
      };
    })
  );
  

  return listsWithCards;
};

// Create card
export const createCard = async (payload) => {
  return axios.post(`${API_BASE}/tasks`, payload);
};

// Update card
export const updateCard = async (cardId, payload) => {
  return axios.put(`${API_BASE}/tasks/${cardId}`, payload);
};

// Delete card
export const deleteCard = async (cardId) => {
  return axios.delete(`${API_BASE}/tasks/${cardId}`);
};
