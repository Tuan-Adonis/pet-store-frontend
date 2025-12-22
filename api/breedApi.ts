
import { INITIAL_BREEDS } from "../constants";
import { Breed } from "../interfaces/models";
import { CreateBreedRequest } from "../interfaces/request/breed";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const breedApi = {
  getAll: async (): Promise<Breed[]> => {
    await delay(300);
    return [...INITIAL_BREEDS];
  },

  getByStatus: async (status: number): Promise<Breed[]> => {
    await delay(300);
    return INITIAL_BREEDS.filter(b => b.status === status);
  },

  create: async (data: CreateBreedRequest): Promise<Breed> => {
    await delay(400);
    const now = new Date().toISOString();
    return { 
        ...data, 
        id: `b-${Date.now()}`, 
        status: data.status ?? 1,
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
