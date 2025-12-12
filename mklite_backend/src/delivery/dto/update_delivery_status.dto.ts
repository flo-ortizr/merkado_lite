export class UpdateDeliveryStatusDto {
  id_delivery: number;
  status: 'on_way' | 'delivered' | 'cancelled';
}
