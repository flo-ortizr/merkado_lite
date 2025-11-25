
import { Role } from "./Role";

export interface User {
   name: string;
  ci: string;
  phone: string;
  email: string;
  password: string; 
  role?: string; 
  status?: string;
  id_role?: number;

}