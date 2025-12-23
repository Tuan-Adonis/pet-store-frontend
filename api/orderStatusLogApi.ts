import { OrderStatusLog } from "../interfaces/models";
import axiosClient from "./axiosClient";

export const orderStatusLogApi = {
  // Tạo log trạng thái
  create: async (data: Partial<OrderStatusLog>): Promise<OrderStatusLog> => {
    const res = await axiosClient.post("/order-status-log/create", data);
    return res.data;
  },

  // Lấy log theo orderId
  getByOrderId: async (orderId: number): Promise<OrderStatusLog[]> => {
    const res = await axiosClient.post(
      "/order-status-log/get-by-order-id",
      null,
      {
        params: { orderId },
      }
    );
    return res.data;
  },
};
