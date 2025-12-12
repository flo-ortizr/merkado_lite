export class CancelSaleDto {
  saleId: number;
  userId: number;        // vendedor que realiza la anulación
  reason: string;        // motivo de la anulación
}
