
import { OrderStatusLog } from "../interfaces/models";

const MOCK_LOGS: OrderStatusLog[] = [];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const orderStatusLogApi = {
  create: async (data: Partial<OrderStatusLog>): Promise<OrderStatusLog> => {
    await delay(100);
    const newLog = {
        ...data,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        createdBy: 'System',
        updatedAt: new Date().toISOString(),
        updatedBy: 'System'
    } as OrderStatusLog;
    MOCK_LOGS.push(newLog);
    return newLog;
  },
  getByOrderId: async (orderId: number): Promise<OrderStatusLog[]> => {
      await delay(200);
      return MOCK_LOGS.filter(l => l.orderId === orderId);
  }
};
