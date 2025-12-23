import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Service } from "../interfaces";
import { serviceApi } from "../api/serviceApi";

interface ServiceContextType {
  services: Service[];
  addService: (s: Service) => Promise<void>;
  updateService: (s: Service) => Promise<void>;
  deleteService: (id: number | string) => Promise<void>;
  refreshServices: () => Promise<void>;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [services, setServices] = useState<Service[]>([]);

  const refreshServices = useCallback(async () => {
    try {
      const data = await serviceApi.getAll();
      setServices(data);
    } catch (error) {
      console.error("Failed to refresh services", error);
    }
  }, []);

  useEffect(() => {
    refreshServices();
  }, [refreshServices]);

  const addService = async (s: Service) => {
    const res = await serviceApi.create(s);
    refreshServices();
  };

  const updateService = async (s: Service) => {
    const res = await serviceApi.update(s);
    refreshServices();
  };

  const deleteService = async (id: number) => {
    const res = await serviceApi.delete(id);
    refreshServices();
  };

  return (
    <ServiceContext.Provider
      value={{
        services,
        addService,
        updateService,
        deleteService,
        refreshServices,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};

export const useService = () => {
  const context = useContext(ServiceContext);
  if (!context)
    throw new Error("useService must be used within ServiceProvider");
  return context;
};
