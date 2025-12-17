import { Product } from "./Product";
import { Order } from "./Order";

export interface OrderDetail {
  id_order_detail: number;
  order: Order;
  product: Product;
  quantity: number;
  subtotal: number;
}
