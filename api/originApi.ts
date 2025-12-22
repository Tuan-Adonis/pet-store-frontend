import { INITIAL_ORIGINS } from "../constants";
import { Origin } from "../interfaces/models";
import { CreateOriginRequest } from "../interfaces/request/origin";
import axiosClient from "./axiosClient";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const originApi = {
  getAll: async (): Promise<Origin[]> => {
    const res = await axiosClient.get("/origin/get-all");
    return res.data;
  },

  create: async (data: CreateOriginRequest): Promise<Origin> => {
    const res = await axiosClient.post("/origin/create", data);
    return res.data.data; // SuccessResponse<Breed>
  },

  delete: async (id: number | string): Promise<number> => {
    const res = await axiosClient.post("/origin/update-status", null, {
      params: {
        id,
      },
    });
    return res.data;
  },
};
