import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Appointment,
  ServiceStatus,
  AppointmentStatusLog,
} from "../interfaces";
import { appointmentApi } from "../api/appointmentApi";
import { CreateAppointmentRequest } from "../interfaces/request/appointment";
import { useAuth } from "./AuthContext";
import { appointmentStatusLogApi } from "@/api/appointmentStatusLogApi";
import { useNotification } from "./NotificationContext";

interface AppointmentContextType {
  appointments: Appointment[];
  bookAppointment: (
    serviceId: number | string,
    date: string,
    time: string,
    petDetails: { name: string; species: string; breed: string; age: number },
    paymentMethod: number | string,
    note: string
  ) => Promise<void>;
  updateAppointmentStatus: (
    appId: number | string,
    status: ServiceStatus,
    reason?: string,
    staffId?: number | string
  ) => Promise<void>;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(
  undefined
);

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { notify } = useNotification();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { user } = useAuth();

  const loadAppointment = async () => {
    const baseAppt = await appointmentApi.getAll();

    if (baseAppt.length !== 0) {
      const hydratedOrders = await Promise.all(
        baseAppt.map((o: Appointment) => hydrateAppt(o))
      );

      setAppointments(hydratedOrders);
    } else {
      setAppointments(baseAppt);
    }
  };

  useEffect(() => {
    loadAppointment();
  }, []);

  const loadApptByCustomerID = async (customerId: number) => {
    const baseAppt = await appointmentApi.getAllByCustomerId(customerId);

    if (baseAppt.length !== 0) {
      const hydratedOrders = await Promise.all(
        baseAppt.map((o: Appointment) => hydrateAppt(o))
      );

      setAppointments(hydratedOrders);
    } else {
      setAppointments(baseAppt);
    }
  };

  const hydrateAppt = async (appt: Appointment): Promise<Appointment> => {
    const [statusHistory] = await Promise.all([
      appointmentStatusLogApi.getAppointmentStatusLogById(appt.id),
    ]);

    return {
      ...appt,
      // Lịch sử trạng thái lấy từ DB
      statusHistory: statusHistory.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    };
  };

  const bookAppointment = async (
    serviceId: number,
    date: string,
    time: string,
    petDetails: { name: string; species: string; breed: string; age: number },
    paymentMethod: number,
    note: string
  ) => {
    if (!user) return;
    const request: CreateAppointmentRequest = {
      customerId: user.id,
      serviceId,
      date,
      time,
      petName: petDetails.name,
      petSpecies: petDetails.species,
      petBreed: petDetails.breed,
      petAge: petDetails.age,
      paymentMethod,
      note,
      isPaid: paymentMethod,
    };
    try {
      const newApp = await appointmentApi.create(request);
      console.log("NEW_APP: ", newApp);
      await appointmentStatusLogApi.create({
        appointmentId: newApp.id,
        status: ServiceStatus.PENDING,
        statusTime: new Date().toISOString(),
        note: "Khách hàng đặt đơn",
      });
      // Populate display fields for UI
      newApp.date = date;
      newApp.time = time;
    } catch (e) {
      console.error(e);
    }
  };

  const updateAppointmentStatus = async (
    appId: number,
    status: ServiceStatus,
    reason?: string,
    staffId?: number
  ) => {
    const res = await appointmentApi.updateStatus({
      id: appId,
      status,
      note: reason,
      staffId,
    });
    if (res === 0) {
      notify("error", "Đổi trạng thái thất bại");
    } else if (res === 404) {
      notify("error", "Không tìm thấy đơn hàng");
    } else if (res === 500) {
      notify("error", "Lỗi hệ thống");
    } else if (res === 1) {
      notify("success", "Đổi trạng thái thành công");
    }

    // 2. Tạo log trạng thái mới
    await appointmentStatusLogApi.create({
      appointmentId: appId,
      status: status,
      statusTime: new Date().toISOString(),
      note: "Cập nhật trạng thái",
    });

    loadAppointment();
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        loadAppointment,
        loadApptByCustomerID,
        bookAppointment,
        updateAppointmentStatus,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointment = () => {
  const context = useContext(AppointmentContext);
  if (!context)
    throw new Error("useAppointment must be used within AppointmentProvider");
  return context;
};
