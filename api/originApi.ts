
import { INITIAL_ORIGINS } from "../constants";
import { Origin } from "../interfaces/models";
import { CreateOriginRequest } from "../interfaces/request/origin";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const originApi = {
  getAll: async (): Promise<Origin[]> => {
    await delay(300);
    return [...INITIAL_ORIGINS];
  },

  create: async (data: CreateOriginRequest): Promise<Origin> => {
    await delay(400);
    const now = new Date().toISOString();
    return { 
        ...data, 
        id: `o-${Date.now()}`,
        createdAt: now,
        createdBy: 'System',
        updatedAt: now,
        updatedBy: 'System'
    };
  },

  delete: async (id: number | string): Promise<boolean> => {
    await delay(300);
    return true;
  }
};
