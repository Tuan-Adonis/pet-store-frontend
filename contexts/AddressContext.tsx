
import React, { createContext, useContext, useState } from 'react';
import { Address } from '../interfaces/models';
import { addressApi } from '../api/addressApi';

interface AddressContextType {
  userAddresses: Address[];
  loadAddresses: (userId: number | string) => Promise<void>;
  addAddress: (addr: Partial<Address>) => Promise<void>;
  updateAddress: (addr: Address) => Promise<void>;
  deleteAddress: (id: number | string) => Promise<void>;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export const AddressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userAddresses, setUserAddresses] = useState<Address[]>([]);

  const loadAddresses = async (userId: number | string) => {
    const data = await addressApi.getByUserId(userId);
    setUserAddresses(data);
  };

  const addAddress = async (addr: Partial<Address>) => {
    const newAddr = await addressApi.create(addr);
    setUserAddresses(prev => [...prev, newAddr]);
  };

  const updateAddress = async (addr: Address) => {
    const updated = await addressApi.update(addr);
    setUserAddresses(prev => prev.map(a => a.id === addr.id ? updated : a));
  };

  const deleteAddress = async (id: number | string) => {
    await addressApi.delete(id);
    setUserAddresses(prev => prev.filter(a => a.id !== id));
  };

  return (
    <AddressContext.Provider value={{ userAddresses, loadAddresses, addAddress, updateAddress, deleteAddress }}>
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (!context) throw new Error('useAddress must be used within AddressProvider');
  return context;
};
