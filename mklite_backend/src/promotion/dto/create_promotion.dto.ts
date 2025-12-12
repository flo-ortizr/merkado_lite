import { IsString, IsEnum, IsNumber, IsOptional, IsDateString, IsArray } from 'class-validator';

export class CreatePromotionDto {
  @IsString()
  name: string;

  @IsEnum(['percentage', 'fixed', 'buy_x_get_y'])
  discount_type: string;

  @IsNumber()
  value: number;

  @IsOptional()
  @IsNumber()
  buy_x?: number;

  @IsOptional()
  @IsNumber()
  get_y?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  start_date: string;

  @IsDateString()
  end_date: string;

  @IsArray()
  product_ids: number[];
}
