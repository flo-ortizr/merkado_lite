import { IsInt, IsArray, IsNotEmpty, Min } from 'class-validator';

export class CreatePurchaseOrderDto {
  @IsInt()
  supplierId: number;

  @IsArray()
  @IsNotEmpty({ each: true })
  products: { productId: number; quantity: number }[];

  @Min(0)
  total: number;
}
