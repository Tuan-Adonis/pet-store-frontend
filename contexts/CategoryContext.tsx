import React, { createContext, useContext, useState, useEffect } from "react";
import { Category } from "../interfaces";
import { categoryApi } from "../api/categoryApi";
import {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../interfaces/request/category";
import { useNotification } from "./NotificationContext";

interface CategoryContextType {
  categories: Category[];
  addCategory: (c: CreateCategoryRequest) => Promise<void>;
  updateCategory: (c: Category) => Promise<void>;
  deleteCategory: (id: number | string) => Promise<void>;
}

const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined
);

export const CategoryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { notify } = useNotification();
  const [categories, setCategories] = useState<Category[]>([]);

  const load = async () => setCategories(await categoryApi.getAll());

  useEffect(() => {
    load();
  }, []);

  const addCategory = async (c: CreateCategoryRequest) => {
    const res = await categoryApi.create(c);
    if (res === null) {
      notify("error", "Thêm danh mục mới thất bại");
    } else {
      notify("success", "Thêm danh mục mới thành công");
      load();
    }
  };

  const updateCategory = async (c: UpdateCategoryRequest) => {
    const res = await categoryApi.update(c);
    if (res === 0) {
      notify("error", "Cập nhật thất bại");
    } else if (res === 404) {
      notify("error", "Không tìm thấy danh mục");
    } else if (res === 500) {
      notify("error", "Lỗi hệ thống");
    } else if (res === 1) {
      notify("success", "Cập nhật thái thành công");
      load();
    }
  };

  const deleteCategory = async (id: number | string) => {
    const res = await categoryApi.delete(id);
    if (res === 0) {
      notify("error", "Đổi trạng thái thất bại");
    } else if (res === 404) {
      notify("error", "Không tìm thấy danh mục");
    } else if (res === 500) {
      notify("error", "Lỗi hệ thống");
    } else if (res === 1) {
      notify("success", "Đổi trạng thái thành công");
      load();
    }
  };

  return (
    <CategoryContext.Provider
      value={{ categories, addCategory, updateCategory, deleteCategory }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => {
  const context = useContext(CategoryContext);
  if (!context)
    throw new Error("useCategory must be used within CategoryProvider");
  return context;
};
