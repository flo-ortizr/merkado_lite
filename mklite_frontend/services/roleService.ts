import { Role } from "@/app/models/Role"; // Asegúrate de tener tu modelo Role
import api from "@/services/api";

// 👉 CREATE (Registrar rol)
export const createRole = async (roleData: Role) => {
  try {
    const response = await api.post("/role", roleData);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error creando rol"
    );
  }
};

// 👉 READ (Listar todos los roles)
export const getAllRoles = async () => {
  try {
    const response = await api.get("/role");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error obteniendo roles"
    );
  }
};

// 👉 READ by ID (Obtener rol por ID)
export const getRoleById = async (id: number) => {
  try {
    const response = await api.get(`/role/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error obteniendo rol"
    );
  }
};

// 👉 UPDATE (Editar rol)
export const updateRole = async (id: number, updatedData: Partial<Role>) => {
  try {
    const response = await api.put(`/role/${id}`, updatedData);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error actualizando rol"
    );
  }
};

// 👉 DELETE / DISABLE (Deshabilitar rol)
export const disableRole = async (id: number) => {
  try {
    const response = await api.delete(`/role/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error deshabilitando rol"
    );
  }
};
