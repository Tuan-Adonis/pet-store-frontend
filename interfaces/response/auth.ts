
import { User } from "../models";

export interface LoginResponse {
    token: string;
    user: User;
}
