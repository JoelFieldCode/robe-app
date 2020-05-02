import AuthService from "./AuthService";
import { Category } from "../models/Category";
import API from "./Api";

class CategoryService {
  async getCategories(): Promise<Category[]> {
    const res = await API.get("/category", {
      headers: AuthService.getAuthHeaders(),
    });
    return res.data;
  }
}

export default new CategoryService();
