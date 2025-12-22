
import { Address } from "../models";

export interface CreateUserRequest {
  username: string;
  name: string;
  email: string;
  password?: string;
  roleId: number;
  phone: string;
  status?: number;
  addresses?: Address[];
}

export interface UpdateUserRequest extends Partial<CreateUserRequest> {
  id: number | string;
}
