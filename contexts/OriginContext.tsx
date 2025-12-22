
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Origin } from '../interfaces';
import { originApi } from '../api/originApi';
import { CreateOriginRequest } from '../interfaces/request/origin';

interface OriginContextType {
  origins: Origin[];
  addOrigin: (o: CreateOriginRequest) => Promise<void>;
  deleteOrigin: (id: number | string) => Promise<void>;
}

const OriginContext = createContext<OriginContextType | undefined>(undefined);

export const OriginProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [origins, setOrigins] = useState<Origin[]>([]);

  useEffect(() => {
    const load = async () => setOrigins(await originApi.getAll());
    load();
  }, []);

  const addOrigin = async (o: CreateOriginRequest) => {
    const res = await originApi.create(o);
    setOrigins(prev => [...prev, res]);
  };

  const deleteOrigin = async (id: number | string) => {
    await originApi.delete(id);
    setOrigins(prev => prev.filter(x => x.id !== id));
  };

  return (
    <OriginContext.Provider value={{ origins, addOrigin, deleteOrigin }}>
      {children}
    </OriginContext.Provider>
  );
};

export const useOrigin = () => {
  const context = useContext(OriginContext);
  if (!context) throw new Error('useOrigin must be used within OriginProvider');
  return context;
};
