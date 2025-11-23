
import { Role } from "./Role";

export interface User {
   name: string;
  ci: string;
  phone: string;
  email: string;
  password: string; 
  role?: Role; 
}