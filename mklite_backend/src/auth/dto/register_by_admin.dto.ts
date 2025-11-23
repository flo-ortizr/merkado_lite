// src/auth/dto/register-by-admin.dto.ts
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterByAdminDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;

  @IsString()
  ci: string;

  @IsString()
  phone: string;

  @IsString()
  roleName: string; // Vendedor, Repartidor, etc
}
