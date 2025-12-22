
import { INITIAL_ROLES } from "../constants";
import { Role } from "../interfaces/models";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const roleApi = {
  getAll: async (): Promise<Role[]> => {
    await delay(200);
    return [...INITIAL_ROLES];
  },
  getById: async (id: number): Promise<Role | undefined> => {
    await delay(100);
    return INITIAL_ROLES.find(r => r.id === id);
  }
};
