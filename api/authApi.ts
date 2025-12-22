// import { INITIAL_USERS } from "../constants";
// import { User } from "../interfaces";
// import { LoginRequest, RegisterRequest } from "../interfaces/request/auth";
// import { ActiveStatus, RoleId } from "../interfaces";

import { LoginRequest, RegisterRequest, User } from "@/interfaces";
import axiosClient from "./axiosClient";

// const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// export const authApi = {
//   login: async (req: LoginRequest): Promise<User | null> => {
//     await delay(500);
//     const user = INITIAL_USERS.find(u => u.email === req.email && u.password === req.password);
//     if (!user) return null;
//     if (user.status !== ActiveStatus.ACTIVE) {
//         throw new Error("Account is locked");
//     }
//     return user;
//   },

//   register: async (req: RegisterRequest): Promise<User> => {
//     await delay(500);
//     const exists = INITIAL_USERS.find(u => u.email === req.email);
//     if (exists) throw new Error("Email already exists");

//     // In real app, password hashing happens here
//     // Default roleId to CUSTOMER (1), status to ACTIVE (1)
//     const newUser = {
//         ...req,
//         id: Date.now(),
//         addresses: [],
//         status: ActiveStatus.ACTIVE,
//         roleId: RoleId.CUSTOMER,
//         username: req.email.split('@')[0]
//     } as any;
//     INITIAL_USERS.push(newUser);
//     return newUser;
//   },

//   updateProfile: async (user: User): Promise<User> => {
//     await delay(300);
//     // Usually authApi might rely on userApi, but for this mock let's ensure consistency if called
//     const index = INITIAL_USERS.findIndex(u => u.id === user.id);
//     if (index !== -1) {
//         INITIAL_USERS[index] = { ...INITIAL_USERS[index], ...user };
//         return INITIAL_USERS[index];
//     }
//     return user;
//   }
// };

export const authApi = {
  login: async (req: LoginRequest): Promise<User | null> => {
    const res = await axiosClient.post("/user/login", req);
    return res.data;
  },

  register: async (req: RegisterRequest): Promise<number> => {
    const res = await axiosClient.post("/user/register", req);
    return res.data;
  },

  logout: async (id: number): Promise<number> => {
    const res = await axiosClient.post("/user/logout", null, {
      params: {
        id,
      },
    });
    return res.data;
  },

  updateProfile: async (user: User): Promise<User> => {
    const res = await axiosClient.post("/user/update", user);
    return res.data;
  },
};
