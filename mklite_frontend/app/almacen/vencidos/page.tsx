"use client";

import React, { useState, useMemo, useCallback } from 'react';

// --- Datos de Simulación (Mock Data) ---
const INITIAL_INVENTORY = [
  { id: 101, nombre: 'Leche Fresca 1Lt', lote: 'LT-A456', stock: 50, fechaVencimiento: '2025-11-25', estado: 'Almacén' },
  { id: 102, nombre: 'Yogur de Fresa 500ml', lote: 'LT-Y112', stock: 15, fechaVencimiento: '2025-11-20', estado: 'Almacén' }, // Vencido (hoy es 22)
  { id: 103, nombre: 'Jugo de Naranja 2Lt', lote: 'LT-J987', stock: 35, fechaVencimiento: '2025-11-28', estado: 'Almacén' }, // Próximo (6 días)
  { id: 104, nombre: 'Pan de Molde Blanco', lote: 'LT-P333', stock: 80, fechaVencimiento: '2025-12-15', estado: 'Almacén' },
  { id: 105, nombre: 'Queso Cheddar 100gr', lote: 'LT-Q221', stock: 5, fechaVencimiento: '2025-11-23', estado: 'Almacén' }, // Próximo (1 día)
];

const INITIAL_TRANSFERS = [
    { id: 1, producto: 'Yogur de Fresa 500ml', lote: 'LT-Y112', cantidad: 15, fechaTraslado: '2025-11-22 00:00:01', motivo: 'Vencido' },
];

