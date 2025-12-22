// import { INITIAL_CATEGORIES } from "../constants";
// import { Category } from "../interfaces/models";
// import { CreateCategoryRequest, UpdateCategoryRequest } from "../interfaces/request/category";

// const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// export const categoryApi = {
//   getAll: async (): Promise<Category[]> => {
//     await delay(300);
//     return [...INITIAL_CATEGORIES];
//   },

//   create: async (data: CreateCategoryRequest): Promise<Category> => {
//     await delay(400);
//     const now = new Date().toISOString();
//     return {
//         ...data,
//         id: `cat-${Date.now()}`,
//         createdAt: now,
//         createdBy: 'System',
//         updatedAt: now,
//         updatedBy: 'System'
//     };
//   },

//   update: async (data: UpdateCategoryRequest): Promise<Category> => {
//     await delay(400);
//     return data as Category;
//   },

//   delete: async (id: number | string): Promise<boolean> => {
//     await delay(300);
//     return true;
//   }
// };

import { CreateCategoryRequest, UpdateCategoryRequest } from "@/interfaces";
import { Category } from "../interfaces/models";
import axiosClient from "./axiosClient";

export const categoryApi = {
  // GET ALL
  getAll: async (): Promise<Category[]> => {
    const res = await axiosClient.get("/category/get-all");
    return res.data;
  },

  // CREATE
  create: async (data: CreateCategoryRequest): Promise<Category> => {
    const res = await axiosClient.post("/category/create", data);
    return res.data.data; // SuccessResponse<Breed>
  },

  update: async (data: UpdateCategoryRequest): Promise<number> => {
    const res = await axiosClient.post("/category/update", data);
    return res.data; // SuccessResponse<Breed>
  },

  // DELETE = UPDATE STATUS (1 -> 0)
  delete: async (id: number | string): Promise<number> => {
    const res = await axiosClient.post("/category/update-status", null, {
      params: {
        id,
      },
    });
    return res.data;
  },
};
