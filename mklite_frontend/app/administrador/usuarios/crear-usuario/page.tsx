"use client";

import React, { useState, useMemo } from 'react';

// =================================================================
// 1. CONSTANTES Y DATOS MOCKEADOS
// =================================================================

// Lista de todos los permisos posibles
const ALL_PERMISSIONS = [
    { id: 'gestion_usuarios', name: 'Gestionar Usuarios y Roles' },
    { id: 'ver_reportes', name: 'Ver Todos los Reportes (Ventas, Stock, Personal)' },
    { id: 'gestion_stock', name: 'Gestionar Stock, Lotes y Mermas' },
    { id: 'gestion_ordenes', name: 'Gestionar Órdenes de Compra a Proveedores' },
    { id: 'registro_ventas', name: 'Registrar Ventas Físicas (Caja)' },
    { id: 'ver_inventario', name: 'Ver Inventario General' },
    { id: 'gestion_entregas', name: 'Gestionar Estado de Entregas Asignadas' },
    { id: 'gestion_consultas', name: 'Gestionar Consultas e Incidencias (Chat)' },
    // Añadido uno extra para asegurar la uniformidad en las 3 columnas
    { id: 'ver_finanzas', name: 'Ver Reportes Financieros' }, 
];

// Definición de Roles y sus permisos por defecto
const ROLES_DATA = [
    { id: 'ADMIN', name: 'Administrador', defaultPermissions: ALL_PERMISSIONS.map(p => p.id) },
    { id: 'VENTAS', name: 'Vendedor (Ventas Físicas)', defaultPermissions: ['registro_ventas', 'ver_inventario', 'gestion_consultas'] },
    { id: 'ALMACEN', name: 'Encargado de Almacén', defaultPermissions: ['gestion_stock', 'gestion_ordenes', 'ver_inventario'] },
    { id: 'REPARTIDOR', name: 'Repartidor', defaultPermissions: ['gestion_entregas'] },
];

// Opciones de Estado del usuario
const STATUS_OPTIONS = ['Activo', 'Inactivo', 'Suspendido'];

// =================================================================
// 2. COMPONENTE PRINCIPAL
// =================================================================

