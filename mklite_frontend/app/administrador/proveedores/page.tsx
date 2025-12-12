"use client";

import React, { useEffect, useState } from "react";
import styles from "./GestionProveedores.module.css";
import { Supplier } from "@/app/models/Supplier";
import { getAllSuppliers, deleteSupplier } from "@/services/supplierService";
import { useRouter } from "next/navigation";

const CATEGORIAS = [
  "Bebidas",
  "Abarrotes",
  "Panadería",
  "Cárnicos",
  "Lácteos",
  "Limpieza",
  "Higiene Personal",
  "Otros",
];

export default function GestionProveedores() {
  const [proveedores, setProveedores] = useState<Supplier[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [proveedorToDelete, setProveedorToDelete] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        setLoading(true);
        const data = await getAllSuppliers();
        setProveedores(data);
      } catch (err: any) {
        setError(err.message || "Error cargando proveedores");
      } finally {
        setLoading(false);
      }
    };
    loadSuppliers();
  }, []);

  const proveedoresFiltrados = proveedores.filter(
    (p) =>
      p.name.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.manager_name.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.category.toLowerCase().includes(busqueda.toLowerCase())
  );

  const handleDeleteClick = (id: number) => {
    setProveedorToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (proveedorToDelete !== null) {
      try {
        await deleteSupplier(proveedorToDelete);
        setProveedores(proveedores.filter((p) => p.id_supplier !== proveedorToDelete));
      } catch (err: any) {
        setError(err.message || "Error eliminando proveedor");
      } finally {
        setIsDeleteModalOpen(false);
        setProveedorToDelete(null);
      }
    }
  };

  if (loading) return <div className="text-white p-4">Cargando proveedores...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className={`min-h-screen bg-gray-900 p-4 sm:p-8 font-sans text-gray-100 ${styles.container}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <button
              onClick={() => router.push("/administrador/usuarios/lista")}
              className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition"
            >
              Home
            </button>
            <h1 className="text-3xl font-extrabold text-red-500 mb-2">Gestión de Proveedores</h1>
            
          </div>
          <button
            onClick={() => router.push("/administrador/proveedores/crear-proveedor")}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg shadow-red-600/20 transition duration-300 flex items-center justify-center gap-2"
          >
            + Nuevo Proveedor
          </button>
        </header>

        {/* Buscador */}
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700 mb-6 flex items-center gap-3">
          <input
            type="text"
            placeholder="Buscar por nombre, contacto o categoría..."
            className="bg-transparent border-none focus:ring-0 text-gray-200 w-full placeholder-gray-500"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* Tabla */}
        <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Empresa</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Contacto</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Información</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Categoría</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {proveedoresFiltrados.length > 0 ? (
                  proveedoresFiltrados.map((p) => (
                    <tr key={p.id_supplier} className="hover:bg-gray-700/50 transition duration-150">
                      <td className="px-6 py-4">{p.name}</td>
                      <td className="px-6 py-4">{p.manager_name}</td>
                      <td className="px-6 py-4">
                        {p.phone} <br /> {p.email} <br /> {p.address}
                      </td>
                      <td className="px-6 py-4">{p.category}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          className="text-indigo-400 hover:text-indigo-300 mr-2"
                          onClick={() =>
                            router.push(`/administrador/proveedores/editar-proveedor/${p.id_supplier}`)
                          }
                        >
                          Editar
                        </button>
                        <button
                          className="text-red-400 hover:text-red-300"
                          onClick={() => handleDeleteClick(p.id_supplier)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      No se encontraron proveedores
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de confirmación de eliminación */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 p-6 max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="h-8 w-8 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">¿Eliminar Proveedor?</h3>
            <p className="text-gray-400 mb-6">
              Esta acción no se puede deshacer. Se perderá la información de contacto asociada.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
