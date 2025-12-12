import { Supplier } from "@/app/models/Supplier"; 
import api from "@/services/api";

// 👉 CREATE (Registrar proveedor)
export const createSupplier = async (supplierData: Supplier) => {
  try {
    const response = await api.post("/supplier", supplierData);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error creando proveedor"
    );
  }
};

// 👉 READ (Listar todos los proveedores)
export const getAllSuppliers = async () => {
  try {
    const response = await api.get("/supplier");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error obteniendo proveedores"
    );
  }
};

// 👉 READ by ID (Obtener proveedor por ID)
export const getSupplierById = async (id: number) => {
  try {
    const response = await api.get(`/supplier/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error obteniendo proveedor"
    );
  }
};

// 👉 SEARCH by name
export const searchSuppliersByName = async (name: string) => {
  try {
    const response = await api.get(`/supplier/search/name?name=${encodeURIComponent(name)}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error buscando proveedor por nombre"
    );
  }
};

// 👉 SEARCH by email
export const searchSuppliersByEmail = async (email: string) => {
  try {
    const response = await api.get(`/supplier/search/email?email=${encodeURIComponent(email)}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error buscando proveedor por email"
    );
  }
};

// 👉 SEARCH by category
export const searchSuppliersByCategory = async (category: string) => {
  try {
    const response = await api.get(`/supplier/search/category?category=${encodeURIComponent(category)}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error buscando proveedor por categoría"
    );
  }
};

// 👉 UPDATE (Editar proveedor)
export const updateSupplier = async (id: number, updatedData: Partial<Supplier>) => {
  try {
    const response = await api.put(`/supplier/${id}`, updatedData);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error actualizando proveedor"
    );
  }
};

// 👉 DELETE (Eliminar proveedor)
export const deleteSupplier = async (id: number) => {
  try {
    const response = await api.delete(`/supplier/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error eliminando proveedor"
    );
  }
};
