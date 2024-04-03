import axios from "axios";

// Set config defaults when creating the instance
// should this be a graphql request instead?
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: { "content-type": "application/json" },
});

export default API;
