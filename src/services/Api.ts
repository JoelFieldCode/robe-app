import axios from "axios";

// Set config defaults when creating the instance
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: "application/json",
});

export default API;
