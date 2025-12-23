// import { INITIAL_SERVICES } from "../constants";
// import { Service } from "../interfaces/models";
// import { CreateServiceRequest, UpdateServiceRequest } from "../interfaces/request/service";

// const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// export const serviceApi = {
//   getAll: async (): Promise<Service[]> => {
//     await delay(400);
//     return [...INITIAL_SERVICES];
//   },

//   create: async (data: CreateServiceRequest): Promise<Service> => {
//     await delay(500);
//     const now = new Date().toISOString();
//     const newService: Service = {
//         ...data,
//         id: `s${Date.now()}`,
//         createdAt: now,
//         createdBy: 'System',
//         updatedAt: now,
//         updatedBy: 'System'
//     };
//     INITIAL_SERVICES.push(newService);
//     return newService;
//   },

//   update: async (data: UpdateServiceRequest): Promise<Service> => {
//     await delay(500);
//     const index = INITIAL_SERVICES.findIndex(s => s.id === data.id);
//     if (index !== -1) {
//         INITIAL_SERVICES[index] = { ...INITIAL_SERVICES[index], ...data } as Service;
//         return INITIAL_SERVICES[index];
//     }
//     return data as Service;
//   },

//   delete: async (id: number | string): Promise<boolean> => {
//     await delay(300);
//     const index = INITIAL_SERVICES.findIndex(s => s.id === id);
//     if (index !== -1) {
//         INITIAL_SERVICES.splice(index, 1);
//     }
//     return true;
//   }
// };

import { Service } from "../interfaces/models";
import {
  CreateServiceRequest,
  UpdateServiceRequest,
} from "../interfaces/request/service";
import axiosClient from "./axiosClient";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const serviceApi = {
  getAll: async (): Promise<Service[]> => {
    const res = await axiosClient.get("/service/get-all");
    return res.data;
  },

  create: async (data: CreateServiceRequest): Promise<Service> => {
    const res = await axiosClient.post("/service/create", data);
    return res.data;
  },

  update: async (data: UpdateServiceRequest): Promise<Service> => {
    const res = await axiosClient.post("/service/update", data);
    return res.data;
  },

  delete: async (id: number): Promise<boolean> => {
    const res = await axiosClient.post("/service/update-status", null, {
      params: {
        id,
      },
    });
    return res.data;
  },
};
