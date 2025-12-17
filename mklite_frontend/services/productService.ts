import api from "@/services/api";
import { Product } from "@/app/models/Product";


export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get("/product");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al obtener productos");
  }
};

