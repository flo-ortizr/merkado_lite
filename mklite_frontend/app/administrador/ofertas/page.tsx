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
const INITIAL_RULES = [
  { id: 1, diasAntes: 7, porcentaje: 20, duracionOferta: 3, estado: 'Activa', aplicaA: 'Todas las Categorías' },
  { id: 2, diasAntes: 3, porcentaje: 50, duracionOferta: 1, estado: 'Activa', aplicaA: 'Lácteos y Bebidas' },
];

const MOCK_STATS = {
    productosAfectados: 125, 
};

// --- COMPONENTE PRINCIPAL ---
export default function ConfiguracionDescuentos() {
  const router = useRouter();
  const activePath = usePathname();

  // --- Funciones del Menú ---
  const goTo = (path: string) => {
    router.push(path);
  };
  
  // --- Estados de Lógica de Ofertas ---
  const [rules, setRules] = useState(INITIAL_RULES);
  
  const [nuevaRegla, setNuevaRegla] = useState({
    diasAntes: 5,
    porcentaje: 30,
    duracionOferta: 2,
    aplicaA: 'Todas las Categorías',
  });
  
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Manejadores
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNuevaRegla(prev => ({ ...prev, [name]: name === 'aplicaA' ? value : parseInt(value) }));
  };

  const handleCrearRegla = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (nuevaRegla.porcentaje <= 0 || nuevaRegla.porcentaje > 100) {
        setFeedback({ type: 'error', message: 'El porcentaje debe ser entre 1 y 100.' });
        return;
    }
    
    const newRule = {
      ...nuevaRegla,
      id: rules.length + 1,
      estado: 'Activa',
    };
    
    setRules(prev => [...prev, newRule]);
    setFeedback({ type: 'success', message: '¡Nueva regla de descuento automático creada con éxito!' });
    setNuevaRegla({
        diasAntes: 5,
        porcentaje: 30,
        duracionOferta: 2,
        aplicaA: 'Todas las Categorías',
    });
  };

  const handleEliminarRegla = (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta regla?')) {
        setRules(prev => prev.filter(rule => rule.id !== id));
        setFeedback({ type: 'info', message: `Regla ID ${id} eliminada.` });
    }
  };

  const FeedbackMessage = ({ type, message }: { type: string, message: string }) => {
    if (!message) return null;
    let style = 'bg-gray-700/50 text-gray-300 border-gray-500';
    if (type === 'error') style = 'bg-red-900/40 text-red-300 border-red-700';
    if (type === 'success') style = 'bg-green-900/30 text-green-300 border-green-700'; // Corregí el color a verde para éxito
    if (type === 'info') style = 'bg-blue-900/30 text-blue-300 border-blue-700';

    return (
      <div className={`p-4 rounded-lg border ${style} font-medium mb-6`}>
        {message}
      </div>
    );
  };


  return (
    // CONTENEDOR PRINCIPAL: Flex para menú lateral y contenido
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

        {/* --- CONTENIDO PRINCIPAL (Derecha) --- */}
        <div className="flex-1 bg-gray-900 p-4 sm:p-8 font-sans text-gray-100 overflow-y-auto h-screen">
          <div className="max-w-7xl mx-auto">
            
            {/* Encabezado */}
            <header className="mb-8">
              <h1 className="text-3xl font-extrabold text-red-500 mb-2">Ofertas Automáticas por Vencimiento</h1>
              <p className="text-gray-400">Define las reglas para generar descuentos automáticos en productos próximos a vencer.</p>
            </header>

            <FeedbackMessage type={feedback.type} message={feedback.message} />

            {/* 1. Dashboard de Estado */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 col-span-2 shadow-lg">
                    <p className="text-sm font-medium text-gray-400">Productos con Descuento Activo Hoy</p>
                    <div className="text-4xl font-extrabold text-red-400 mt-2">{MOCK_STATS.productosAfectados} Uds.</div>
                    <div className="text-xs text-gray-500 mt-1">Estimación de unidades afectadas.</div>
                </div>
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
                    <p className="text-sm font-medium text-gray-400">Próxima Ejecución</p>
                    <div className="text-2xl font-extrabold text-white mt-2">Cada medianoche</div>
                    <div className="text-xs text-gray-500 mt-1">Verificación de stock automática.</div>
                </div>
            </div>

            {/* 2. Creación de Nueva Regla */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-red-700 mb-8">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 5a1 1 0 00-2 0v.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V5zM15 7a1 1 0 00-2 0v.268a2 2 0 000 3.464V16a1 1 0 102 0v-5.268a2 2 0 000-3.464V7z" />
                </svg>
                Crear Nueva Regla de Descuento
              </h2>
              
              <form onSubmit={handleCrearRegla} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="space-y-1">
                  <label htmlFor="diasAntes" className="block text-sm font-medium text-gray-400">Vence en (Días)</label>
                  <input
                    type="number"
                    name="diasAntes"
                    min="1"
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-red-500 outline-none transition"
                    value={nuevaRegla.diasAntes}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="porcentaje" className="block text-sm font-medium text-gray-400">Descuento (%)</label>
                  <input
                    type="number"
                    name="porcentaje"
                    min="1"
                    max="100"
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-red-500 outline-none transition"
                    value={nuevaRegla.porcentaje}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="duracionOferta" className="block text-sm font-medium text-gray-400">Duración Oferta (Días)</label>
                  <input
                    type="number"
                    name="duracionOferta"
                    min="1"
                    required
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-red-500 outline-none transition"
                    value={nuevaRegla.duracionOferta}
                    onChange={handleChange}
                  />
                </div>
                <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg shadow-md transition duration-300">
                  Crear Regla
                </button>
                <div className="md:col-span-4 space-y-1">
                  <label htmlFor="aplicaA" className="block text-sm font-medium text-gray-400">Aplicar la regla a</label>
                  <select
                    name="aplicaA"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2.5 text-white focus:ring-2 focus:ring-red-500 outline-none transition"
                    value={nuevaRegla.aplicaA}
                    onChange={handleChange}
                  >
                      <option>Todas las Categorías</option>
                      <option>Lácteos y Bebidas</option>
                      <option>Carnes y Embutidos</option>
                      <option>Panadería</option>
                  </select>
                </div>
              </form>
            </div>

            {/* 3. Tabla de Reglas */}
            <h2 className="text-xl font-semibold text-white mb-4 mt-6">Reglas Activas</h2>
            <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-700/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">ID</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Vence en (Días)</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Desc. (%)</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Duración</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase">Aplica a</th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase">Estado</th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {rules.length > 0 ? (
                      rules.map((rule) => (
                        <tr key={rule.id} className="hover:bg-gray-700/50 transition duration-150">
                          <td className="px-6 py-4 text-sm font-medium text-white">#{rule.id}</td>
                          <td className="px-6 py-4 text-sm text-gray-300">{rule.diasAntes} días</td>
                          <td className="px-6 py-4 text-lg font-extrabold text-red-400">{rule.porcentaje}%</td>
                          <td className="px-6 py-4 text-sm text-gray-300">{rule.duracionOferta} días</td>
                          <td className="px-6 py-4 text-sm text-gray-400">{rule.aplicaA}</td>
                          <td className="px-6 py-4 text-right">
                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-900/30 text-white border border-red-700">
                              {rule.estado}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button 
                                onClick={() => handleEliminarRegla(rule.id)}
                                className="text-red-400 hover:text-red-300 transition-colors bg-red-900/30 py-1 px-3 rounded-lg border border-red-700"
                            >
                                Eliminar
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                            No hay reglas activas.
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