import { IsOptional, IsString, IsNumber, IsDateString, IsEnum } from 'class-validator'

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsDateString()
  expiration_date?: Date;

  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: string;

  @IsOptional()
  id_category?: number;

  @IsOptional()
  id_supplier?: number;

  @IsOptional()
  @IsString()
  image_url?: string;
}