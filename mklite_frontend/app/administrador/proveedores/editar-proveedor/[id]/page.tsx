"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getSupplierById, updateSupplier } from "@/services/supplierService";
import { Supplier } from "@/app/models/Supplier";
const CATEGORIES = ["Bebidas", "Abarrotes", "Panadería", "Cárnicos", "Lácteos", "Limpieza", "Higiene Personal", "Otros"];

export default function EditSupplierPage() {
  const router = useRouter();
  const params = useParams();
  const supplierId = Number(params.id);

  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSupplier = async () => {
      try {
        setLoading(true);
        const data = await getSupplierById(supplierId);
        setSupplier(data);
      } catch (err: any) {
        setError(err.message || "Error cargando proveedor");
      } finally {
        setLoading(false);
      }
    };
    loadSupplier();
  }, [supplierId]);

  const handleChange = (field: keyof Supplier, value: string) => {
    if (!supplier) return;
    setSupplier({ ...supplier, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supplier) return;

    try {
      await updateSupplier(supplier.id_supplier, supplier);
      router.push("/administrador/proveedores"); // redirige al listado
    } catch (err: any) {
      setError(err.message || "Error actualizando proveedor");
    }
  };

  if (loading) return <div className="p-4 text-white">Cargando proveedor...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!supplier) return null;

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-8 font-sans text-gray-100">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700">
        <h1 className="text-2xl font-bold text-red-500 mb-6">Editar Proveedor</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">Nombre de la Empresa</label>
            <input
              type="text"
              required
              value={supplier.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
              placeholder="Ej. Distribuidora Central"
            />
          </div>

          {/* Categoría */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">Categoría</label>
            <select
              value={supplier.category}
              onChange={(e) => handleChange("category", e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Contacto */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">Nombre de Contacto</label>
            <input
              type="text"
              required
              value={supplier.manager_name}
              onChange={(e) => handleChange("manager_name", e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
              placeholder="Ej. Juan Pérez"
            />
          </div>

          {/* Teléfono */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">Teléfono / Celular</label>
            <input
              type="text"
              required
              value={supplier.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
              placeholder="Ej. 772-12345"
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">Correo Electrónico</label>
            <input
              type="email"
              required
              value={supplier.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
              placeholder="contacto@empresa.com"
            />
          </div>

          {/* Dirección */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-300">Dirección Física</label>
            <input
              type="text"
              value={supplier.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
              placeholder="Calle, Número, Zona"
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => router.push("/administrador/proveedores")}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg transition"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
