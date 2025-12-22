
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Breed } from '../interfaces';
import { breedApi } from '../api/breedApi';
import { CreateBreedRequest } from '../interfaces/request/breed';

interface BreedContextType {
  breeds: Breed[];
  addBreed: (b: CreateBreedRequest) => Promise<void>;
  deleteBreed: (id: number | string) => Promise<void>;
}

const BreedContext = createContext<BreedContextType | undefined>(undefined);

export const BreedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [breeds, setBreeds] = useState<Breed[]>([]);

  useEffect(() => {
    const load = async () => setBreeds(await breedApi.getAll());
    load();
  }, []);

  const addBreed = async (b: CreateBreedRequest) => {
    const res = await breedApi.create(b);
    setBreeds(prev => [...prev, res]);
  };

  const deleteBreed = async (id: number | string) => {
    await breedApi.delete(id);
    setBreeds(prev => prev.filter(x => x.id !== id));
  };

  return (
    <BreedContext.Provider value={{ breeds, addBreed, deleteBreed }}>
      {children}
    </BreedContext.Provider>
  );
};

export const useBreed = () => {
  const context = useContext(BreedContext);
  if (!context) throw new Error('useBreed must be used within BreedProvider');
  return context;
};