const CrearUsuarioForm = () => {
    // Estado inicial del formulario
    const [formData, setFormData] = useState({
        nombreCompleto: 'Juan Pérez', // Valores iniciales para la demostración
        email: 'ejemplo@empresa.cl',
        rolAsignado: ROLES_DATA[1].id, // Vendedor por defecto
        estado: STATUS_OPTIONS[0], 
        permisosEspecificos: ROLES_DATA[1].defaultPermissions,
        isSubmitting: false,
    });
    
    // Almacena un mensaje para mostrar en un modal o notificación
    const [message, setMessage] = useState(null);

    // Mapeo para obtener el nombre del Rol y sus permisos por defecto
    const roleMap = useMemo(() => 
        ROLES_DATA.reduce((map, role) => ({ ...map, [role.id]: role }), {}),
        []
    );

    // --- Handlers de Formulario ---

    // Maneja los cambios en inputs y selectores (Rol, Estado, Nombre, Email)
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Si el campo cambiado es el Rol, actualiza automáticamente los permisos
        if (name === 'rolAsignado') {
            const newDefaultPermissions = roleMap[value]?.defaultPermissions || [];
            setFormData(prev => ({ 
                ...prev, 
                [name]: value,
                // Asigna permisos por defecto del nuevo rol
                permisosEspecificos: newDefaultPermissions 
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // Maneja los cambios en los checkboxes de Permisos Específicos
    const handlePermissionChange = (permissionId) => {
        setFormData(prev => {
            const currentPerms = prev.permisosEspecificos;
            const newPerms = currentPerms.includes(permissionId)
                ? currentPerms.filter(id => id !== permissionId) // Deseleccionar
                : [...currentPerms, permissionId]; // Seleccionar
            
            return { ...prev, permisosEspecificos: newPerms };
        });
    };

    // Simula el envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        setFormData(prev => ({ ...prev, isSubmitting: true }));
        
        // Simulación de una llamada API con retraso
        setTimeout(() => {
            setFormData(prev => ({ ...prev, isSubmitting: false }));
            setMessage({
                type: 'success',
                text: `¡Usuario ${formData.nombreCompleto} creado con éxito!`,
            });
        }, 1500);
    };

    // Simula la cancelación
    const handleCancel = () => {
        setMessage({
            type: 'info',
            text: 'Operación cancelada. Volviendo al listado de usuarios (Simulación).',
        });
    };

    // Componente Input reutilizable
    const InputField = ({ label, name, value, placeholder, type = 'text' }) => (
        <div className="flex flex-col">
            <label htmlFor={name} className="text-sm font-semibold text-gray-400 mb-1">{label}</label>
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={handleInputChange}
                placeholder={placeholder}
                className="bg-gray-700 border border-gray-600 text-gray-200 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-3 transition duration-200 shadow-inner placeholder:text-gray-500"
                required
            />
        </div>
    );
    
    // Componente Select reutilizable
    const SelectField = ({ label, name, value, options }) => (
        <div className="flex flex-col">
            <label htmlFor={name} className="text-sm font-semibold text-gray-400 mb-1">{label}</label>
            <select
                id={name}
                name={name}
                value={value}
                onChange={handleInputChange}
                className="bg-gray-700 border border-gray-600 text-gray-200 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-3 appearance-none transition duration-200 shadow-inner"
            >
                {options.map(option => (
                    <option key={option.id || option} value={option.id || option}>
                        {option.name || option}
                    </option>
                ))}
            </select>
        </div>
    );

    // --- Renderizado ---

    return (
        // Contenedor principal para centrar el formulario en la pantalla
        <div className="min-h-screen p-4 sm:p-8 bg-gray-900 flex justify-center items-center">
            <div className="w-full max-w-3xl bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-8">
                
                {/* Título Principal */}
                <h1 className="text-2xl sm:text-3xl font-extrabold text-red-500 border-b-4 border-red-600 pb-3 mb-6">
                    Crear Nuevo Usuario
                </h1>
                
                {/* Mensaje de Notificación (simulación de modal/toast) */}
                {message && (
                    <div 
                        className={`p-4 mb-6 rounded-lg font-semibold shadow-xl transition-opacity duration-300 ${
                            message.type === 'success' ? 'bg-green-700 text-white' : 
                            message.type === 'info' ? 'bg-indigo-700 text-white' : 
                            'bg-red-700 text-white'
                        }`}
                        role="alert"
                    >
                        {message.text}
                        <button onClick={() => setMessage(null)} className="float-right text-lg font-bold ml-4">&times;</button>
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    
                    {/* Sección: Información Básica (Nombre, Email) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <InputField
                            label="Nombre Completo"
                            name="nombreCompleto"
                            value={formData.nombreCompleto}
                            placeholder="EJ: Juan Pérez"
                        />
                        <InputField
                            label="Email"
                            name="email"
                            value={formData.email}
                            placeholder="ejemplo@empresa.cl"
                            type="email"
                        />
                    </div>

                    {/* Sección: Rol y Estado */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <SelectField
                            label="Rol Asignado"
                            name="rolAsignado"
                            value={formData.rolAsignado}
                            options={ROLES_DATA}
                        />
                        <SelectField
                            label="Estado"
                            name="estado"
                            value={formData.estado}
                            options={STATUS_OPTIONS}
                        />
                    </div>

                    {/* Sección: Permisos Específicos */}
                    <div className="bg-gray-900 p-5 sm:p-6 rounded-xl shadow-lg border border-gray-700">
                        <h2 className="text-xl font-bold text-gray-200 mb-4">
                            Permisos Específicos (Ajustados por Rol)
                        </h2>
                        
                        {/* Permisos como Checkboxes en 3 columnas con altura uniforme */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                            {ALL_PERMISSIONS.map(permission => (
                                // Aplicamos flex y w-full para asegurar que cada "cuadrado" de permiso sea del mismo tamaño
                                <div key={permission.id} className="flex flex-col w-full h-full"> 
                                    <label 
                                        className="flex items-start bg-gray-700 p-3 rounded-lg border border-gray-600 hover:bg-gray-600 transition duration-150 cursor-pointer h-full"
                                        htmlFor={`permiso-${permission.id}`}
                                    >
                                        <input
                                            type="checkbox"
                                            id={`permiso-${permission.id}`}
                                            checked={formData.permisosEspecificos.includes(permission.id)}
                                            onChange={() => handlePermissionChange(permission.id)}
                                            className="form-checkbox h-5 w-5 mt-1 text-red-600 bg-gray-800 border-gray-500 rounded focus:ring-red-500 transition duration-150 flex-shrink-0"
                                        />
                                        <span className="ml-3 leading-tight text-gray-300">
                                            {permission.name}
                                        </span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex justify-end space-x-4 mt-8">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={formData.isSubmitting}
                            className={`px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition duration-200 shadow-lg ${formData.isSubmitting ? 'opacity-70 cursor-not-allowed' : 'focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900'}`}
                        >
                            {formData.isSubmitting ? 'Creando Usuario...' : 'Crear Usuario'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CrearUsuarioForm;