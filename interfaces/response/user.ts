
import { User } from "../models";
import { ApiResponse } from "./common";

export type UserResponse = ApiResponse<User>;
export type UserListResponse = ApiResponse<User[]>;
