'use client';
import React, { useState, useMemo } from 'react';

// =================================================================
// 1. CONSTANTES Y DATOS PRINCIPALES
// =================================================================

const ROLES = [
    { id: 'ADMIN', name: 'Administrador' },
    { id: 'VENTAS', name: 'Vendedor (Ventas Físicas)' },
    { id: 'ALMACEN', name: 'Encargado de Almacén' },
    { id: 'REPARTIDOR', name: 'Repartidor' },
    { id: 'SOPORTE', name: 'Soporte Técnico/Cliente' },
];

// Datos Mockeados iniciales (Solo para la tabla)
const MOCK_USERS_DB = [
    { id: 1, name: 'Ana Gómez', email: 'ana.gomez@empresa.cl', roleId: 'ADMIN', status: 'Activo' },
    { id: 2, name: 'Carlos Ruiz', email: 'carlos.ruiz@empresa.cl', roleId: 'ALMACEN', status: 'Activo' },
    { id: 3, name: 'Elena Torres', email: 'elena.torres@empresa.cl', roleId: 'VENTAS', status: 'Activo' },
    { id: 4, name: 'Luis Fernández', email: 'luis.fernandez@empresa.cl', roleId: 'REPARTIDOR', status: 'Activo' },
    { id: 5, name: 'María Soto', email: 'maria.soto@empresa.cl', roleId: 'SOPORTE', status: 'Inactivo' },
];

// =================================================================
// 2. COMPONENTE PRINCIPAL: UserRoleManagement
// =================================================================

const UserRoleManagement = () => {
    const [users, setUsers] = useState(MOCK_USERS_DB);
    const [systemMessage, setSystemMessage] = useState(null);

    // Mapear Roles para visualización rápida
    const roleMap = useMemo(() => ROLES.reduce((map, role) => ({ ...map, [role.id]: role.name }), {}), []);
    
    // --- Handlers de Navegación y Acciones ---

    // Simula la navegación a una nueva ruta/pantalla
    const navigate = (path) => {
        // En un entorno real (React Router, Next.js, etc.), esto sería router.push(path)
        console.log(`Navegando a: ${path}`);
        setSystemMessage({ 
            type: 'info', 
            text: `Simulación: Redireccionando a la pantalla ${path}`, 
            duration: 4000 
        });
    };

    const handleCreateNew = () => {
        navigate('/crear-usuario');
    };

    const handleEdit = (userId) => {
        navigate(`/editar-usuario/${userId}`);
    };

    const handleDelete = (userId) => {
        // Mantenemos la lógica de eliminación para la demostración
        setSystemMessage({ 
            type: 'confirm', 
            text: `¿Está seguro de que desea eliminar al usuario con ID ${userId}? Esta acción no es reversible.`,
            onConfirm: () => {
                const userName = users.find(u => u.id === userId)?.name || 'usuario';
                setUsers(users.filter(u => u.id !== userId));
                setSystemMessage({ type: 'success', text: `Usuario "${userName}" eliminado correctamente.`, duration: 3000 });
            },
            onCancel: () => setSystemMessage(null)
        });
    };
    
    // Función para manejar el cierre automático de mensajes de éxito
    React.useEffect(() => {
        if (systemMessage && (systemMessage.type === 'success' || systemMessage.type === 'info') && systemMessage.duration) {
            const timer = setTimeout(() => {
                setSystemMessage(null);
            }, systemMessage.duration);
            return () => clearTimeout(timer);
        }
    }, [systemMessage]);

    // --- Renderizado de la Interfaz ---

    return (
        <div className="min-h-screen p-6 bg-gray-900 text-gray-100 font-sans flex justify-center items-start">
            <div className="w-full max-w-6xl bg-gray-800 rounded-xl shadow-2xl p-8">
                
                {/* Header Principal */}
                <header className="mb-8 flex justify-between items-center border-b border-gray-700 pb-4">
                    <h1 className="text-3xl font-extrabold text-red-600 flex items-center">
                        <svg className="w-8 h-8 mr-3" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"></path></svg>
                        Gestión de Usuarios y Roles
                    </h1>
                    <button
                        onClick={handleCreateNew}
                        // Botón de Crear que dirige a '/crear-usuario'
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition duration-300 shadow-md hover:shadow-lg"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                        Crear Nuevo Usuario
                    </button>
                </header>

                {/* Mensajes del Sistema (Éxito / Confirmación / Info) */}
                {(systemMessage && systemMessage.type === 'success') && (
                    <div className="p-3 mb-4 text-center text-white bg-green-600 rounded-lg font-semibold transition-opacity duration-300">
                        {systemMessage.text}
                    </div>
                )}
                {(systemMessage && systemMessage.type === 'info') && (
                    <div className="p-3 mb-4 text-center text-white bg-indigo-600 rounded-lg font-semibold transition-opacity duration-300">
                        {systemMessage.text}
                    </div>
                )}
                {systemMessage && systemMessage.type === 'confirm' && (
                    <div className="p-3 mb-4 flex justify-between items-center text-white bg-red-800 rounded-lg font-semibold shadow-lg">
                        <span>{systemMessage.text}</span>
                        <div className="space-x-3">
                            <button 
                                onClick={systemMessage.onConfirm}
                                className="bg-white text-red-800 hover:bg-gray-200 px-4 py-1 rounded-lg font-bold transition"
                            >
                                Confirmar
                            </button>
                            <button 
                                onClick={systemMessage.onCancel}
                                className="bg-gray-600 text-white hover:bg-gray-500 px-4 py-1 rounded-lg transition"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                )}


                {/* Tabla de Usuarios */}
                <div className="bg-gray-900 rounded-lg overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="min-w-full table-auto text-sm text-left text-gray-200">
                            <thead className="text-xs text-gray-400 uppercase bg-gray-700">
                                <tr>
                                    <th scope="col" className="px-6 py-3">ID</th>
                                    <th scope="col" className="px-6 py-3">Nombre</th>
                                    <th scope="col" className="px-6 py-3">Email</th>
                                    <th scope="col" className="px-6 py-3">Rol</th>
                                    <th scope="col" className="px-6 py-3 text-center">Estado</th>
                                    <th scope="col" className="px-6 py-3 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                        <td className="px-6 py-4 font-semibold text-red-300">{user.id}</td>
                                        <td className="px-6 py-4">{user.name}</td>
                                        <td className="px-6 py-4 italic text-gray-400">{user.email}</td>
                                        <td className="px-6 py-4 font-medium text-white">{roleMap[user.roleId] || 'Sin Rol'}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                                user.status === 'Activo' ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'
                                            }`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center space-x-3">
                                            <button
                                                onClick={() => handleEdit(user.id)}
                                                // Botón de Editar que dirige a '/editar-usuario/ID'
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-1 px-3 rounded-lg transition duration-150 shadow-md"
                                                title={`Editar Usuario ${user.name}`}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="bg-gray-600 hover:bg-red-700 text-white font-medium py-1 px-3 rounded-lg transition duration-150"
                                                title="Eliminar Usuario"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserRoleManagement;