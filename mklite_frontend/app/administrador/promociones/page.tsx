"use client";

import React, { useState, useMemo, useCallback } from 'react';

// --- Datos de Simulación (Mock Data) ---
const INITIAL_PROMOTIONS = [
  { 
    id: 1, 
    nombre: 'Mega Descuento Lácteo', 
    tipo: 'Porcentaje', 
    valor: 15, 
    unidad: '%',
    fechaInicio: '2025-11-20', 
    fechaFin: '2025-11-27', 
    productos: 'Lácteos seleccionados', 
    estado: 'Activa' 
  },
  { 
    id: 2, 
    nombre: '3x2 en Gaseosas', 
    tipo: 'Compra X, lleva Y', 
    valor: 3, 
    unidad: 'Unidades',
    fechaInicio: '2025-12-01', 
    fechaFin: '2025-12-31', 
    productos: 'Coca-Cola 2Lt, Fanta 2Lt', 
    estado: 'Programada' 
  },
  { 
    id: 3, 
    nombre: '20% Off en Panadería', 
    tipo: 'Monto Fijo', 
    valor: 20.00, 
    unidad: 'Bs.',
    fechaInicio: '2025-10-01', 
    fechaFin: '2025-10-31', 
    productos: 'Toda la sección de panadería', 
    estado: 'Expirada' 
  },
];

const PROMOTION_TYPES = [
    { value: 'Porcentaje', label: 'Descuento por Porcentaje (%)' },
    { value: 'Monto Fijo', label: 'Descuento por Monto Fijo (Bs.)' },
    { value: 'Compra X, lleva Y', label: 'Compra X, lleva Y Gratis' },
];

