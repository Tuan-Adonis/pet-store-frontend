
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Product } from '../interfaces';
import { productApi } from '../api/productApi';
import { useCategory } from './CategoryContext';
import { useBreed } from './BreedContext';
import { useOrigin } from './OriginContext';

interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  addProduct: (p: Product) => Promise<void>;
  updateProduct: (p: Product) => Promise<void>;
  deleteProduct: (id: number | string) => Promise<void>;
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { categories } = useCategory();
  const { breeds } = useBreed();
  const { origins } = useOrigin();

  const refreshProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await productApi.getAll();
      setProducts(data);
    } catch (error) {
      console.error("Failed to refresh products", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  // Enrich products with joined data
  const enrichedProducts = useMemo(() => {
    return products.map(p => {
      const cat = categories.find(c => c.id === p.categoryId || c.code === p.categoryId);
      const br = breeds.find(b => b.id === p.breedId);
      const org = origins.find(o => o.id === p.originId);
      return {
          ...p,
          category: cat?.code || p.category, 
          breed: br?.name || p.breed, 
          origin: org?.name || p.origin 
      };
    });
  }, [products, categories, breeds, origins]);

  const addProduct = async (p: Product) => {
    const res = await productApi.create(p);
    setProducts(prev => [...prev, res]);
  };

  const updateProduct = async (p: Product) => {
    // Optimistic update for UI responsiveness
    setProducts(prev => prev.map(x => (x.id === p.id ? { ...x, ...p } : x)));
    await productApi.update(p);
  };

  const deleteProduct = async (id: number | string) => {
    // Soft delete: Change status to 0 (inactive/deleted) instead of removing
    const product = products.find(p => p.id === id);
    if (product) {
        const updated = { ...product, status: 0 }; 
        await updateProduct(updated);
    }
  };

  return (
    <ProductContext.Provider value={{ products: enrichedProducts, isLoading, addProduct, updateProduct, deleteProduct, refreshProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);
  if (!context) throw new Error('useProduct must be used within ProductProvider');
  return context;
};
