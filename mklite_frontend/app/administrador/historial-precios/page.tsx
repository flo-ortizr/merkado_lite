"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation'; // Importamos usePathname para el menú activo

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

// --- 2. DATOS DE SIMULACIÓN ---
const MOCK_PRODUCTS = [
  { id: 1, name: 'Coca-Cola 2Lt', currentPrice: 15.50, unit: 'Bs.' },
  { id: 2, name: 'Fanta Naranja 1Lt', currentPrice: 8.75, unit: 'Bs.' },
  { id: 3, name: 'Agua Mineral 500ml', currentPrice: 4.00, unit: 'Bs.' },
];

const MOCK_HISTORY_ALL = [
    { id: 4, productId: 1, date: '2025-11-22 10:00', newPrice: 15.50, oldPrice: 15.00, user: 'Admin (System)', motive: 'Reversión de precio (ID 2)' },
    { id: 3, productId: 1, date: '2025-11-21 15:30', newPrice: 15.00, oldPrice: 14.50, user: 'Manager J. Doe', motive: 'Ajuste por aumento de costo de azúcar' },
    { id: 2, productId: 1, date: '2025-11-10 09:00', newPrice: 14.50, oldPrice: 14.00, user: 'Admin P. Smith', motive: 'Promoción de verano finalizada' },
    { id: 1, productId: 1, date: '2025-10-01 08:00', newPrice: 14.00, oldPrice: 13.00, user: 'Admin P. Smith', motive: 'Precio inicial de lanzamiento' },
    { id: 5, productId: 2, date: '2025-11-15 11:45', newPrice: 8.75, oldPrice: 8.00, user: 'Manager J. Doe', motive: 'Corrección de error de digitación' },
    { id: 6, productId: 3, date: '2025-10-25 14:00', newPrice: 4.00, oldPrice: 3.50, user: 'Admin (System)', motive: 'Ajuste inflacionario' },
];

