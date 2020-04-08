import Item from "../models/Item";
import AuthService from "./AuthService";

class ItemService {
  async create(item: Item) {
    return await fetch(`${process.env.REACT_APP_API_URL}/item`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AuthService.getToken()}`
      },
      body: JSON.stringify(item)
    });
  }
}

export default new ItemService();
