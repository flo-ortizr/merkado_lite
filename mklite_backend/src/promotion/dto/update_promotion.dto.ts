import { IsString, IsEnum, IsNumber, IsOptional, IsDateString, IsArray } from 'class-validator';

export class UpdatePromotionDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(['percentage', 'fixed', 'buy_x_get_y'])
  discount_type?: string;

  @IsOptional()
  @IsNumber()
  value?: number;

  @IsOptional()
  @IsNumber()
  buy_x?: number;

  @IsOptional()
  @IsNumber()
  get_y?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;

  @IsOptional()
  @IsArray()
  product_ids?: number[];
}
