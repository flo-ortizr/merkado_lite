import api from "@/services/api";
import { Product } from "@/app/models/Product";


// Obtener todos los productos
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get("/product");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al obtener productos");
  }
};

// Obtener catálogo
export const fetchCatalog = async (): Promise<Product[]> => {
  try {
    const response = await api.get("/product/catalog");
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al obtener catálogo");
  }
};

// Obtener productos por categoría
export const fetchProductsByCategory = async (categoryId: number): Promise<Product[]> => {
  try {
    const response = await api.get(`/product/category/${categoryId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al obtener productos por categoría");
  }
};

// Buscar productos
export const searchProducts = async (query: string): Promise<Product[]> => {
  try {
    const response = await api.get(`/product/search?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al buscar productos");
  }
};

// Filtrar por precio
export const filterProductsByPrice = async (min: number, max: number): Promise<Product[]> => {
  try {
    const response = await api.get(`/product/filter/price?min=${min}&max=${max}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al filtrar productos por precio");
  }
};

// Obtener producto por ID
export const fetchProductById = async (id: number): Promise<Product> => {
  try {
    const response = await api.get(`/product/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al obtener el producto");
  }
};

// Crear producto
export const createProduct = async (dto: Product): Promise<Product> => {
  try {
    const response = await api.post("/product", dto);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al crear producto");
  }
};

// Actualizar producto
export const updateProduct = async (id: number, dto: Product): Promise<Product> => {
  try {
    const response = await api.put(`/product/${id}`, dto);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al actualizar producto");
  }
};

// Eliminar producto
export const deleteProduct = async (id: number): Promise<void> => {
  try {
    await api.delete(`/product/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al eliminar producto");
  }
};

