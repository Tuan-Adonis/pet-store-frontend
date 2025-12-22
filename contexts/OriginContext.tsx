import React, { createContext, useContext, useState, useEffect } from "react";
import { Origin } from "../interfaces";
import { originApi } from "../api/originApi";
import { CreateOriginRequest } from "../interfaces/request/origin";
import { useNotification } from "./NotificationContext";

interface OriginContextType {
  origins: Origin[];
  addOrigin: (o: CreateOriginRequest) => Promise<void>;
  deleteOrigin: (id: number | string) => Promise<void>;
}

const OriginContext = createContext<OriginContextType | undefined>(undefined);

export const OriginProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { notify } = useNotification();
  const [origins, setOrigins] = useState<Origin[]>([]);

  const load = async () => setOrigins(await originApi.getAll());

  useEffect(() => {
    load();
  }, []);

  const addOrigin = async (o: CreateOriginRequest) => {
    const res = await originApi.create(o);
    if (res === null) {
      notify("error", "Thêm Loài mới thất bại");
    } else {
      notify("success", "Thêm Loài mới thành công");
      load();
    }
  };

  const deleteOrigin = async (id: number | string) => {
    const res = await originApi.delete(id);
    if (res === 0) {
      notify("error", "Đổi trạng thái thất bại");
    } else if (res === 404) {
      notify("error", "Không tìm thấy loài");
    } else if (res === 500) {
      notify("error", "Lỗi hệ thống");
    } else if (res === 1) {
      notify("success", "Đổi trạng thái thành công");
      load();
    }
  };

  return (
    <OriginContext.Provider value={{ origins, addOrigin, deleteOrigin }}>
      {children}
    </OriginContext.Provider>
  );
};

export const useOrigin = () => {
  const context = useContext(OriginContext);
  if (!context) throw new Error("useOrigin must be used within OriginProvider");
  return context;
};
