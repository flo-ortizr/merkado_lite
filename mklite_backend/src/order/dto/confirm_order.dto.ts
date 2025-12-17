export class ConfirmOrderDto {
  delivery_method: 'domicilio' | 'retiro';
  payment_method: 'efectivo';

  items: {
    productId: number;
    quantity: number;
    price: number;
  }[];
}
