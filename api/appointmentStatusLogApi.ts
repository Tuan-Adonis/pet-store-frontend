import { AppointmentStatusLog } from "../interfaces/models";
import axiosClient from "./axiosClient";

const MOCK_LOGS: AppointmentStatusLog[] = [];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const appointmentStatusLogApi = {
  // Tạo log trạng thái
  create: async (
    data: Partial<AppointmentStatusLog>
  ): Promise<AppointmentStatusLog> => {
    const res = await axiosClient.post("/appointment-status-log/create", data);
    return res.data;
  },

  // Lấy log theo appointmentId
  getAppointmentStatusLogById: async (
    appointmentId: number
  ): Promise<AppointmentStatusLog[]> => {
    const res = await axiosClient.post(
      "/appointment-status-log/get-by-appointment-id",
      null,
      {
        params: { appointmentId },
      }
    );
    return res.data;
  },
};
