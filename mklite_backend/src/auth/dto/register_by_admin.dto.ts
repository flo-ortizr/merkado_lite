import { IsEmail, IsString, MinLength } from 'class-validator';
//Admi registra nuevos usuarios con roles específicos
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
  roleName: string; // Vendedor, Repartidor, Encargado de Almacen, etc
}