// Función utilitaria para calcular la diferencia de días
const getDaysUntilExpiration = (expirationDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expire = new Date(expirationDate);
    expire.setHours(0, 0, 0, 0);

    const diffTime = expire.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

// --- Componente Principal ---
export default function GestionVencimientos() {
  const [inventario] = useState(INITIAL_INVENTORY);
  const [traslados, setTraslados] = useState(INITIAL_TRANSFERS);

  // --- Lógica de Filtro y Clasificación ---
  const { productosEnAlerta, productosVencidos } = useMemo(() => {
    let enAlerta = [];
    let vencidos = [];

    inventario.forEach(p => {
      if (p.estado === 'Almacén') {
        const days = getDaysUntilExpiration(p.fechaVencimiento);
        if (days <= 0) {
          vencidos.push({ ...p, dias: days });
        } else if (days <= 7) {
          enAlerta.push({ ...p, dias: days });
        }
      }
    });

    return { productosEnAlerta: enAlerta, productosVencidos: vencidos };
  }, [inventario]);

  // --- Simulación de Traslado Automático ---
  const handleSimulateTransfer = useCallback((producto) => {
    // 1. Marcar el producto como trasladado (Simulación: En una app real, se actualizaría el estado en la base de datos)
    // 2. Moverlo al listado de traslados
    
    // Filtramos productos que ya han sido trasladados para evitar duplicados en la simulación de log
    if (traslados.some(t => t.lote === producto.lote)) {
        alert(`El producto del lote ${producto.lote} ya fue trasladado.`);
        return;
    }

    const motivo = producto.dias <= 0 ? 'Vencido' : 'Próximo a Vencer';

    setTraslados(prev => [
        ...prev,
        {
            id: prev.length + 1,
            producto: producto.nombre,
            lote: producto.lote,
            cantidad: producto.stock,
            fechaTraslado: new Date().toISOString().replace('T', ' ').substring(0, 19),
            motivo: motivo,
        }
    ]);
    
    alert(`Producto ${producto.nombre} (Lote: ${producto.lote}) trasladado a Stock Vencido. Notificaciones enviadas.`);

  }, [traslados]);


  // --- Renderizado de Componentes de UI ---

  // Componente para los KPIs
  const StatCard = ({ title, value, colorClass, icon }) => (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
        <div className="flex items-center gap-4">
            <div className={`p-3 rounded-full ${colorClass.bg} ${colorClass.text}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-400">{title}</p>
                <div className="text-3xl font-extrabold text-white mt-1">{value}</div>
            </div>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-8 font-sans text-gray-100">
      <div className="max-w-7xl mx-auto">
        
        {/* Encabezado */}
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-red-500 mb-2">Alerta de Caducidad y Gestión de Stock</h1>
          <p className="text-gray-400">Monitoriza automáticamente los productos con riesgo de vencimiento y gestiona su traslado.</p>
        </header>

        {/* 1. Dashboard de Indicadores de Riesgo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard 
                title="Total de Alertas Próximas" 
                value={productosEnAlerta.length}
                colorClass={{ bg: 'bg-yellow-900/30', text: 'text-yellow-400' }}
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.427 2.65-1.427 3.414 0l.75 1.401a.5.5 0 00.9.18l.89-1.334a1.5 1.5 0 011.666-.356l1.328.797a1.5 1.5 0 01.356 1.666l-1.334.89a.5.5 0 00-.18.9l1.401.75c1.427.765 1.427 2.65 0 3.414l-1.401.75a.5.5 0 00-.18.9l1.334.89a1.5 1.5 0 01-.356 1.666l-.797 1.328a1.5 1.5 0 01-1.666.356l-.89-1.334a.5.5 0 00-.9-.18l-.75 1.401c-.765 1.427-2.65 1.427-3.414 0l-.75-1.401a.5.5 0 00-.9-.18l-1.334.89a1.5 1.5 0 01-1.666-.356l-.797-1.328a1.5 1.5 0 01.356-1.666l.89-.89a.5.5 0 00.18-.9l-1.401-.75c-1.427-.765-1.427-2.65 0-3.414l1.401-.75a.5.5 0 00.18-.9l-.89-1.334a1.5 1.5 0 01.356-1.666l1.328-.797a1.5 1.5 0 011.666.356l.89 1.334a.5.5 0 00.9.18l.75-1.401zM10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" clipRule="evenodd" /></svg>}
            />
            <StatCard 
                title="Productos Vencidos (Stock)" 
                value={productosVencidos.length}
                colorClass={{ bg: 'bg-red-900/30', text: 'text-red-400' }}
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>}
            />
            <StatCard 
                title="Traslados Hoy (Unidades)" 
                value={traslados.filter(t => t.motivo === 'Vencido').reduce((sum, t) => sum + t.cantidad, 0)}
                colorClass={{ bg: 'bg-blue-900/30', text: 'text-blue-400' }}
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 6a1 1 0 011-1h10a1 1 0 011 1v10a2 2 0 002 2H2a2 2 0 002-2V6zm3 10a1 1 0 100 2h6a1 1 0 100-2H7z" /></svg>}
            />
        </div>

        {/* 2. Listado de Productos Próximos a Vencer (Alerta) */}
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.427 2.65-1.427 3.414 0l.75 1.401a.5.5 0 00.9.18l.89-1.334a1.5 1.5 0 011.666-.356l1.328.797a1.5 1.5 0 01.356 1.666l-1.334.89a.5.5 0 00-.18.9l1.401.75c1.427.765 1.427 2.65 0 3.414l-1.401.75a.5.5 0 00-.18.9l1.334.89a1.5 1.5 0 01-.356 1.666l-.797 1.328a1.5 1.5 0 01-1.666.356l-.89-1.334a.5.5 0 00-.9-.18l-.75 1.401c-.765 1.427-2.65 1.427-3.414 0l-.75-1.401a.5.5 0 00-.9-.18l-1.334.89a1.5 1.5 0 01-1.666-.356l-.797-1.328a1.5 1.5 0 01.356-1.666l.89-.89a.5.5 0 00.18-.9l-1.401-.75c-1.427-.765-1.427-2.65 0-3.414l1.401-.75a.5.5 0 00.18-.9l-.89-1.334a1.5 1.5 0 01.356-1.666l1.328-.797a1.5 1.5 0 011.666.356l.89 1.334a.5.5 0 00.9.18l.75-1.401zM10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" clipRule="evenodd" /></svg>
            Productos Próximos a Vencer (≤ 7 días)
        </h2>
        <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700/50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Producto</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Lote</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Stock</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Vence el</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Días Restantes</th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {productosEnAlerta.length > 0 ? (
                  productosEnAlerta.map((p) => (
                    <tr key={p.id} className="bg-yellow-900/10 hover:bg-yellow-900/20 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{p.nombre}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{p.lote}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-yellow-300 font-bold">{p.stock} Uds.</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{p.fechaVencimiento}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-700/50 text-yellow-300">
                          {p.dias} día{p.dias !== 1 ? 's' : ''}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                            onClick={() => handleSimulateTransfer(p)}
                            className="text-red-400 hover:text-red-300 transition-colors bg-red-900/30 py-1 px-3 rounded-lg border border-red-700"
                        >
                            Trasladar Ahora
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                        No hay productos con menos de 7 días para vencer.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Registro de Traslados (Lo que el sistema hace automáticamente) */}
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 001-1h6a1 1 0 001 1 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 2a1 1 0 000 2h.01a1 1 0 000-2H7zm3 0a1 1 0 000 2h.01a1 1 0 000-2H10zm3 0a1 1 0 000 2h.01a1 1 0 000-2H13zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H10zm3 0a1 1 0 100 2h.01a1 1 0 100-2H13z" clipRule="evenodd" /></svg>
            Registro de Traslados Automáticos
        </h2>
        <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700/50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Producto Trasladado</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Lote</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Cantidad</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Motivo</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Fecha de Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {traslados.length > 0 ? (
                  traslados.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-700/50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{t.producto}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{t.lote}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-blue-300 font-bold">{t.cantidad} Uds.</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${t.motivo === 'Vencido' ? 'bg-red-900/30 text-red-300' : 'bg-yellow-900/30 text-yellow-300'}`}>
                          {t.motivo}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-400">{t.fechaTraslado}</div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                        El sistema no ha realizado traslados automáticos hoy.
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