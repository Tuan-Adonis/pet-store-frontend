
import { OrderStatus } from "../../enums";

export interface CreateOrderRequest {
  customerId: number | string;
  items: { productId: number | string; quantity: number }[];
  totalAmount: number;
  paymentMethod: number | string;
  shippingAddress: string;
  note?: string;
}

export interface UpdateOrderStatusRequest {
  id: number | string;
  status: OrderStatus;
  note?: string;
  staffId?: number | string;
}
