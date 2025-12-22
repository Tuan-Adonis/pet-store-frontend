
import { AppointmentStatusLog } from "../interfaces/models";

const MOCK_LOGS: AppointmentStatusLog[] = [];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const appointmentStatusLogApi = {
  create: async (data: Partial<AppointmentStatusLog>): Promise<AppointmentStatusLog> => {
    await delay(100);
    const newLog = {
        ...data,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        createdBy: 'System',
        updatedAt: new Date().toISOString(),
        updatedBy: 'System'
    } as AppointmentStatusLog;
    MOCK_LOGS.push(newLog);
    return newLog;
  },
  getByAppointmentId: async (appId: number): Promise<AppointmentStatusLog[]> => {
      await delay(200);
      return MOCK_LOGS.filter(l => l.appointmentId === appId);
  }
};
