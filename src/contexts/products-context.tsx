"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { Product } from "@/interface/product";
import api from "@/lib/api";

interface ProductsContextProps {
  products: Product[];
  addProduct: (p: Omit<Product, "id"> | Product) => Promise<void>;
  updateProduct: (id: number, p: Omit<Product, "id">) => Promise<void>; 
  deleteProduct: (id: number) => Promise<void>; 
}

const ProductsContext = createContext<ProductsContextProps | undefined>(undefined);

export const ProductsProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await api.get<Product[]>("/product");
        setProducts(res.data);
      } catch (err) {
        console.error("Erro ao carregar produtos:", err);
      }
    }
    fetchProducts();
  }, []);

  const addProduct = async (product: Omit<Product, "id"> | Product) => {
    try {
      // se já tiver id (caso do retorno do upload), só adiciona no estado
      if ("id" in product) {
        setProducts((prev) => [...prev, product]);
        return;
      }
      const res = await api.post<Product>("/product", product);
      setProducts((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Erro ao criar produto:", err);
    }
  };

  const updateProduct = async (id: number, updatedProduct: Omit<Product, "id">) => {
    try {
      const response = await api.put<Product>(`/product/${id}`, updatedProduct);
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? response.data : p))
      );
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      throw error;
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      await api.delete(`/product/${id}`);
      setProducts((prev) => prev.filter((it) => it.id !== id));
    } catch (err) {
      console.error("Erro ao excluir produto:", err);
      throw err;
    }
  };

  return (
    <ProductsContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used within ProductsProvider");
  return ctx;
};
