"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Promotion } from "@/app/models/Promotion";
import { createPromotion } from "@/services/promotionService";
import { fetchProducts } from "@/services/productService";

interface Product {
  id_product: number;
  name: string;
}

export default function CrearPromocion() {
  const router = useRouter();

  const [formData, setFormData] = useState<Promotion>({
    id_promotion: 0,
    name: "",
    discount_type: "percentage",
    value: 0,
    buy_x: undefined,
    get_y: undefined,
    description: "",
    start_date: "",
    end_date: "",
    status: "scheduled",
    products: [],
  });

  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (err: any) {
        console.error("Error cargando productos:", err);
      }
    };
    loadProducts();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProductToggle = (id_product: number) => {
    setSelectedProducts((prev) =>
      prev.includes(id_product)
        ? prev.filter((id) => id !== id_product)
        : [...prev, id_product]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const dataToSend = { ...formData, products: selectedProducts || [] };
      delete dataToSend.id_promotion;

      await createPromotion(dataToSend as any); // Backend debe aceptar array de IDs
      router.push("/administrador/promociones");
    } catch (err: any) {
      setError(err.message || "Error al crear promoción");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 font-sans text-gray-100">
      <div className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">

        {/* HEADER */}
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold text-red-500">Crear Promoción</h1>
        </header>

        {/* ERROR */}
        {error && (
          <div className="bg-red-600/20 text-red-400 border border-red-600 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Nombre */}
          <div>
            <label className="block mb-1 text-gray-300">Nombre de la promoción</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
          </div>

          {/* Tipo de descuento */}
          <div>
            <label className="block mb-1 text-gray-300">Tipo de descuento</label>
            <select
              name="discount_type"
              value={formData.discount_type}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
            >
              <option value="percentage">Porcentaje (%)</option>
              <option value="fixed">Monto fijo</option>
              <option value="buy_x_get_y">Compra X y lleva Y</option>
            </select>
          </div>

          {/* Valor */}
          {formData.discount_type !== "buy_x_get_y" && (
            <div>
              <label className="block mb-1 text-gray-300">
                Valor {formData.discount_type === "percentage" ? "(%)" : "(Bs)"}
              </label>
              <input
                type="number"
                name="value"
                required
                value={formData.value}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              />
            </div>
          )}

          {/* Buy X Get Y */}
          {formData.discount_type === "buy_x_get_y" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-gray-300">Compra X</label>
                <input
                  type="number"
                  name="buy_x"
                  value={formData.buy_x || ""}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-300">Llévate Y</label>
                <input
                  type="number"
                  name="get_y"
                  value={formData.get_y || ""}
                  onChange={handleChange}
                  required
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>
            </div>
          )}

          {/* Descripción */}
          <div>
            <label className="block mb-1 text-gray-300">Descripción</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
            />
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-gray-300">Fecha inicio</label>
              <input
                type="date"
                name="start_date"
                required
                value={formData.start_date}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-300">Fecha fin</label>
              <input
                type="date"
                name="end_date"
                required
                value={formData.end_date}
                onChange={handleChange}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
              />
            </div>
          </div>

          {/* Estado */}
          <div>
            <label className="block mb-1 text-gray-300">Estado</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
            >
              <option value="scheduled">Programada</option>
              <option value="active">Activa</option>
              <option value="expired">Expirada</option>
            </select>
          </div>

          {/* Productos */}
          <div>
            <label className="block mb-2 text-gray-300 font-semibold">Productos</label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border border-gray-600 rounded-lg p-3">
              {products.map((p) => (
                <label key={p.id_product} className="flex items-center gap-2 text-gray-200">
                  <input
                    type="checkbox"
                    checked={selectedProducts.includes(p.id_product)}
                    onChange={() => handleProductToggle(p.id_product)}
                    className="accent-red-500"
                  />
                  {p.name}
                </label>
              ))}
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={() => router.push("/administrador/promociones")}
              className="w-1/2 bg-gray-600 hover:bg-gray-500 text-white font-semibold py-3 rounded-lg transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-1/2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition"
            >
              {loading ? "Creando..." : "Crear Promoción"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
