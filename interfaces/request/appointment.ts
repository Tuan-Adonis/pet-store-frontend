export interface CreateAppointmentRequest {
  customerId: number;
  serviceId: number;
  date: string;
  time: string;
  petName: string;
  petSpecies: string;
  petBreed: string;
  petAge: number;
  paymentMethod: number;
  note?: string;
  isPaid: number;
}

export interface UpdateAppointmentStatusRequest {
  id: number;
  status: number;
  note?: string;
  staffId?: number | string;
}
