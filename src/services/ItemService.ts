import Item from "../models/Item";
import AuthService from "./AuthService";
import API from "./Api";

class ItemService {
  async create(item: Item) {
    return await API.post("/item", item, {
      headers: AuthService.getAuthHeaders(),
    });
  }
}

export default new ItemService();