// --- COMPONENTE PRINCIPAL ---
export default function HistorialPrecios() {
  const router = useRouter();
  const activePath = usePathname(); // Para saber en qué página estamos

  // --- Estados de Lógica de Historial ---
  const [selectedProductId, setSelectedProductId] = useState(MOCK_PRODUCTS[0].id);
  const [products, setProducts] = useState(MOCK_PRODUCTS);

  // --- Funciones del Menú ---
  const goTo = (path: string) => {
    router.push(path);
  };

  // --- Lógica del Historial (useMemo, handlers) ---
  const currentProduct = useMemo(() => 
    products.find(p => p.id === selectedProductId) || MOCK_PRODUCTS[0], 
    [selectedProductId, products]
  );
  
  const history = useMemo(() => 
    MOCK_HISTORY_ALL.filter(h => h.productId === selectedProductId)
                    .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [selectedProductId]
  );
  
  const precioActual = history.length > 0 ? history[0].newPrice : currentProduct.currentPrice;

  const handleRevertPrice = useCallback((historyEntry: any) => {
    const confirmation = `¿Está seguro de revertir el precio de ${currentProduct.name} a ${currentProduct.unit} ${historyEntry.newPrice.toFixed(2)} (${historyEntry.date})?`;
    if (!window.confirm(confirmation)) return;

    const newPrice = historyEntry.newPrice;
    setProducts(prevProducts => prevProducts.map(p => 
        p.id === selectedProductId ? { ...p, currentPrice: newPrice } : p
    ));

    const newHistoryEntry = {
        id: MOCK_HISTORY_ALL.length + 1,
        productId: selectedProductId,
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        newPrice: newPrice,
        oldPrice: precioActual,
        user: 'Admin (Reversión Manual)',
        motive: `Reversión a precio del ${historyEntry.date} (${historyEntry.newPrice.toFixed(2)})`,
    };
    
    MOCK_HISTORY_ALL.unshift(newHistoryEntry);
    alert(`¡Precio revertido con éxito! El nuevo precio es ${newPrice.toFixed(2)}.`);
  }, [currentProduct, selectedProductId, precioActual]);

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProductId(parseInt(e.target.value));
  };

  return (
    // CONTENEDOR PRINCIPAL: Flex para poner el menú a la izquierda y el contenido a la derecha
    <div style={{ display: 'flex', width: '100%', minHeight: '100vh', backgroundColor: '#111827' }}>
        
        {/* --- MENÚ LATERAL (Pegado tal cual lo pediste) --- */}
        <nav style={{
            width: '220px',
            backgroundColor: '#111827', // fondo oscuro elegante
            minHeight: '100vh',
            padding: '25px 15px',
            color: '#F9FAFB',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            boxShadow: '2px 0 8px rgba(0,0,0,0.2)',
            flexShrink: 0 // Para que no se aplaste
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

        {/* --- CONTENIDO DE LA PANTALLA (A la derecha del menú) --- */}
        <div className="flex-1 bg-gray-900 p-4 sm:p-8 font-sans text-gray-100 overflow-y-auto h-screen">
          <div className="max-w-7xl mx-auto">
            
            {/* Header Interno */}
            <header className="mb-8">
              <h1 className="text-3xl font-extrabold text-red-500 mb-2">Historial y Auditoría de Precios</h1>
              <p className="text-gray-400">Consulta los cambios históricos y revierte a precios anteriores con un clic.</p>
            </header>

            {/* Panel de Control (Select y Precio Actual) */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-red-700 mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-2">
                    <label htmlFor="productSelector" className="block text-sm font-medium text-gray-200">
                        Seleccionar Producto a Auditar
                    </label>
                    <select
                        id="productSelector"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2.5 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                        value={selectedProductId}
                        onChange={handleProductChange}
                    >
                        {MOCK_PRODUCTS.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>

                <div className="bg-red-800/20 p-4 rounded-lg border-l-4 border-red-500 flex flex-col justify-center">
                    <p className="text-sm font-medium text-red-400 uppercase">Precio Actual Vigente</p>
                    <div className="text-4xl font-extrabold text-white mt-1">
                        {currentProduct.unit} {precioActual.toFixed(2)}
                    </div>
                </div>
            </div>

            {/* Tabla de Historial */}
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Historial de Cambios para {currentProduct.name}
            </h2>
            
            <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-red-900/40">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase">Fecha</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase">Precio Anterior</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase">Nuevo Precio</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase">Usuario</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-white uppercase">Motivo</th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-white uppercase">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {history.length > 0 ? (
                      history.map((h, index) => {
                        const isCurrentPrice = index === 0 && h.newPrice === precioActual;
                        return (
                            <tr key={h.id} className={`${isCurrentPrice ? 'bg-gray-700/50' : 'hover:bg-gray-700/30'} transition duration-150`}>
                                <td className="px-6 py-4 text-sm font-medium text-gray-300">{h.date}</td>
                                <td className="px-6 py-4 text-sm text-gray-400">{h.oldPrice.toFixed(2)}</td>
                                <td className="px-6 py-4 text-sm font-bold text-red-400">{h.newPrice.toFixed(2)}</td>
                                <td className="px-6 py-4 text-sm text-gray-300">{h.user}</td>
                                <td className="px-6 py-4 text-sm text-gray-400">{h.motive}</td>
                                <td className="px-6 py-4 text-right">
                                    {!isCurrentPrice ? (
                                        <button 
                                            onClick={() => handleRevertPrice(h)}
                                            className="text-white hover:bg-red-700 transition bg-red-600 py-1.5 px-3 rounded text-sm font-semibold shadow-md"
                                        >
                                            Revertir
                                        </button>
                                    ) : (
                                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-gray-600 text-gray-300">
                                            Actual
                                        </span>
                                    )}
                                </td>
                            </tr>
                        )
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                            No se encontró historial.
                        </td>
                      </tr>
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