
import { INITIAL_PRODUCTS } from "../constants";
import { Product } from "../interfaces/models";
import { CreateProductRequest, UpdateProductRequest } from "../interfaces/request/product";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const productApi = {
  getAll: async (): Promise<Product[]> => {
    await delay(500);
    return [...INITIAL_PRODUCTS];
  },

  getById: async (id: number | string): Promise<Product | undefined> => {
    await delay(300);
    return INITIAL_PRODUCTS.find(p => p.id === id);
  },

  create: async (data: CreateProductRequest): Promise<Product> => {
    await delay(600);
    const newProduct = { ...data, id: `p${Date.now()}` } as unknown as Product;
    INITIAL_PRODUCTS.push(newProduct);
    return newProduct;
  },

  update: async (data: UpdateProductRequest): Promise<Product> => {
    await delay(600);
    const index = INITIAL_PRODUCTS.findIndex(p => p.id === data.id);
    if (index !== -1) {
        INITIAL_PRODUCTS[index] = { ...INITIAL_PRODUCTS[index], ...data } as unknown as Product;
        return INITIAL_PRODUCTS[index];
    }
    return data as unknown as Product;
  },

  delete: async (id: number | string): Promise<boolean> => {
    await delay(400);
    const index = INITIAL_PRODUCTS.findIndex(p => p.id === id);
    if (index !== -1) {
        INITIAL_PRODUCTS.splice(index, 1);
    }
    return true;
  }
};
