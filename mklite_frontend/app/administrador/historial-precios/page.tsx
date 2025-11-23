"use client";

import React, { useState, useMemo, useCallback } from 'react';

// --- Datos de Simulación (Mock Data) ---
const MOCK_PRODUCTS = [
  { id: 1, name: 'Coca-Cola 2Lt', currentPrice: 15.50, unit: 'Bs.' },
  { id: 2, name: 'Fanta Naranja 1Lt', currentPrice: 8.75, unit: 'Bs.' },
  { id: 3, name: 'Agua Mineral 500ml', currentPrice: 4.00, unit: 'Bs.' },
];

const MOCK_HISTORY_ALL = [
    // Historial para Coca-Cola 2Lt (ID 1)
    { id: 4, productId: 1, date: '2025-11-22 10:00', newPrice: 15.50, oldPrice: 15.00, user: 'Admin (System)', motive: 'Reversión de precio (ID 2)' },
    { id: 3, productId: 1, date: '2025-11-21 15:30', newPrice: 15.00, oldPrice: 14.50, user: 'Manager J. Doe', motive: 'Ajuste por aumento de costo de azúcar' },
    { id: 2, productId: 1, date: '2025-11-10 09:00', newPrice: 14.50, oldPrice: 14.00, user: 'Admin P. Smith', motive: 'Promoción de verano finalizada' },
    { id: 1, productId: 1, date: '2025-10-01 08:00', newPrice: 14.00, oldPrice: 13.00, user: 'Admin P. Smith', motive: 'Precio inicial de lanzamiento' },
    
    // Historial para Fanta Naranja 1Lt (ID 2)
    { id: 5, productId: 2, date: '2025-11-15 11:45', newPrice: 8.75, oldPrice: 8.00, user: 'Manager J. Doe', motive: 'Corrección de error de digitación' },
    
    // Historial para Agua Mineral 500ml (ID 3)
    { id: 6, productId: 3, date: '2025-10-25 14:00', newPrice: 4.00, oldPrice: 3.50, user: 'Admin (System)', motive: 'Ajuste inflacionario' },
];

// --- Componente Principal ---
export default function HistorialPrecios() {
  
  // Estado para el producto seleccionado (por defecto el primero)
  const [selectedProductId, setSelectedProductId] = useState(MOCK_PRODUCTS[0].id);
  const [products, setProducts] = useState(MOCK_PRODUCTS);

  // Obtener el producto actualmente seleccionado y su historial
  const currentProduct = useMemo(() => 
    products.find(p => p.id === selectedProductId) || MOCK_PRODUCTS[0], 
    [selectedProductId, products]
  );
  
  const history = useMemo(() => 
    MOCK_HISTORY_ALL.filter(h => h.productId === selectedProductId)
                    .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [selectedProductId]
  );
  
  // El precio actual es el primer elemento del historial si existe, 
  // sino, es el precio de la lista de productos
  const precioActual = history.length > 0 ? history[0].newPrice : currentProduct.currentPrice;

  // Maneja la reversión del precio (simulación)
  const handleRevertPrice = useCallback((historyEntry) => {
    // 1. Preguntar al usuario (usando modal o confirmación simulada)
    const confirmation = `¿Está seguro de revertir el precio de ${currentProduct.name} a ${currentProduct.unit} ${historyEntry.newPrice.toFixed(2)} (${historyEntry.date})?`;
    
    // En una app real usarías un modal, pero aquí simulamos con window.confirm
    // NOTA: En un entorno de Canvas, se debe usar un modal customizado en lugar de window.confirm.
    if (!window.confirm(confirmation)) {
        return;
    }

    // 2. Actualizar el precio actual del producto (simulación de DB)
    const newPrice = historyEntry.newPrice;

    setProducts(prevProducts => prevProducts.map(p => 
        p.id === selectedProductId ? { ...p, currentPrice: newPrice } : p
    ));

    // 3. Registrar la acción como un nuevo cambio en el historial (simulación)
    const newHistoryEntry = {
        id: MOCK_HISTORY_ALL.length + 1, // Nuevo ID para el mock
        productId: selectedProductId,
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        newPrice: newPrice,
        oldPrice: precioActual,
        user: 'Admin (Reversión Manual)',
        motive: `Reversión a precio del ${historyEntry.date} (${historyEntry.newPrice.toFixed(2)})`,
    };
    
    // NOTA: En un entorno real, esto se manejaría con llamadas a la API de Firestore.
    MOCK_HISTORY_ALL.unshift(newHistoryEntry); // Simular añadir al principio del historial global

    // NOTA: En un entorno de Canvas, se debe usar un modal customizado en lugar de window.alert.
    alert(`¡Precio revertido con éxito! El nuevo precio de ${currentProduct.name} es ${currentProduct.unit} ${newPrice.toFixed(2)}.`);

  }, [currentProduct, selectedProductId, precioActual]);

  // Maneja el cambio de producto
  const handleProductChange = (e) => {
    setSelectedProductId(parseInt(e.target.value));
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-8 font-sans text-gray-100">
      <div className="max-w-7xl mx-auto">
        
        {/* Encabezado */}
        <header className="mb-8">
          {/* Título en rojo: text-red-500 */}
          <h1 className="text-3xl font-extrabold text-red-500 mb-2">Historial y Auditoría de Precios</h1>
          <p className="text-gray-400">Consulta los cambios históricos y revierte a precios anteriores con un clic.</p>
        </header>

        {/* Selector de Producto y Precio Actual */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-red-700 mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Selector */}
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

            {/* Precio Actual */}
            <div className="bg-red-800/20 p-4 rounded-lg border-l-4 border-red-500 flex flex-col justify-center">
                <p className="text-sm font-medium text-red-400 uppercase">Precio Actual Vigente</p>
                <div className="text-4xl font-extrabold text-white mt-1">
                    {currentProduct.unit} {precioActual.toFixed(2)}
                </div>
            </div>
        </div>


        {/* 2. Historial de Cambios de Precio */}
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
            Historial de Cambios para {currentProduct.name}
        </h2>
        
        <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-red-900/40">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Fecha de Cambio</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Precio Anterior ({currentProduct.unit})</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Nuevo Precio ({currentProduct.unit})</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Usuario</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider">Motivo del Cambio</th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-white uppercase tracking-wider">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {history.length > 0 ? (
                  history.map((h, index) => {
                    // El último cambio (índice 0) es el precio actual, no se puede revertir A sí mismo.
                    const isCurrentPrice = index === 0 && h.newPrice === precioActual;
                    
                    return (
                        <tr key={h.id} className={`${isCurrentPrice ? 'bg-gray-700/50' : 'hover:bg-gray-700/30'} transition duration-150`}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-300">{h.date}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-400">{h.oldPrice.toFixed(2)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-bold text-red-400">{h.newPrice.toFixed(2)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-300">{h.user}</div>
                            </td>
                            <td className="px-6 py-4 max-w-xs overflow-hidden text-ellipsis">
                                <div className="text-sm text-gray-400">{h.motive}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                {/* Solo se permite revertir si no es el precio actualmente vigente */}
                                {!isCurrentPrice ? (
                                    <button 
                                        onClick={() => handleRevertPrice(h)}
                                        className="text-white hover:bg-red-700 transition-colors bg-red-600 py-2 px-4 rounded-lg font-semibold shadow-md shadow-red-600/20"
                                    >
                                        Revertir a este Precio
                                    </button>
                                ) : (
                                    <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-600 text-gray-300">
                                        Precio Actual
                                    </span>
                                )}
                            </td>
                        </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                        No se encontró historial de precios para este producto.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}