export class ReturnItemDto {
  saleId: number;
  userId: number;      
  productId: number;
  quantity: number;     // cantidad a devolver
  reason: string;       // motivo de la devolución
}
