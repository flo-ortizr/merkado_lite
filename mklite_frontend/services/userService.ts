import { User } from "@/app/models/User";
import api from "@/services/api";

// 👉 CREATE (Registrar usuario)
export const registerUser = async (userData: User) => {
  try {
    const response = await api.post("/user", userData);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error registrando usuario"
    );
  }
};

// 👉 READ (Listar usuarios)
export const getUsers = async () => {
  try {
    const response = await api.get("/user");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error obteniendo usuarios"
    );
  }
};

// 👉 READ by ID (Obtener un usuario por ID)
export const getUserById = async (id: number) => {
  try {
    const response = await api.get(`/user/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error obteniendo usuario"
    );
  }
};

// 👉 UPDATE (Editar usuario)
export const updateUser = async (id: number, updatedData: Partial<User>) => {
  try {
    const response = await api.put(`/user/${id}`, updatedData);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error actualizando usuario"
    );
  }
};

// 👉 DELETE / DISABLE (Deshabilitar usuario → cambia status)
export const disableUser = async (id: number) => {
  try {
    const response = await api.delete(`/user/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error deshabilitando usuario"
    );
  }
};
