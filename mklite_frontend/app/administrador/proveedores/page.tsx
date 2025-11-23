"use client";

import React, { useState } from 'react';

// --- Datos de Simulación (Mock Data) ---
const INITIAL_SUPPLIERS = [
  { id: 1, empresa: 'Distribuidora Los Andes', contacto: 'Carlos Mamani', telefono: '772-55501', email: 'ventas@losandes.bo', categoria: 'Bebidas', direccion: 'Av. Blanco Galindo Km 5' },
  { id: 2, empresa: 'Panificadora La Victoria', contacto: 'Ana Suárez', telefono: '689-12345', email: 'pedidos@lavictoria.com', categoria: 'Panadería', direccion: 'Calle España #432' },
  { id: 3, empresa: 'Granja Avícola El Sol', contacto: 'Roberto Gomez', telefono: '715-99887', email: 'rgomez@elsol.bo', categoria: 'Cárnicos', direccion: 'Carretera a Sacaba Km 3' },
  { id: 4, empresa: 'Lácteos del Valle', contacto: 'Maria René', telefono: '442-3311', email: 'contacto@lacteosvalle.bo', categoria: 'Lácteos', direccion: 'Av. Villazón #100' },
  { id: 5, empresa: 'Importadora Global', contacto: 'Juan Pérez', telefono: '707-65432', email: 'juan@globalimport.com', categoria: 'Limpieza', direccion: 'Zona Parque Industrial' },
];

const CATEGORIAS = ['Bebidas', 'Abarrotes', 'Panadería', 'Cárnicos', 'Lácteos', 'Limpieza', 'Higiene Personal', 'Otros'];

