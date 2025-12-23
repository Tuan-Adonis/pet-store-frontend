import React, { createContext, useContext, useState } from "react";
import { Address } from "../interfaces/models";
import { addressApi } from "../api/addressApi";
import { useNotification } from "./NotificationContext";

interface AddressContextType {
  userAddresses: Address[];
  loadAddresses: (userId: number | string) => Promise<void>;
  addAddress: (addr: Partial<Address>) => Promise<void>;
  updateAddress: (addr: Address) => Promise<void>;
  deleteAddress: (id: number | string) => Promise<void>;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export const AddressProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { notify } = useNotification();
  const [userAddresses, setUserAddresses] = useState<Address[]>([]);

  const loadAddresses = async (userId: number) => {
    const data = await addressApi.getByUserId(userId);
    setUserAddresses(data);
  };

  const addAddress = async (addr: Partial<Address>) => {
    const newAddr = await addressApi.create(addr);
    if (newAddr === 0) {
      notify("error", "Thêm mới địa chỉ thất bại");
    } else if (newAddr === 500) {
      notify("error", "Lỗi hệ thống");
    } else if (newAddr === 1) {
      notify("success", "Thêm mới địa chỉ thành công");
    }
    return newAddr;
  };

  const updateAddress = async (id: number) => {
    const updated = await addressApi.update(id);
    if (updated === 0) {
      notify("error", "Cập nhật địa chỉ thất bại");
    } else if (updated === 404) {
      notify("error", "Không tìm thấy địa chỉ");
    } else if (updated === 500) {
      notify("error", "Lỗi hệ thống");
    } else if (updated === 1) {
      notify("success", "Cập nhật địa chỉ thành công");
    }
    return updated;
  };

  const deleteAddress = async (id: number) => {
    const deleted = await addressApi.delete(id);
    if (deleted === 0) {
      notify("error", "Xóa địa chỉ thất bại");
    } else if (deleted === 404) {
      notify("error", "Không tìm thấy địa chỉ");
    } else if (deleted === 500) {
      notify("error", "Lỗi hệ thống");
    } else if (deleted === 1) {
      notify("success", "Xóa địa chỉ thành công");
    }
    return deleted;
  };

  return (
    <AddressContext.Provider
      value={{
        userAddresses,
        loadAddresses,
        addAddress,
        updateAddress,
        deleteAddress,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (!context)
    throw new Error("useAddress must be used within AddressProvider");
  return context;
};
