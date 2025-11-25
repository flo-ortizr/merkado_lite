import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles'; //clave para almacenar roles en metadatos
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles); //decorador para asignar a endpoints
