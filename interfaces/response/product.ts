
import { Product } from "../models";
import { ApiResponse } from "./common";

export type ProductResponse = ApiResponse<Product>;
export type ProductListResponse = ApiResponse<Product[]>;
