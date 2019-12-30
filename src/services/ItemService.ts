import Item from "../models/Item";

class ItemService {
  async create(item: Item) {
    return await fetch(`${process.env.REACT_APP_API_URL}/item`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(item)
    });
  }
}

export default new ItemService();
