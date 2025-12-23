// import { INITIAL_ADDRESSES } from "../constants";
// import { Address } from "../interfaces/models";

// const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// export const addressApi = {
//   getAll: async (): Promise<Address[]> => {
//     await delay(300);
//     return [...INITIAL_ADDRESSES];
//   },

//   getByUserId: async (userId: number | string): Promise<Address[]> => {
//     await delay(200);
//     return INITIAL_ADDRESSES.filter(a => a.userId === userId);
//   },
//   create: async (data: Partial<Address>): Promise<Address> => {
//     await delay(300);
//     const newAddr = {
//         ...data,
//         id: Date.now(),
//         createdAt: new Date().toISOString(),
//         updatedAt: new Date().toISOString()
//     } as Address;
//     INITIAL_ADDRESSES.push(newAddr);
//     return newAddr;
//   },
//   update: async (data: Address): Promise<Address> => {
//     await delay(300);
//     const idx = INITIAL_ADDRESSES.findIndex(a => a.id === data.id);
//     if (idx !== -1) {
//         INITIAL_ADDRESSES[idx] = { ...INITIAL_ADDRESSES[idx], ...data, updatedAt: new Date().toISOString() };
//         return INITIAL_ADDRESSES[idx];
//     }
//     return data;
//   },
//   delete: async (id: number | string): Promise<boolean> => {
//     await delay(200);
//     const idx = INITIAL_ADDRESSES.findIndex(a => a.id === id);
//     if (idx !== -1) INITIAL_ADDRESSES.splice(idx, 1);
//     return true;
//   }
// };

import { INITIAL_ADDRESSES } from "../constants";
import { Address } from "../interfaces/models";
import axiosClient from "./axiosClient";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const addressApi = {
  getByUserId: async (userId: number): Promise<Address[]> => {
    const res = await axiosClient.post("/address/get-by-user-id", null, {
      params: {
        userId,
      },
    });
    return res.data;
  },

  create: async (data: Partial<Address>): Promise<number> => {
    const res = await axiosClient.post("/address/create", data);
    return res.data;
  },

  update: async (id: number): Promise<number> => {
    const res = await axiosClient.post("/address/update", null, {
      params: {
        id,
      },
    });
    return res.data;
  },

  delete: async (id: number): Promise<number> => {
    const res = await axiosClient.post("/address/delete", null, {
      params: {
        id,
      },
    });
    return res.data;
  },
};
