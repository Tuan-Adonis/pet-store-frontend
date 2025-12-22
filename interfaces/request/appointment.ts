
import { ServiceStatus } from "../../enums";

export interface CreateAppointmentRequest {
  customerId: number | string;
  serviceId: number | string;
  date: string;
  time: string;
  petName: string;
  petSpecies: string;
  petBreed: string;
  petAge: number;
  paymentMethod: number | string;
  note?: string;
}

export interface UpdateAppointmentStatusRequest {
  id: number | string;
  status: ServiceStatus;
  note?: string;
  staffId?: number | string;
}
