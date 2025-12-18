"use client";

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

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
const INITIAL_LOGS = [
  { id: 1, pedidoId: 'P-99001', horaAnulacion: '2025-11-22 18:05:12', itemsRepuestos: '3x Coca-Cola 2Lt, 1x Pan Integral', minutosEspera: 61 },
  { id: 2, pedidoId: 'P-99004', horaAnulacion: '2025-11-22 19:34:55', itemsRepuestos: '2x Leche Entera, 5x Huevos', minutosEspera: 65 },
  { id: 3, pedidoId: 'P-99011', horaAnulacion: '2025-11-22 21:01:03', itemsRepuestos: '1x Shampoo, 1x Acondicionador', minutosEspera: 60 },
];

// --- COMPONENTE PRINCIPAL ---
export default function AutoAnulacionStock() {
  const router = useRouter();
  const activePath = usePathname();

  // --- Funciones del Menú ---
  const goTo = (path: string) => {
    router.push(path);
  };
  
  // --- Estados de Lógica de Pedidos ---
  const [tiempoLimite, setTiempoLimite] = useState(60); 
  const [logs, setLogs] = useState(INITIAL_LOGS); 
  const [totalAnulacionesHoy, setTotalAnulacionesHoy] = useState(logs.length);
  const [ultimaEjecucion, setUltimaEjecucion] = useState('2025-11-22 22:00:00'); 
  const [proximaEjecucion, setProximaEjecucion] = useState('2025-11-22 23:00:00'); 

  // --- Lógica ---
  const handleGuardarConfiguracion = () => {
    alert(`Configuración guardada. Tiempo límite: ${tiempoLimite} minutos.`);
  };

  return (
    // CONTENEDOR PRINCIPAL: Flex para menú y contenido
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

        {/* --- CONTENIDO DE LA PANTALLA --- */}
        <div className="flex-1 bg-gray-900 p-4 sm:p-8 font-sans text-gray-100 overflow-y-auto h-screen">
          <div className="max-w-7xl mx-auto">
            
            <header className="mb-8">
              <h1 className="text-3xl font-extrabold text-red-500 mb-2">Control Automático de Pedidos</h1>
              <p className="text-gray-400">Anulación automática de pedidos no recogidos y reposición de inventario.</p>
            </header>

            {/* 1. Panel de Configuración */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.3-.484-2.578.74-1.846 2.052a1.532 1.532 0 01-.582 2.286c-1.56.38-1.56 2.6 0 2.98a1.532 1.532 0 01.582 2.286c-.732 1.312.553 2.536 1.846 2.052a1.532 1.532 0 012.286.948c.38 1.56 2.6 1.56 2.98 0a1.532 1.532 0 012.286-.948c1.3.484 2.578-.74 1.846-2.052a1.532 1.532 0 01.582-2.286c1.56-.38 1.56-2.6 0-2.98a1.532 1.532 0 01-.582-2.286c.732-1.312-.553-2.536-1.846-2.052a1.532 1.532 0 01-2.286-.948zM10 8.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
                </svg>
                Regla de Anulación
              </h2>
              
              <div className="flex flex-col sm:flex-row items-end gap-4">
                <div className="flex-grow w-full">
                  <label htmlFor="tiempo" className="block text-sm font-medium text-gray-400">Tiempo límite de espera:</label>
                  <div className="mt-1 flex rounded-lg shadow-sm">
                    <input
                      type="number"
                      id="tiempo"
                      name="tiempo"
                      min="10"
                      max="180"
                      required
                      className="flex-1 block w-full bg-gray-700 border border-gray-600 rounded-l-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                      value={tiempoLimite}
                      onChange={(e) => setTiempoLimite(parseInt(e.target.value))}
                    />
                    <span className="inline-flex items-center px-3 rounded-r-lg border border-l-0 border-gray-600 bg-gray-700 text-gray-400 text-sm">Minutos</span>
                  </div>
                </div>
                
                <button 
                  onClick={handleGuardarConfiguracion}
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md transition duration-300"
                >
                  Guardar Configuración
                </button>
              </div>
              <p className="mt-3 text-sm text-gray-500">
                El sistema anulará los pedidos que superen los {tiempoLimite} minutos sin ser recogidos.
              </p>
            </div>

            {/* 2. Dashboard */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex flex-col justify-between shadow-lg">
                    <p className="text-sm font-medium text-gray-400">Anulaciones Hoy</p>
                    <div className="text-4xl font-extrabold text-red-400 mt-2">{totalAnulacionesHoy}</div>
                </div>

                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex flex-col justify-between shadow-lg">
                    <p className="text-sm font-medium text-gray-400">Última Verificación</p>
                    <div className="text-2xl font-extrabold text-white mt-2">{new Date(ultimaEjecucion).toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'})}</div>
                    <div className="text-xs text-gray-500 mt-1">{new Date(ultimaEjecucion).toLocaleDateString('es-ES')}</div>
                </div>

                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 flex flex-col justify-between shadow-lg">
                    <p className="text-sm font-medium text-gray-400">Próxima Ejecución</p>
                    <div className="text-2xl font-extrabold text-blue-400 mt-2">{new Date(proximaEjecucion).toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'})}</div>
                    <div className="text-xs text-gray-500 mt-1">Automático cada hora.</div>
                </div>
            </div>

            {/* 3. Log */}
            <h2 className="text-xl font-semibold text-white mb-4 mt-6">Historial de Eventos</h2>
            <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">ID Pedido</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Espera</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Hora Anulación</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Productos Repuestos</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {logs.length > 0 ? (
                      logs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-700/50 transition duration-150">
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-red-400">{log.pedidoId}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-900/30 text-red-300 border border-red-800">
                              {log.minutosEspera} Min.
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-300">{log.horaAnulacion}</td>
                          <td className="px-6 py-4 text-gray-400 truncate max-w-xs">{log.itemsRepuestos}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                            Sin registros recientes.
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