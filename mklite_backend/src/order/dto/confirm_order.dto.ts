export class ConfirmOrderDto {
  delivery_method: 'domicilio' | 'retiro';
  payment_method: 'efectivo'; // único permitido
}
