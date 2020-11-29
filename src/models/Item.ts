export default interface Item {
  name: string;
  category_id: number;
  url: string;
  price: number;
  id: number;
  user_id: string;
  image_url: string;
}

export interface CreateItemRequest {
  name: string;
  category_id: number;
  url: string;
  price: number;
  image_url: string;
}
