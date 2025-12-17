import api from "@/services/api";
import { Category } from "@/app/models/Category"; // Define tu modelo Category

// 👉 CREATE (Crear categoría)
export const createCategory = async (categoryData: Category) => {
  try {
    const response = await api.post("/category", categoryData);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error creando categoría"
    );
  }
};

// 👉 READ (Listar todas las categorías)
export const getAllCategories = async () => {
  try {
    const response = await api.get("/category");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error obteniendo categorías"
    );
  }
};

// 👉 READ by ID (Obtener categoría por ID)
export const getCategoryById = async (id: number) => {
  try {
    const response = await api.get(`/category/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error obteniendo categoría"
    );
  }
};

// 👉 UPDATE (Editar categoría)
export const updateCategory = async (
  id: number,
  updatedData: Partial<Category>
) => {
  try {
    const response = await api.put(`/category/${id}`, updatedData);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error actualizando categoría"
    );
  }
};

// 👉 DELETE (Eliminar categoría)
export const deleteCategory = async (id: number) => {
  try {
    const response = await api.delete(`/category/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error eliminando categoría"
    );
  }
};
