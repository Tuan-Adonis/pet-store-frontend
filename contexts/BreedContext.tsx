import React, { createContext, useContext, useState, useEffect } from "react";
import { Breed } from "../interfaces";
import { breedApi } from "../api/breedApi";
import { CreateBreedRequest } from "../interfaces/request/breed";
import { useNotification } from "./NotificationContext";

interface BreedContextType {
  breeds: Breed[];
  addBreed: (b: CreateBreedRequest) => Promise<void>;
  deleteBreed: (id: number | string) => Promise<void>;
}

const BreedContext = createContext<BreedContextType | undefined>(undefined);

export const BreedProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { notify } = useNotification();
  const [breeds, setBreeds] = useState<Breed[]>([]);

  const load = async () => setBreeds(await breedApi.getAll());

  useEffect(() => {
    load();
  }, []);

  const addBreed = async (b: CreateBreedRequest) => {
    const res = await breedApi.create(b);
    if (res === null) {
      notify("error", "Thêm giống mới thất bại");
    } else {
      notify("success", "Thêm giống mới thành công");
      load();
    }
  };

  const deleteBreed = async (id: number | string) => {
    const res = await breedApi.delete(id);
    if (res === 0) {
      notify("error", "Đổi trạng thái thất bại");
    } else if (res === 404) {
      notify("error", "Không tìm thấy giống");
    } else if (res === 500) {
      notify("error", "Lỗi hệ thống");
    } else if (res === 1) {
      notify("success", "Đổi trạng thái thành công");
      load();
    }
  };

  return (
    <BreedContext.Provider value={{ breeds, addBreed, deleteBreed }}>
      {children}
    </BreedContext.Provider>
  );
};

export const useBreed = () => {
  const context = useContext(BreedContext);
  if (!context) throw new Error("useBreed must be used within BreedProvider");
  return context;
};
