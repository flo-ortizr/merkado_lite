import { User } from "@/app/models/User";
import api from "@/services/api";


export const registerUser = async (userData: User) => {
  try {
    const response = await api.post("/user", userData); 
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error registrando usuario");
  }
};

