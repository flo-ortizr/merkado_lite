import { IsInt, IsArray, IsNotEmpty, Min } from 'class-validator';

export class CreatePurchaseOrderDto {
  @IsInt()
  supplierId: number;

  @IsArray()
  @IsNotEmpty({ each: true })
  products: { productId: number; quantity: number; unit_price: number }[];

  @Min(0)
  total: number;
}
