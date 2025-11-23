// src/auth/dto/register-client.dto.ts
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterClientDto {
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
}
