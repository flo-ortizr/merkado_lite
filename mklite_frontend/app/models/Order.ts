import { OrderDetail } from "./OrderDetail";
import { Delivery } from "./Delivery";
import { User } from "./User";

export interface Order {
  id_order: number;
  customer?: User;
  order_date: string; // en frontend siempre string (ISO)
  status: 'pending' | 'delivered' | 'cancelled';
  total: number;
  payment_method: string;
  details: OrderDetail[];
  delivery?: Delivery;
}
