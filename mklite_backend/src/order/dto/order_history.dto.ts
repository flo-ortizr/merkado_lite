export class OrderHistoryDto {
  id_order: number;
  order_date: Date;
  status: string;
  total: number;
  details: {
    product_name: string;
  }[];
}