
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appointment, ServiceStatus, AppointmentStatusLog } from '../interfaces';
import { appointmentApi } from '../api/appointmentApi';
import { CreateAppointmentRequest } from '../interfaces/request/appointment';
import { useAuth } from './AuthContext';

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

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const load = async () => setAppointments(await appointmentApi.getAll());
    load();
  }, []);

  const bookAppointment = async (
    serviceId: number | string,
    date: string,
    time: string,
    petDetails: { name: string; species: string; breed: string; age: number },
    paymentMethod: number | string,
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
        note
    };
    try {
        const newApp = await appointmentApi.create(request);
        const now = new Date().toISOString();
        // Initialize status history
        newApp.statusHistory = [
            {
                id: Date.now(),
                appointmentId: newApp.id,
                status: ServiceStatus.PENDING,
                timestamp: now,
                note: 'Khách hàng đặt lịch',
                updatedBy: String(user.id),
                createdAt: now,
                createdBy: 'System',
                updatedAt: now
            }
        ];
        // Populate display fields for UI
        newApp.date = date;
        newApp.time = time;
        
        setAppointments(prev => [newApp, ...prev]);
    } catch (e) {
        console.error(e);
    }
  };

  const updateAppointmentStatus = async (
    appId: number | string,
    status: ServiceStatus,
    reason?: string,
    staffId?: number | string
  ) => {
    await appointmentApi.updateStatus({ id: appId, status, note: reason, staffId });
    setAppointments(prev =>
        prev.map(a => {
            if (a.id === appId) {
                const now = new Date().toISOString();
                const newLog: AppointmentStatusLog = {
                    id: Date.now(),
                    appointmentId: a.id,
                    status,
                    timestamp: now,
                    note: reason || "Cập nhật trạng thái",
                    updatedBy: String(staffId || 'System'),
                    createdAt: now,
                    createdBy: 'System',
                    updatedAt: now
                };
                
                const newHistory = [
                    ...(a.statusHistory || []),
                    newLog,
                ];
                return {
                    ...a,
                    status,
                    statusHistory: newHistory,
                    staffId: staffId || a.staffId,
                    cancelReason: status === ServiceStatus.CANCELLED ? reason : a.cancelReason,
                };
            }
            return a;
        })
    );
  };

  return (
    <AppointmentContext.Provider value={{ appointments, bookAppointment, updateAppointmentStatus }}>
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointment = () => {
  const context = useContext(AppointmentContext);
  if (!context) throw new Error('useAppointment must be used within AppointmentProvider');
  return context;
};
