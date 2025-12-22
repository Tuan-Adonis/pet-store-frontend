
import { Order } from "../models";
import { ApiResponse } from "./common";

export type OrderResponse = ApiResponse<Order>;
export type OrderListResponse = ApiResponse<Order[]>;
