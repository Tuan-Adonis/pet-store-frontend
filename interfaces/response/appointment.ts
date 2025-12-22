
import { Appointment } from "../models";
import { ApiResponse } from "./common";

export type AppointmentResponse = ApiResponse<Appointment>;
export type AppointmentListResponse = ApiResponse<Appointment[]>;
