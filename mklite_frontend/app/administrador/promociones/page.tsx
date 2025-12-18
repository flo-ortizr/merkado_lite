"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Promotion } from "@/app/models/Promotion";
import { getAllPromotions, deletePromotion } from "@/services/promotionService";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation"; // Se agrega usePathname

// --- 1. CONFIGURACIÓN DEL MENÚ ---
const MENU_OPTIONS = [
  { label: 'Ventas', path: '/administrador/ventas' },
  { label: 'Usuarios', path: '/administrador/usuarios/lista' },
  { label: 'Proveedores', path: '/administrador/proveedores' },
  { label: 'Promociones', path: '/administrador/promociones' },
  { label: 'Pedidos', path: '/administrador/pedidos' },
  { label: 'Ofertas', path: '/administrador/ofertas' },
  { label: 'Historial Precios', path: '/administrador/historial-precios' },
];

export default function GestionPromociones() {
  const [promociones, setPromociones] = useState<Promotion[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();
  const activePath = usePathname(); // Para el menú activo

  // Modal (Estados originales)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPromocion, setCurrentPromocion] = useState<any>(null);
  const [validationError, setValidationError] = useState("");

  // --- Funciones del Menú ---
  const goTo = (path: string) => {
    router.push(path);
  };

  // --- Cargar promociones reales ---
  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const data = await getAllPromotions();
        setPromociones(data);
      } catch (error) {
        console.error("Error cargando promociones", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotions();
  }, []);

  const getEstadoClass = useCallback((estado: string) => {
    switch (estado) {
      case "active":
        return "bg-green-900/30 text-green-300 border border-green-700";
      case "scheduled":
        return "bg-blue-900/30 text-blue-300 border border-blue-700";
      case "expired":
        return "bg-gray-700/50 text-gray-400 border-gray-600";
      default:
        return "bg-gray-700/50 text-gray-400 border-gray-600";
    }
  }, []);

  // --- Filtrado ---
  const promocionesFiltradas = useMemo(() => {
    return promociones.filter((p) =>
      p.name.toLowerCase().includes(busqueda.toLowerCase())
    );
  }, [promociones, busqueda]);

  // --- Eliminar promoción (real backend) ---
  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro deseas eliminar esta promoción?")) return;

    try {
      await deletePromotion(id);
      setPromociones((prev) => prev.filter((p) => p.id_promotion !== id));
    } catch (error) {
      alert("Error eliminando promoción");
      console.error(error);
    }
  };

  return (
    // CONTENEDOR PRINCIPAL FLEX PARA MENU LATERAL
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', backgroundColor: '#111827' }}>
        
        {/* --- MENÚ LATERAL --- */}
        <nav style={{
            width: '220px',
            backgroundColor: '#111827',
            minHeight: '100vh',
            padding: '25px 15px',
            color: '#F9FAFB',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxShadow: '2px 0 8px rgba(0,0,0,0.2)',
            flexShrink: 0
        }}>
            <h2 style={{
                fontSize: '20px',
                fontWeight: '700',
                marginBottom: '25px',
                letterSpacing: '1px',
                borderBottom: '1px solid #374151',
                paddingBottom: '10px'
            }}>Menú</h2>

            {MENU_OPTIONS.map(option => (
                <button
                    key={option.path}
                    onClick={() => goTo(option.path)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '12px 15px',
                        backgroundColor: activePath === option.path ? '#2563EB' : '#1F2937',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        color: '#F9FAFB',
                        fontWeight: '500',
                        textAlign: 'left',
                        transition: 'all 0.3s',
                        boxShadow: activePath === option.path ? '0 4px 6px rgba(0,0,0,0.2)' : 'none'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#374151'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = activePath === option.path ? '#2563EB' : '#1F2937'}
                >
                    {option.label}
                </button>
            ))}
        </nav>

        {/* --- CONTENIDO PRINCIPAL DE LA PÁGINA (Tu código original envuelto aquí) --- */}
        <div className="flex-1 bg-gray-900 p-4 sm:p-8 text-gray-100 overflow-y-auto h-screen">

          {/* HOME BUTTON */}
          <div className="mb-6">
            <Link
              href="/administrador/usuarios/lista"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-gray-200 shadow-lg"
            >
              ← Volver al Inicio
            </Link>
          </div>

          <div className="max-w-7xl mx-auto">
            {/* Encabezado */}
            <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-red-500 mb-2">
                  Gestión de Promociones
                </h1>
                <p className="text-gray-400">
                  Administra las promociones creadas en el sistema.
                </p>
              </div>

              <button
                onClick={() => router.push("/administrador/promociones/crear-promocion")}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg shadow-lg transition"
              >
                + Nueva Promoción
              </button>
            </header>

            {/* BUSCADOR */}
            <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 mb-6 flex items-center gap-3">
              <input
                type="text"
                placeholder="Buscar por nombre..."
                className="bg-transparent border-none focus:ring-0 text-gray-200 w-full placeholder-gray-500"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            {/* TABLA */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                        Nombre
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                        Tipo
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                        Vigencia
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">
                        Estado
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase">
                        Acciones
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-700">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="text-center py-12 text-gray-400">
                          Cargando promociones...
                        </td>
                      </tr>
                    ) : promocionesFiltradas.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-12 text-gray-500">
                          No hay promociones registradas.
                        </td>
                      </tr>
                    ) : (
                      promocionesFiltradas.map((p) => (
                        <tr key={p.id_promotion} className="hover:bg-gray-700/50 transition">
                          <td className="px-6 py-4">{p.name}</td>
                          <td className="px-6 py-4">{p.discount_type}</td>
                          <td className="px-6 py-4">
                            {p.start_date} → {p.end_date}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 text-xs rounded-full ${getEstadoClass(
                                p.status
                              )}`}
                            >
                              {p.status}
                            </span>
                          </td>

                           <td className="px-6 py-4 text-right">
                            {/* EDIT */}
                            <button
                              className="text-indigo-400 hover:text-indigo-300 mr-2"
                              onClick={() =>
                                router.push(`/administrador/promociones/editar-promocion/${p.id_promotion}`)
                              }
                            >
                              Editar
                            </button>

                            {/* DELETE */}
                            <button
                              onClick={() => handleDelete(p.id_promotion || 0)}
                              className="text-red-400 hover:text-red-300"
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
        </div>
    </div>
  );
}
