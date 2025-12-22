
import { INITIAL_APPOINTMENTS } from "../constants";
import { Appointment } from "../interfaces/models";
import { ServiceStatus } from "../interfaces";
import { CreateAppointmentRequest, UpdateAppointmentStatusRequest } from "../interfaces/request/appointment";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const appointmentApi = {
  getAll: async (): Promise<Appointment[]> => {
    await delay(600);
    return [...INITIAL_APPOINTMENTS];
  },

  create: async (data: CreateAppointmentRequest): Promise<Appointment> => {
    await delay(800);
    const newAppt: any = {
        ...data,
        id: Date.now(),
        status: ServiceStatus.PENDING,
        createdAt: new Date().toISOString(),
        statusHistory: []
    };
    return newAppt;
  },

  updateStatus: async (data: UpdateAppointmentStatusRequest): Promise<boolean> => {
    await delay(300);
    return true;
  }
};
