"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useProducts } from "@/contexts/products-context";
import ProductCard from "@/components/product-card";
import Link from "next/link";
import api from "@/lib/api";

export default function ProductsPage() {
  const { products } = useProducts(); // ⬅️ removei addProduct daqui
  const [filterCode, setFilterCode] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filtered, setFiltered] = useState(products);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [csvProducts, setCsvProducts] = useState<any[]>([]); // válidos
  const [invalidProducts, setInvalidProducts] = useState<any[]>([]); // inválidos
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [uploadResults, setUploadResults] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  // ref para limpar o input de arquivo
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => setFiltered(products), [products]);

  useEffect(() => {
    const handler = setTimeout(() => {
      let f = products;
      if (filterCode.trim()) {
        f = f.filter((p) => String(p.id).startsWith(filterCode.trim()));
      } else if (filterCategory) {
        f = f.filter((p) => p.category === filterCategory);
      }
      setFiltered(f);
      setNotFound(f.length === 0);
    }, 500);
    return () => clearTimeout(handler);
  }, [filterCode, filterCategory, products]);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category).filter(Boolean))),
    [products]
  );

  async function handleSearch() {
    if (!filterCode.trim()) {
      setFiltered(products);
      setNotFound(false);
      return;
    }
    try {
      setLoading(true);
      setNotFound(false);
      const res = await api.get(`/product/${filterCode.trim()}`);
      setFiltered([res.data]);
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        setFiltered([]);
        setNotFound(true);
      } else {
        console.error("Erro ao buscar produto:", err);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    setError("");
    setCsvProducts([]);
    setInvalidProducts([]);
    setChecked(new Set());
    setUploadResults([]);
    if (!f) return;

    if (!f.name.toLowerCase().endsWith(".csv")) {
      setError("Extensão de arquivo inválida");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setFile(f);
    const form = new FormData();
    form.append("file", f);
    try {
      const res = await api.post("/product/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCsvProducts(res.data.valid || []);
      setInvalidProducts(res.data.invalid || []);
    } catch (err) {
      console.error("Erro no upload do CSV:", err);
      setError("Falha ao processar o arquivo CSV");
    }
  }

  async function handleSend() {
    const selected = csvProducts.filter((_, i) => checked.has(i));
    if (selected.length === 0) return;

    setSaving(true);
    try {
      const res = await api.post("/product/upload/save", {
        products: selected,
      });
      setUploadResults(res.data);

      // ✅ resetar tudo para “estado zero”
      setFile(null);
      setCsvProducts([]);
      setInvalidProducts([]);
      setChecked(new Set());
      // mantemos uploadResults apenas se você quiser ver mensagem antes do reload.
      setUploadResults([]);

      // limpar o input de arquivo
      if (fileInputRef.current) fileInputRef.current.value = "";

      // recarregar a página para o Provider refazer o GET inicial
      window.location.reload();
    } catch (err) {
      console.error("Erro ao salvar produtos do CSV:", err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-4 bg-white">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-4 mb-8">
        <label htmlFor="code" className="text-lg font-medium text-black">
          Código:
        </label>
        <input
          id="code"
          type="text"
          value={filterCode}
          onChange={(e) => setFilterCode(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
          placeholder="Digite o ID do produto"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? "Buscando..." : "Buscar"}
        </button>

        <label htmlFor="category" className="text-lg font-medium text-black">
          Categoria:
        </label>
        <select
          id="category"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
        >
          <option value="">Todas</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <Link
          href="/products/new"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Novo produto
        </Link>
      </div>

      <div className="flex flex-col items-center justify-center gap-4 mb-6">
        <label className="text-lg font-medium text-black">Arquivo CSV:</label>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="text-gray-500 border-2 rounded-2xl p-2"
        />
        <button
          onClick={handleSend}
          disabled={!file || csvProducts.length === 0 || saving}
          className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
        >
          {saving ? "Salvando..." : "Enviar"}
        </button>
      </div>
      {error && <p className="text-red-600">{error}</p>}

      {(csvProducts.length > 0 || invalidProducts.length > 0) && (
        <ul className="flex flex-col items-center gap-6 mb-6">
          {[...csvProducts, ...invalidProducts].map((p: any, i) => {
            const isInvalid = !!p.errors;
            return (
              <li
                key={i}
                className={`relative w-full flex justify-center ${
                  isInvalid ? "opacity-60" : ""
                }`}
              >

                <div className="relative">
                 
                  <div className="absolute top-5 right-15">
                    <input
                      type="checkbox"
                      disabled={isInvalid}
                      checked={!isInvalid && checked.has(i)}
                      onChange={() => {
                        if (isInvalid) return;
                        const newSet = new Set(checked);
                        newSet.has(i) ? newSet.delete(i) : newSet.add(i);
                        setChecked(newSet);
                      }}
                    />
                  </div>

                  <ProductCard product={p.row ? p.row : p} hideActions />
                </div>
                <div className="mt-2 text-center">
                  {isInvalid && (
                    <p className="text-sm text-red-600">
                      Inválido: {p.errors.join(", ")}
                    </p>
                  )}
                  {uploadResults.find(
                    (r) => r.product === (p.name ?? p.row?.name)
                  ) && (
                    <p className="text-sm text-gray-600">
                      Resultado:{" "}
                      {
                        uploadResults.find(
                          (r) => r.product === (p.name ?? p.row?.name)
                        ).status
                      }
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {notFound ? (
        <p className="text-red-600 text-lg italic">Produto não encontrado.</p>
      ) : (
        <ul className="flex flex-col items-center gap-6">
          {filtered.length > 0 ? (
            filtered.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))
          ) : (
            <li className="text-gray-600 text-lg italic">
              Nenhum produto encontrado.
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
