// src/app/products/layout.tsx
import { ReactNode } from "react";
import Link from "next/link";
import { ProductsProvider } from "@/contexts/products-context";

export default async function ProductsLayout({ children }: { children: ReactNode }) {

  return (
    <ProductsProvider>
      <div className="min-h-screen flex">
        
        <aside className="w-64 border-r p-4">
          <div className="font-bold text-lg mb-4">Menu</div>
          <nav className="space-y-2">
            <Link className="block hover:underline" href="/products">Produtos</Link>
            <Link className="block hover:underline" href="/products/new">Novo produto</Link>
          </nav>
        </aside>

        <div className="flex-1 flex flex-col">
          <header className="border-b p-4">
            <h1 className="text-xl font-semibold">Portal de Produtos</h1>
          </header>
          <main className="p-6">{children}</main>
        </div>
      </div>
    </ProductsProvider>
  );
}
