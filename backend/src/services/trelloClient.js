const axios = require("axios");

const { TRELLO_KEY, TRELLO_TOKEN } = process.env;
const BASE_URL = "https://api.trello.com/1";

function trelloURL(path, extra = "") {
  return `${BASE_URL}${path}?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}${extra}`;
}

module.exports = {
  createCard: async (listId, name, desc) => {
    const url = trelloURL("/cards", `&idList=${listId}&name=${encodeURIComponent(name)}&desc=${encodeURIComponent(desc)}`);
    console.log("CreateCard Trello URL:", url);
    return axios.post(url);
},


  updateCard: async (cardId, fields) => {
    const params = Object.entries(fields)
      .map(([k, v]) => `&${k}=${encodeURIComponent(v)}`)
      .join("");

    return axios.put(trelloURL(`/cards/${cardId}`, params));
  },

  deleteCard: async (cardId) => {
    return axios.put(trelloURL(`/cards/${cardId}`, "&closed=true"));
  },

  createBoard: async (name, defaultLists) => {
    return axios.post(
      trelloURL("/boards", `&name=${encodeURIComponent(name)}&defaultLists=${defaultLists}`)
    );
  }
};
