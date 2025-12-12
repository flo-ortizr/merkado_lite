import { Product } from "./Product";

export interface Promotion {
 id_promotion?: number;
  name: string;
  discount_type: "percentage" | "fixed" | "buy_x_get_y";
  value: number;

  buy_x?: number;
  get_y?: number;

  description?: string;

  start_date: string; 
  end_date: string;

  status: "scheduled" | "active" | "expired";

  products: Product[];
}
