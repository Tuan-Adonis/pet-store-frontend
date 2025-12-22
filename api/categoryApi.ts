
import { INITIAL_CATEGORIES } from "../constants";
import { Category } from "../interfaces/models";
import { CreateCategoryRequest, UpdateCategoryRequest } from "../interfaces/request/category";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const categoryApi = {
  getAll: async (): Promise<Category[]> => {
    await delay(300);
    return [...INITIAL_CATEGORIES];
  },

  create: async (data: CreateCategoryRequest): Promise<Category> => {
    await delay(400);
    const now = new Date().toISOString();
    return { 
        ...data, 
        id: `cat-${Date.now()}`,
        createdAt: now,
        createdBy: 'System',
        updatedAt: now,
        updatedBy: 'System'
    };
  },

  update: async (data: UpdateCategoryRequest): Promise<Category> => {
    await delay(400);
    return data as Category;
  },

  delete: async (id: number | string): Promise<boolean> => {
    await delay(300);
    return true;
  }
};
