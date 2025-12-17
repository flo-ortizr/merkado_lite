import { Category } from "./Category";

export interface Product {
  id_product: number;
  name: string;
  price: string;
  description: string;
  status: string;
  image_url?: string;
  category: Category;
}
