import AuthService from "./AuthService";
import { Category } from "../models/Category";

class CategoryService {
  async getCategories(): Promise<Category[]> {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/category`, {
      headers: {
        Authorization: `Bearer ${AuthService.getToken()}`,
      },
    });
    return res.json() as Promise<Category[]>;
  }
}

export default new CategoryService();