// --- Componente Principal ---
export default function GestionPromociones() {
  const [promociones, setPromociones] = useState(INITIAL_PROMOTIONS);
  const [busqueda, setBusqueda] = useState('');
  
  // Estado para el Modal de Edición/Creación
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPromocion, setCurrentPromocion] = useState(null); // null = creando, objeto = editando
  const [validationError, setValidationError] = useState('');

  // --- Funciones de Utilidad ---

  // Obtiene el color del estado de la promoción
  const getEstadoClass = useCallback((estado) => {
    switch (estado) {
      case 'Activa': return 'bg-green-900/30 text-green-300 border border-green-700';
      case 'Programada': return 'bg-blue-900/30 text-blue-300 border border-blue-700';
      case 'Expirada': return 'bg-gray-700/50 text-gray-400 border border-gray-600';
      default: return 'bg-gray-700/50 text-gray-400 border border-gray-600';
    }
  }, []);

  // Determina el estado de la promoción en base a las fechas actuales
  const determineEstado = useCallback((inicio, fin) => {
    const today = new Date();
    const startDate = new Date(inicio);
    const endDate = new Date(fin);

    if (endDate < today) return 'Expirada';
    if (startDate <= today && endDate >= today) return 'Activa';
    if (startDate > today) return 'Programada';
    return 'Expirada';
  }, []);

  // --- Lógica CRUD ---

  // Filtrado de promociones
  const promocionesFiltradas = useMemo(() => {
    return promociones.filter(p => 
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.productos.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.tipo.toLowerCase().includes(busqueda.toLowerCase())
    ).map(p => ({
        ...p,
        estado: determineEstado(p.fechaInicio, p.fechaFin) // Recalcula el estado en cada render
    }));
  }, [promociones, busqueda, determineEstado]);

  // Abrir modal para CREAR
  const handleOpenCreate = () => {
    setValidationError('');
    setCurrentPromocion({ 
      nombre: '', 
      tipo: 'Porcentaje', 
      valor: '', 
      unidad: '%',
      fechaInicio: new Date().toISOString().substring(0, 10), // Hoy
      fechaFin: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10), // + 7 días
      productos: '', 
    });
    setIsModalOpen(true);
  };

  // Abrir modal para EDITAR
  const handleOpenEdit = (promocion) => {
    setValidationError('');
    setCurrentPromocion({ ...promocion });
    setIsModalOpen(true);
  };

  // Guardar (Crear o Actualizar)
  const handleSave = (e) => {
    e.preventDefault();
    setValidationError('');

    // Validación de Fechas
    if (new Date(currentPromocion.fechaInicio) >= new Date(currentPromocion.fechaFin)) {
        setValidationError('La Fecha de Finalización debe ser posterior a la Fecha de Inicio.');
        return;
    }

    // Validación de Duplicidad (Por nombre, ignorando el actual si estamos editando)
    const isDuplicate = promociones.some(p => 
        p.nombre.toLowerCase() === currentPromocion.nombre.toLowerCase() && 
        p.id !== currentPromocion.id
    );
    if (isDuplicate) {
        setValidationError('Ya existe una promoción con este nombre. Por favor, usa uno diferente.');
        return;
    }
    
    // Lógica de guardar
    if (currentPromocion.id) {
      // Actualizar existente
      setPromociones(promociones.map(p => p.id === currentPromocion.id ? currentPromocion : p));
    } else {
      // Crear nuevo
      const newId = Math.max(...promociones.map(p => p.id), 0) + 1;
      setPromociones([...promociones, { ...currentPromocion, id: newId, estado: determineEstado(currentPromocion.fechaInicio, currentPromocion.fechaFin) }]);
    }
    
    setIsModalOpen(false);
  };

  // Eliminar (Simulación, sin modal de confirmación para brevedad)
  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta promoción?')) {
        setPromociones(promociones.filter(p => p.id !== id));
    }
  };

  // Manejador genérico para el cambio de campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentPromocion(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-8 font-sans text-gray-100">
      <div className="max-w-7xl mx-auto">
        
        {/* Encabezado */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-red-500 mb-2">Gestión de Promociones</h1>
            <p className="text-gray-400">Crea, administra y controla todos los descuentos y ofertas para tus clientes.</p>
          </div>
          <button 
            onClick={handleOpenCreate}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg shadow-red-600/20 transition duration-300 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva Promoción
          </button>
        </header>

        {/* Barra de Búsqueda */}
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700 mb-6 flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Buscar por nombre, producto o tipo de promoción..." 
            className="bg-transparent border-none focus:ring-0 text-gray-200 w-full placeholder-gray-500"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* Tabla de Promociones */}
        <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700/50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nombre</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tipo y Valor</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Productos Aplicables</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Vigencia</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Estado</th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {promocionesFiltradas.length > 0 ? (
                  promocionesFiltradas.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-700/50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{p.nombre}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{p.tipo}</div>
                        <div className="text-xs text-red-400 font-semibold">{p.valor} {p.unidad}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-400 max-w-xs truncate">{p.productos}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">Inicio: {p.fechaInicio}</div>
                        <div className="text-xs text-gray-500">Fin: {p.fechaFin}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoClass(p.estado)}`}>
                          {p.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                            onClick={() => handleOpenEdit(p)}
                            className="text-indigo-400 hover:text-indigo-300 mr-4 transition-colors disabled:opacity-50"
                            disabled={p.estado === 'Expirada'} // No permitir editar expiradas (opcional)
                        >
                            Editar
                        </button>
                        <button 
                            onClick={() => handleDelete(p.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                        >
                            Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                        No se encontraron promociones que coincidan con tu búsqueda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- MODAL DE CREACIÓN / EDICIÓN --- */}
      {isModalOpen && currentPromocion && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 w-full max-w-3xl transform transition-all">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">
                {currentPromocion.id ? 'Editar Promoción' : 'Crear Nueva Promoción'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-6">
              
              {/* Sección de Datos Básicos */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1 md:col-span-3">
                  <label className="text-sm font-medium text-gray-300">Nombre de la Promoción</label>
                  <input 
                    required
                    type="text" 
                    name="nombre"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 outline-none"
                    value={currentPromocion.nombre}
                    onChange={handleChange}
                    placeholder="Ej. Black Friday Bebidas"
                  />
                </div>

                {/* Tipo de Descuento */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-300">Tipo de Descuento</label>
                  <select 
                    required
                    name="tipo"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 outline-none"
                    value={currentPromocion.tipo}
                    onChange={handleChange}
                  >
                    {PROMOTION_TYPES.map(type => <option key={type.value} value={type.value}>{type.label}</option>)}
                  </select>
                </div>
                
                {/* Valor del Descuento */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-300">Valor</label>
                  <input 
                    required
                    type="number" 
                    step="0.01"
                    min="0"
                    name="valor"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 outline-none"
                    value={currentPromocion.valor}
                    onChange={handleChange}
                    placeholder="Ej. 15 ó 5.00"
                  />
                </div>
                
                {/* Unidad (Automático según tipo, pero editable) */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-300">Unidad</label>
                  <input 
                    required
                    type="text" 
                    name="unidad"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 outline-none"
                    value={currentPromocion.tipo === 'Porcentaje' ? '%' : (currentPromocion.tipo === 'Monto Fijo' ? 'Bs.' : 'Unidades')}
                    onChange={handleChange}
                    readOnly={currentPromocion.tipo !== 'Compra X, lleva Y'} // Permite editar si es tipo X,Y
                  />
                </div>
              </div>
              
              {/* Sección de Vigencia (Fechas) */}
              <div className="border border-gray-700 p-4 rounded-lg space-y-4">
                <h4 className="text-lg font-semibold text-red-400">Vigencia y Aplicación</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-300">Fecha de Inicio</label>
                        <input 
                            required
                            type="date" 
                            name="fechaInicio"
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 outline-none"
                            value={currentPromocion.fechaInicio}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium text-gray-300">Fecha de Finalización</label>
                        <input 
                            required
                            type="date" 
                            name="fechaFin"
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 outline-none"
                            value={currentPromocion.fechaFin}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-300">Productos Aplicables (Detalle)</label>
                    <textarea 
                        required
                        name="productos"
                        rows="2"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 outline-none"
                        value={currentPromocion.productos}
                        onChange={handleChange}
                        placeholder="Ej. Categoría Lácteos, Código SKU 123, 456, 789"
                    />
                    <p className="text-xs text-gray-500">Especifique claramente a qué productos se aplica la promoción.</p>
                </div>
              </div>

              {/* Mensaje de Error */}
              {validationError && (
                <div className="p-3 bg-red-900/40 border border-red-700 rounded-lg text-red-300 text-sm">
                  {validationError}
                </div>
              )}
              
              {/* Botones de Acción */}
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg transition"
                >
                  {currentPromocion.id ? 'Guardar Cambios' : 'Crear Promoción'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}