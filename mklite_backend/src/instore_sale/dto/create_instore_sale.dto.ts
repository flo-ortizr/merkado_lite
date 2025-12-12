import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class InStoreSaleItemDto {
  @IsNotEmpty()
  @IsInt()
  productId: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  quantity: number;
}

export class CreateInStoreSaleDto {
  @IsNotEmpty()
  @IsInt()
  userId: number; // vendedor que registra la venta

  @IsNotEmpty()
  items: InStoreSaleItemDto[];

  @IsNotEmpty()
  payment_method: string; // siempre 'efectivo' por ahora
}