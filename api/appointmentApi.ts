// import { INITIAL_APPOINTMENTS } from "../constants";
// import { Appointment } from "../interfaces/models";
// import { ServiceStatus } from "../interfaces";
// import { CreateAppointmentRequest, UpdateAppointmentStatusRequest } from "../interfaces/request/appointment";

// const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// export const appointmentApi = {
//   getAll: async (): Promise<Appointment[]> => {
//     await delay(600);
//     return [...INITIAL_APPOINTMENTS];
//   },

//   create: async (data: CreateAppointmentRequest): Promise<Appointment> => {
//     await delay(800);
//     const newAppt: any = {
//         ...data,
//         id: Date.now(),
//         status: ServiceStatus.PENDING,
//         createdAt: new Date().toISOString(),
//         statusHistory: []
//     };
//     return newAppt;
//   },

//   updateStatus: async (data: UpdateAppointmentStatusRequest): Promise<boolean> => {
//     await delay(300);
//     return true;
//   }
// };

import { Appointment } from "../interfaces/models";
import {
  CreateAppointmentRequest,
  UpdateAppointmentStatusRequest,
} from "../interfaces/request/appointment";
import axiosClient from "./axiosClient";

export const appointmentApi = {
  getAll: async (): Promise<Appointment[]> => {
    const res = await axiosClient.get("/appointment/get-all");
    return res.data;
  },

  getAllByCustomerId: async (customerId: number): Promise<Appointment[]> => {
    const res = await axiosClient.post(
      "/appointment/get-all-by-customer-id",
      null,
      {
        params: { customerId },
      }
    );
    return res.data;
  },

  create: async (
    req: CreateAppointmentRequest
  ): Promise<Appointment | null> => {
    const res = await axiosClient.post("/appointment/create", req);
    return res.data;
  },

  updateStatus: async (
    data: UpdateAppointmentStatusRequest
  ): Promise<number> => {
    const res = await axiosClient.post("/appointment/update-status", null, {
      params: {
        id: data.id,
        status: data.status,
        reason: data.note,
        staffId: data.staffId,
      },
    });
    return res.data;
  },
};
