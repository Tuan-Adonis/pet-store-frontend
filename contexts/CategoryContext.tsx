
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Category } from '../interfaces';
import { categoryApi } from '../api/categoryApi';
import { CreateCategoryRequest } from '../interfaces/request/category';

interface CategoryContextType {
  categories: Category[];
  addCategory: (c: CreateCategoryRequest) => Promise<void>;
  updateCategory: (c: Category) => Promise<void>;
  deleteCategory: (id: number | string) => Promise<void>;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const load = async () => setCategories(await categoryApi.getAll());
    load();
  }, []);

  const addCategory = async (c: CreateCategoryRequest) => {
    const res = await categoryApi.create(c);
    setCategories(prev => [...prev, res]);
  };

  const updateCategory = async (c: Category) => {
    const res = await categoryApi.update(c);
    setCategories(prev => prev.map(x => (x.id === c.id ? res : x)));
  };

  const deleteCategory = async (id: number | string) => {
    await categoryApi.delete(id);
    setCategories(prev => prev.filter(x => x.id !== id));
  };

  return (
    <CategoryContext.Provider value={{ categories, addCategory, updateCategory, deleteCategory }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context) throw new Error('useCategory must be used within CategoryProvider');
  return context;
};
