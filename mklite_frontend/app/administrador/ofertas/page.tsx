"use client";

import React, { useState } from 'react';

// --- Datos de Simulación (Mock Data) ---
const INITIAL_RULES = [
  { id: 1, diasAntes: 7, porcentaje: 20, duracionOferta: 3, estado: 'Activa', aplicaA: 'Todas las Categorías' },
  { id: 2, diasAntes: 3, porcentaje: 50, duracionOferta: 1, estado: 'Activa', aplicaA: 'Lácteos y Bebidas' },
];

const MOCK_STATS = {
    productosAfectados: 125, // Simulación de productos próximos a vencer en el inventario
};

// --- Componente Principal ---
export default function ConfiguracionDescuentos() {
  
  // Estado para las reglas de descuento
  const [rules, setRules] = useState(INITIAL_RULES);
  
  // Estado para el formulario de nueva regla
  const [nuevaRegla, setNuevaRegla] = useState({
    diasAntes: 5,
    porcentaje: 30,
    duracionOferta: 2,
    aplicaA: 'Todas las Categorías',
  });
  
  // Estado para el mensaje de feedback
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Maneja los cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNuevaRegla(prev => ({ ...prev, [name]: name === 'aplicaA' ? value : parseInt(value) }));
  };

  // Maneja la creación de una nueva regla
  const handleCrearRegla = (e) => {
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
    
    // Simulación: Agregar la regla y limpiar el formulario
    setRules(prev => [...prev, newRule]);
    setFeedback({ type: 'success', message: '¡Nueva regla de descuento automático creada con éxito!' });
    setNuevaRegla({
        diasAntes: 5,
        porcentaje: 30,
        duracionOferta: 2,
        aplicaA: 'Todas las Categorías',
    });
  };

  // Maneja la eliminación de una regla (simulación)
  const handleEliminarRegla = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta regla? Esto desactivará los descuentos automáticos para esta condición.')) {
        setRules(prev => prev.filter(rule => rule.id !== id));
        setFeedback({ type: 'info', message: `Regla ID ${id} eliminada. Los descuentos existentes finalizarán pronto.` });
    }
  };

  // Componente para el mensaje de feedback
  const FeedbackMessage = ({ type, message }) => {
    if (!message) return null;
    let style = { bg: 'bg-gray-700/50', text: 'text-gray-300', border: 'border-gray-500' };
    if (type === 'error') style = { bg: 'bg-red-900/40', text: 'text-red-300', border: 'border-red-700' };
    if (type === 'success') style = { bg: 'bg-red-900/40', text: 'text-white', border: 'border-red-700' };
    if (type === 'info') style = { bg: 'bg-gray-700/50', text: 'text-white', border: 'border-gray-500' };


    return (
      <div className={`p-4 rounded-lg border ${style.bg} ${style.border} ${style.text} font-medium mb-6`}>
        {message}
      </div>
    );
  };


  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-8 font-sans text-gray-100">
      <div className="max-w-7xl mx-auto">
        
        {/* Encabezado */}
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-red-500 mb-2">Ofertas Automáticas por Vencimiento</h1>
          <p className="text-gray-400">Define las reglas para generar descuentos automáticos en productos próximos a vencer.</p>
        </header>

        <FeedbackMessage type={feedback.type} message={feedback.message} />

        {/* 1. Dashboard de Estado */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 col-span-2">
                <p className="text-sm font-medium text-gray-400">Productos con Descuento Activo Hoy</p>
                <div className="text-4xl font-extrabold text-red-400 mt-2">{MOCK_STATS.productosAfectados} Uds.</div>
                <div className="text-xs text-gray-500 mt-1">Estimación de unidades actualmente afectadas por las reglas de abajo.</div>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <p className="text-sm font-medium text-gray-400">Próxima Ejecución del Sistema</p>
                <div className="text-2xl font-extrabold text-white mt-2">Cada medianoche</div>
                <div className="text-xs text-gray-500 mt-1">El sistema verifica stock y aplica/retira descuentos.</div>
            </div>
        </div>

        {/* 2. Creación de Nueva Regla */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-red-700 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 5a1 1 0 00-2 0v.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V5zM15 7a1 1 0 00-2 0v.268a2 2 0 000 3.464V16a1 1 0 102 0v-5.268a2 2 0 000-3.464V7z" /></svg>
            Crear Nueva Regla de Descuento
          </h2>
          
          <form onSubmit={handleCrearRegla} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            
            {/* Días Antes de Vencer */}
            <div className="space-y-1">
              <label htmlFor="diasAntes" className="block text-sm font-medium text-gray-400">Vence en (Días)</label>
              <input
                type="number"
                name="diasAntes"
                min="1"
                required
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                value={nuevaRegla.diasAntes}
                onChange={handleChange}
              />
            </div>
            
            {/* Porcentaje de Descuento */}
            <div className="space-y-1">
              <label htmlFor="porcentaje" className="block text-sm font-medium text-gray-400">Descuento (%)</label>
              <input
                type="number"
                name="porcentaje"
                min="1"
                max="100"
                required
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                value={nuevaRegla.porcentaje}
                onChange={handleChange}
              />
            </div>

            {/* Duración de la Oferta */}
            <div className="space-y-1">
              <label htmlFor="duracionOferta" className="block text-sm font-medium text-gray-400">Duración Oferta (Días)</label>
              <input
                type="number"
                name="duracionOferta"
                min="1"
                required
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                value={nuevaRegla.duracionOferta}
                onChange={handleChange}
              />
            </div>
            
            {/* Botón de Creación */}
            <button 
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-lg shadow-md shadow-red-600/20 transition duration-300"
            >
              Crear Regla
            </button>
            
            {/* Aplicar a Categoría (Ocupa la fila de abajo en móvil/tablet) */}
            <div className="md:col-span-4 space-y-1">
              <label htmlFor="aplicaA" className="block text-sm font-medium text-gray-400">Aplicar la regla a</label>
              <select
                name="aplicaA"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2.5 text-white focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
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
          <p className="mt-4 text-sm text-gray-500">
            Ejemplo: Si la regla es (7 días, 20%, 3 días), el sistema aplicará un 20% de descuento a un producto que vence en 7 días, y la oferta estará activa por 3 días.
          </p>
        </div>

        {/* 3. Tabla de Reglas Activas */}
        <h2 className="text-xl font-semibold text-white mb-4 mt-6">Reglas de Descuento Automático Activas</h2>
        <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700/50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID Regla</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Vence Antes de (Días)</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Descuento (%)</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Duración Oferta (Días)</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Aplica a</th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Estado</th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {rules.length > 0 ? (
                  rules.map((rule) => (
                    <tr key={rule.id} className="hover:bg-gray-700/50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">#{rule.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{rule.diasAntes} días</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-lg font-extrabold text-red-400">{rule.porcentaje}%</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{rule.duracionOferta} días</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-400">{rule.aplicaA}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-900/30 text-white border border-red-700">
                          {rule.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                        No hay reglas de descuento automáticas activas.
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