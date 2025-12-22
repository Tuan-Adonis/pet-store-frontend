
import { INITIAL_USERS } from "../constants";
import { User } from "../interfaces/models";
import { CreateUserRequest, UpdateUserRequest } from "../interfaces/request/user";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const userApi = {
  getAll: async (): Promise<User[]> => {
    await delay(500);
    return [...INITIAL_USERS];
  },

  getById: async (id: number | string): Promise<User | undefined> => {
    await delay(300);
    return INITIAL_USERS.find(u => u.id === id);
  },

  create: async (data: CreateUserRequest): Promise<User> => {
    await delay(500);
    const now = new Date().toISOString();
    const newUser = { 
        ...data, 
        id: Date.now(), 
        createdAt: now, 
        createdBy: 'System', 
        updatedAt: now, 
        updatedBy: 'System',
        addresses: data.addresses || []
    } as unknown as User;
    INITIAL_USERS.push(newUser);
    return newUser;
  },

  update: async (data: UpdateUserRequest): Promise<User> => {
    await delay(500);
    const index = INITIAL_USERS.findIndex(u => u.id === data.id);
    if (index !== -1) {
        const updatedUser = { ...INITIAL_USERS[index], ...data, updatedAt: new Date().toISOString() } as User;
        INITIAL_USERS[index] = updatedUser;
        return updatedUser;
    }
    return data as unknown as User;
  },

  delete: async (id: number | string): Promise<boolean> => {
    await delay(300);
    const index = INITIAL_USERS.findIndex(u => u.id === id);
    if (index !== -1) {
        INITIAL_USERS.splice(index, 1);
    }
    return true;
  }
};
