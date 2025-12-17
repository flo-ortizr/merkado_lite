import api from "@/services/api";
import { Order } from "@/app/models/Order";
import { ConfirmOrderDto } from "@/app/models/ConfirmOrderDto";

export const confirmOrder = async (
  customerId: number,
  orderData: ConfirmOrderDto
) => {
  try {
    const response = await api.post(
      `/order/confirm/${customerId}`,
      orderData
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error confirmando la orden"
    );
  }
};


// 👉 CANCELAR ÓRDENES EXPIRADAS
export const cancelExpiredOrders = async () => {
  try {
    const response = await api.post("/order/cancel-expired");
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error cancelando órdenes"
    );
  }
};
