import api from "@/services/api";
import { Promotion } from "@/app/models/Promotion";

// 👉 CREATE (Crear promoción)
export const createPromotion = async (promotionData: Promotion) => {
  try {
    const response = await api.post("/promotions", promotionData);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error creando promoción"
    );
  }
};

// 👉 READ (Listar todas las promociones)
export const getAllPromotions = async () => {
  try {
    const response = await api.get("/promotions");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error obteniendo promociones"
    );
  }
};

// 👉 READ by ID (Obtener promoción por ID)
export const getPromotionById = async (id: number) => {
  try {
    const response = await api.get(`/promotions/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error obteniendo promoción"
    );
  }
};

// 👉 UPDATE (Editar promoción)
export const updatePromotion = async (
  id: number,
  updatedData: Partial<Promotion>
) => {
  try {
    const response = await api.put(`/promotions/${id}`, updatedData);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error actualizando promoción"
    );
  }
};

// 👉 DELETE (Eliminar promoción)
export const deletePromotion = async (id: number) => {
  try {
    const response = await api.delete(`/promotions/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error eliminando promoción"
    );
  }
};
