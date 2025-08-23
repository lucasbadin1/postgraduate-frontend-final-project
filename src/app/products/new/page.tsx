"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProducts } from "@/contexts/products-context";

export default function NewProductPage() {
  const router = useRouter();
  const { addProduct } = useProducts();

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    pictureUrl: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleCreate() {
    const priceNumber = Number(String(form.price).replace(",", "."));
    if (!form.name.trim() || Number.isNaN(priceNumber)) {
      alert("Preencha um nome e um preço válido (ex.: 99.90).");
      return;
    }

    addProduct({
      name: form.name.trim(),
      price: priceNumber,
      description: form.description.trim(),
      category: form.category.trim(),
      pictureUrl: form.pictureUrl.trim() || "/base/placeholder.png",
    });

    router.push("/products");
  }

  function handleCancel() {
    router.push("/products");
  }

  return (
    <div className="max-w-xl">
      <h2 className="text-2xl font-semibold mb-6">Novo produto</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nome</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Ex.: Fone Bluetooth"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Preço</label>
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Ex.: 199.90"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Categoria</label>
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Ex.: Áudio"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descrição</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            rows={4}
            placeholder="Ex.: Som estéreo, 20h de bateria..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">URL da imagem</label>
          <input
            name="pictureUrl"
            value={form.pictureUrl}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            placeholder="Ex.: https://images.unsplash.com/...   Insira imagens do site unsplash"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleCreate}
            className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
          >
            Criar
          </button>
          <button
            onClick={handleCancel}
            className="px-6 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