export default function GestionProveedores() {
  // --- Estados ---
  const [proveedores, setProveedores] = useState(INITIAL_SUPPLIERS);
  const [busqueda, setBusqueda] = useState('');
  
  // Estado para el Modal de Edición/Creación
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProveedor, setCurrentProveedor] = useState(null); // null = creando, objeto = editando

  // Estado para el Modal de Confirmación de Eliminación
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [proveedorToDelete, setProveedorToDelete] = useState(null);

  // --- Funciones de Lógica ---

  // Filtrado de proveedores
  const proveedoresFiltrados = proveedores.filter(p => 
    p.empresa.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.contacto.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Abrir modal para CREAR
  const handleOpenCreate = () => {
    setCurrentProveedor({ empresa: '', contacto: '', telefono: '', email: '', categoria: 'Abarrotes', direccion: '' });
    setIsModalOpen(true);
  };

  // Abrir modal para EDITAR
  const handleOpenEdit = (proveedor) => {
    setCurrentProveedor({ ...proveedor });
    setIsModalOpen(true);
  };

  // Guardar (Crear o Actualizar)
  const handleSave = (e) => {
    e.preventDefault();
    if (currentProveedor.id) {
      // Actualizar existente
      setProveedores(proveedores.map(p => p.id === currentProveedor.id ? currentProveedor : p));
    } else {
      // Crear nuevo
      const newId = Math.max(...proveedores.map(p => p.id), 0) + 1;
      setProveedores([...proveedores, { ...currentProveedor, id: newId }]);
    }
    setIsModalOpen(false);
  };

  // Eliminar
  const handleDeleteClick = (id) => {
    setProveedorToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    setProveedores(proveedores.filter(p => p.id !== proveedorToDelete));
    setIsDeleteModalOpen(false);
    setProveedorToDelete(null);
  };

  // --- Renderizado ---

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-8 font-sans text-gray-100">
      <div className="max-w-7xl mx-auto">
        
        {/* Encabezado */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-red-500 mb-2">Gestión de Proveedores</h1>
            <p className="text-gray-400">Administra la información de contacto y categorías de tus socios comerciales.</p>
          </div>
          <button 
            onClick={handleOpenCreate}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg shadow-red-600/20 transition duration-300 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Proveedor
          </button>
        </header>

        {/* Barra de Búsqueda y Filtros */}
        <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700 mb-6 flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Buscar por empresa, contacto o categoría..." 
            className="bg-transparent border-none focus:ring-0 text-gray-200 w-full placeholder-gray-500"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* Tabla de Proveedores */}
        <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700/50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Empresa</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Contacto Principal</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Información</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Categoría</th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {proveedoresFiltrados.length > 0 ? (
                  proveedoresFiltrados.map((proveedor) => (
                    <tr key={proveedor.id} className="hover:bg-gray-700/50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-600 flex items-center justify-center text-red-400 font-bold text-lg">
                            {proveedor.empresa.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{proveedor.empresa}</div>
                            <div className="text-xs text-gray-400">{proveedor.direccion}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-200">{proveedor.contacto}</div>
                        <div className="text-xs text-gray-500">Gerente de Ventas</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                            <div className="flex items-center text-sm text-gray-300">
                                <svg className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                {proveedor.telefono}
                            </div>
                            <div className="flex items-center text-sm text-gray-300">
                                <svg className="h-4 w-4 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                {proveedor.email}
                            </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-900/30 text-blue-300 border border-blue-800">
                          {proveedor.categoria}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                            onClick={() => handleOpenEdit(proveedor)}
                            className="text-indigo-400 hover:text-indigo-300 mr-4 transition-colors"
                        >
                            Editar
                        </button>
                        <button 
                            onClick={() => handleDeleteClick(proveedor.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                        >
                            Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                        No se encontraron proveedores que coincidan con tu búsqueda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-gray-700/30 border-t border-gray-700 flex items-center justify-between">
              <span className="text-sm text-gray-400">Mostrando {proveedoresFiltrados.length} proveedores</span>
              <div className="flex gap-2">
                  <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm text-gray-300 disabled:opacity-50">Anterior</button>
                  <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm text-gray-300 disabled:opacity-50">Siguiente</button>
              </div>
          </div>
        </div>

      </div>

      {/* --- MODAL DE CREACIÓN / EDICIÓN --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 w-full max-w-2xl transform transition-all">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">
                {currentProveedor.id ? 'Editar Proveedor' : 'Registrar Nuevo Proveedor'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombre Empresa */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-300">Nombre de la Empresa</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                    value={currentProveedor.empresa}
                    onChange={(e) => setCurrentProveedor({...currentProveedor, empresa: e.target.value})}
                    placeholder="Ej. Distribuidora Central"
                  />
                </div>
                
                {/* Categoría */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-300">Categoría</label>
                  <select 
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                    value={currentProveedor.categoria}
                    onChange={(e) => setCurrentProveedor({...currentProveedor, categoria: e.target.value})}
                  >
                    {CATEGORIAS.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                {/* Contacto */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-300">Nombre de Contacto</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                    value={currentProveedor.contacto}
                    onChange={(e) => setCurrentProveedor({...currentProveedor, contacto: e.target.value})}
                    placeholder="Ej. Juan Pérez"
                  />
                </div>

                {/* Teléfono */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-300">Teléfono / Celular</label>
                  <input 
                    required
                    type="text" 
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                    value={currentProveedor.telefono}
                    onChange={(e) => setCurrentProveedor({...currentProveedor, telefono: e.target.value})}
                    placeholder="Ej. 772-12345"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-gray-300">Correo Electrónico</label>
                  <input 
                    required
                    type="email" 
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                    value={currentProveedor.email}
                    onChange={(e) => setCurrentProveedor({...currentProveedor, email: e.target.value})}
                    placeholder="contacto@empresa.com"
                  />
                </div>

                {/* Dirección */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-medium text-gray-300">Dirección Física</label>
                  <input 
                    type="text" 
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition"
                    value={currentProveedor.direccion}
                    onChange={(e) => setCurrentProveedor({...currentProveedor, direccion: e.target.value})}
                    placeholder="Calle, Número, Zona"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
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
                  {currentProveedor.id ? 'Guardar Cambios' : 'Registrar Proveedor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL DE CONFIRMACIÓN DE ELIMINACIÓN --- */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
           <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 p-6 max-w-sm w-full text-center">
              <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">¿Eliminar Proveedor?</h3>
              <p className="text-gray-400 mb-6">Esta acción no se puede deshacer. Se perderá la información de contacto asociada.</p>
              
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
