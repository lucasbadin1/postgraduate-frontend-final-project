"use client";

import { Product } from "@/interface/product";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useProducts } from "@/contexts/products-context";

interface ProductCardProps {
  product: Product | any;
  hideActions?: boolean;
}

export default function ProductCard({
  product,
  hideActions = false,
}: ProductCardProps) {
  const { updateProduct, deleteProduct } = useProducts();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);

  const [draft, setDraft] = useState({
    name: product?.name || "",
    category: product?.category || "",
    price: product?.price != null ? String(product.price) : "",
    description: product?.description || "",
    pictureUrl: product?.pictureUrl || "",
  });

  useEffect(() => {
    setDraft({
      name: product?.name || "",
      category: product?.category || "",
      price: product?.price != null ? String(product.price) : "",
      description: product?.description || "",
      pictureUrl: product?.pictureUrl || "",
    });
  }, [product]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setDraft((d) => ({ ...d, [name]: value }));
  };

  const handleStartEdit = () => setIsEditing(true);

  const handleCancel = () => {
    setDraft({
      name: product?.name || "",
      category: product?.category || "",
      price: product?.price != null ? String(product.price) : "",
      description: product?.description || "",
      pictureUrl: product?.pictureUrl || "",
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    const priceNumber = Number(String(draft.price).replace(",", "."));
    if (!draft.name.trim() || Number.isNaN(priceNumber)) {
      alert("Preencha um nome e um preço válido (ex.: 99.90).");
      return;
    }

    setSaving(true);
    try {
      await updateProduct(product.id, {
        name: draft.name.trim(),
        category: draft.category.trim(),
        price: priceNumber,
        description: draft.description.trim(),
        pictureUrl: draft.pictureUrl.trim() || "/base/placeholder.png",
      });
      setIsEditing(false);
    } catch {
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const ok = window.confirm("Você quer mesmo excluir este produto?");
    if (!ok) return;

    setRemoving(true);
    try {
      await deleteProduct(product.id);
    } catch {
    } finally {
      setRemoving(false);
    }
  };

  const pricePretty =
    product?.price !== undefined &&
    product?.price !== null &&
    !Number.isNaN(Number(product.price))
      ? Number(product.price).toFixed(2)
      : "—";

  return (
    <div
      className="
    flex flex-col justify-center items-center 
    p-6 px-4 gap-4 
    border-2 border-black rounded-2xl bg-white shadow-md
    w-full max-w-[350px] h-auto
    lg:w-[800px] lg:max-h-[500px] lg:min-w-[800px] lg:flex-row
    mx-10
  "
    >
      {/* Imagem */}
      <div className="flex justify-center">
        <Image
          src={
            isEditing
              ? draft.pictureUrl || "/base/placeholder.png"
              : product?.pictureUrl || "/base/placeholder.png"
          }
          alt={product?.name || "Produto sem nome"}
          width={180}
          height={180}
          className="
        rounded-xl object-cover
        w-[180px] h-[180px]
      "
        />
      </div>

      {/* Conteúdo */}
      <div className="flex flex-col flex-grow gap-2 text-left px-4 overflow-hidden">
        {isEditing ? (
          <>
            <input
              name="name"
              value={draft.name}
              onChange={handleChange}
              className="text-lg font-semibold text-black border rounded-lg px-3 py-1"
              placeholder="Nome do produto"
            />
            <input
              name="category"
              value={draft.category}
              onChange={handleChange}
              className="border rounded-lg text-black  px-3 py-1 text-sm"
              placeholder="Categoria"
            />
            <input
              name="price"
              value={draft.price}
              onChange={handleChange}
              className="border rounded-lg text-black  px-3 py-1 text-sm"
              placeholder="Preço (ex.: 199.90)"
            />
            <textarea
              name="description"
              value={draft.description}
              onChange={handleChange}
              className="border rounded-lg text-black  px-3 py-1 text-sm resize-none"
              rows={2}
              placeholder="Descrição"
            />
            <input
              name="pictureUrl"
              value={draft.pictureUrl}
              onChange={handleChange}
              className="border rounded-lg text-black  px-3 py-1 text-sm"
              placeholder="URL da imagem"
            />
          </>
        ) : (
          <>
            <h1 className="text-lg font-bold text-black truncate">
              {product?.name || "—"}
            </h1>
            <p className="text-sm text-gray-600">
              {product?.category || "Categoria"}
            </p>
            <p className="text-base font-semibold text-black">
              R$ {pricePretty}
            </p>
            <p className="text-sm text-gray-700 line-clamp-2">
              {product?.description || ""}
            </p>
          </>
        )}
      </div>

      {/* Ações */}
      {!hideActions && (
        <div className="flex flex-col justify-center gap-2 mt-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-24 h-9 border rounded-lg text-white bg-green-600 hover:bg-green-700 transition disabled:opacity-60"
              >
                {saving ? "Salvando..." : "Salvar"}
              </button>
              <button
                onClick={handleCancel}
                className="w-24 h-9 border rounded-lg text-black bg-gray-300 hover:bg-gray-500 transition"
              >
                Cancelar
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleStartEdit}
                className="w-20 h-9 border rounded-lg text-black bg-gray-200 hover:bg-gray-400 transition"
              >
                Editar
              </button>
              <button
                onClick={handleDelete}
                disabled={removing}
                className="w-20 h-9 border rounded-lg text-white bg-red-600 hover:bg-red-700 transition disabled:opacity-60"
              >
                {removing ? "..." : "Excluir"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
