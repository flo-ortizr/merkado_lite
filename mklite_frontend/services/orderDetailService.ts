import api from "@/services/api";
import { OrderDetail } from "@/app/models/OrderDetail";

// 👉 CREATE
export const createOrderDetail = async (data: OrderDetail) => {
  try {
    const response = await api.post("/order-detail", data);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error creando detalle de orden"
    );
  }
};

// 👉 READ (todos)
export const getAllOrderDetails = async () => {
  try {
    const response = await api.get("/order-detail");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error obteniendo detalles"
    );
  }
};

// 👉 READ by ID
export const getOrderDetailById = async (id: number) => {
  try {
    const response = await api.get(`/order-detail/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error obteniendo detalle"
    );
  }
};

// 👉 UPDATE
export const updateOrderDetail = async (
  id: number,
  data: Partial<OrderDetail>
) => {
  try {
    const response = await api.put(`/order-detail/${id}`, data);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error actualizando detalle"
    );
  }
};

// 👉 DELETE
export const deleteOrderDetail = async (id: number) => {
  try {
    const response = await api.delete(`/order-detail/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error eliminando detalle"
    );
  }
};
