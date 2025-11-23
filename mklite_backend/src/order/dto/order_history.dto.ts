export class OrderHistoryDto {
  id_order: number;
  order_date: Date;
  status: string;
  total: number;
  payment_method: string;
  delivery_method?: string;
  details: {
    product_name: string;
    quantity: number;
    subtotal: number;
  }[];
}