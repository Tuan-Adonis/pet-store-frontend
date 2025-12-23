import { INITIAL_USERS } from "../constants";
import { User } from "../interfaces/models";
import {
  CreateUserRequest,
  UpdateUserRequest,
} from "../interfaces/request/user";
import axiosClient from "./axiosClient";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const userApi = {
  getAll: async (): Promise<User[]> => {
    const res = await axiosClient.get("/user/get-all");
    return res.data;
  },

  create: async (data: CreateUserRequest): Promise<User> => {
    const res = await axiosClient.post("/user/create", data);
    return res.data;
  },

  update: async (data: UpdateUserRequest): Promise<User> => {
    const res = await axiosClient.post("/user/update", data);
    return res.data;
  },

  delete: async (id: number | string): Promise<boolean> => {
    const res = await axiosClient.post("/user/update-status", null, {
      params: {
        id,
      },
    });
    return res.data;
  },
};
