// src/models/ConfirmOrderDto.ts
export interface ConfirmOrderDto {
  delivery_method: 'domicilio' | 'retiro';
  payment_method: 'efectivo' | 'tarjeta';
  items: { productId: number; quantity: number }[];
}
