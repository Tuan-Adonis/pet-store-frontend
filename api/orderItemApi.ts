// import { OrderItem } from "../interfaces/models";

// const MOCK_ITEMS: OrderItem[] = []; // Internal store for mock items

// const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// export const orderItemApi = {
//   getByOrderId: async (orderId: number): Promise<OrderItem[]> => {
//     await delay(200);
//     return MOCK_ITEMS.filter(i => i.orderId === orderId);
//   },
//   create: async (item: Partial<OrderItem>): Promise<OrderItem> => {
//     const newItem = { ...item, id: Date.now() + Math.random() } as OrderItem;
//     MOCK_ITEMS.push(newItem);
//     return newItem;
//   }
// };

import { OrderItem } from "../interfaces/models";
import axiosClient from "./axiosClient";

export const orderItemApi = {
  // Lấy danh sách item theo orderId
  getByOrderId: async (orderId: number): Promise<OrderItem[]> => {
    const res = await axiosClient.post("/order-item/get-by-order-id", null, {
      params: { orderId },
    });
    return res.data;
  },

  // Tạo order item
  create: async (item: Partial<OrderItem>): Promise<OrderItem> => {
    const res = await axiosClient.post("/order-item/create", item);
    return res.data;
  },
};
