
import { INITIAL_ORDERS } from "../constants";
import { Order } from "../interfaces/models";
import { OrderStatus } from "../interfaces";
import { CreateOrderRequest, UpdateOrderStatusRequest } from "../interfaces/request/order";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const orderApi = {
  getAll: async (): Promise<Order[]> => {
    await delay(600);
    return [...INITIAL_ORDERS];
  },

  create: async (data: CreateOrderRequest): Promise<Order> => {
    await delay(800);
    // Mock mapping request to full order object would happen on backend
    const newOrder: any = {
        ...data,
        id: Date.now(),
        status: OrderStatus.PENDING,
        createdAt: new Date().toISOString(),
        statusHistory: [],
        items: data.items.map(i => ({ product: { id: i.productId }, quantity: i.quantity })) // simplified
    };
    return newOrder;
  },

  updateStatus: async (data: UpdateOrderStatusRequest): Promise<boolean> => {
    await delay(300);
    return true;
  }
};
