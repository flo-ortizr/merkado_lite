import { IsNotEmpty, IsString, IsNumber, IsOptional, IsDateString, IsEnum } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsDateString()
  expiration_date?: Date;

  @IsOptional()
  @IsEnum(['active', 'inactive'])
  status?: string;

  @IsNotEmpty()
  id_category: number;

  @IsNotEmpty()
  id_supplier: number;

  @IsOptional()
  @IsString()
  image_url?: string;
}