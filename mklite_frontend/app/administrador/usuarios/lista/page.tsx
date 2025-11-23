'use client';
import React, { useState, useMemo, useEffect } from 'react';
import styles from './UserRoleManagement.module.css';

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

const MOCK_USERS_DB = [
    { id: 1, name: 'Ana Gómez', email: 'ana.gomez@empresa.cl', roleId: 'ADMIN', status: 'Activo' },
    { id: 2, name: 'Carlos Ruiz', email: 'carlos.ruiz@empresa.cl', roleId: 'ALMACEN', status: 'Activo' },
    { id: 3, name: 'Elena Torres', email: 'elena.torres@empresa.cl', roleId: 'VENTAS', status: 'Activo' },
    { id: 4, name: 'Luis Fernández', email: 'luis.fernandez@empresa.cl', roleId: 'REPARTIDOR', status: 'Activo' },
    { id: 5, name: 'María Soto', email: 'maria.soto@empresa.cl', roleId: 'SOPORTE', status: 'Inactivo' },
];

// =================================================================
// 2. COMPONENTE PRINCIPAL
// =================================================================

const UserRoleManagement = () => {
    const [users, setUsers] = useState(MOCK_USERS_DB);
    const [systemMessage, setSystemMessage] = useState<any>(null);

    const roleMap = useMemo(() => ROLES.reduce((map, role) => ({ ...map, [role.id]: role.name }), {}), []);

    const navigate = (path: string) => {
        console.log(`Navegando a: ${path}`);
        setSystemMessage({ type: 'info', text: `Simulación: Redireccionando a la pantalla ${path}`, duration: 4000 });
    };

    const handleCreateNew = () => navigate('/crear-usuario');
    const handleEdit = (userId: number) => navigate(`/editar-usuario/${userId}`);
    const handleDelete = (userId: number) => {
        setSystemMessage({
            type: 'confirm',
            text: `¿Está seguro de que desea eliminar al usuario con ID ${userId}?`,
            onConfirm: () => {
                const userName = users.find(u => u.id === userId)?.name || 'usuario';
                setUsers(users.filter(u => u.id !== userId));
                setSystemMessage({ type: 'success', text: `Usuario "${userName}" eliminado correctamente.`, duration: 3000 });
            },
            onCancel: () => setSystemMessage(null),
        });
    };

    useEffect(() => {
        if (systemMessage && (systemMessage.type === 'success' || systemMessage.type === 'info') && systemMessage.duration) {
            const timer = setTimeout(() => setSystemMessage(null), systemMessage.duration);
            return () => clearTimeout(timer);
        }
    }, [systemMessage]);

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <header className={styles.header}>
                    <h1 className={styles.title}>
                        Gestión de Usuarios y Roles
                    </h1>
                    <button className={styles.createButton} onClick={handleCreateNew}>
                        Crear Nuevo Usuario
                    </button>
                </header>

                {systemMessage && systemMessage.type === 'success' && (
                    <div className={styles.successMsg}>{systemMessage.text}</div>
                )}
                {systemMessage && systemMessage.type === 'info' && (
                    <div className={styles.infoMsg}>{systemMessage.text}</div>
                )}
                {systemMessage && systemMessage.type === 'confirm' && (
                    <div className={styles.confirmMsg}>
                        <span>{systemMessage.text}</span>
                        <div className={styles.confirmButtons}>
                            <button onClick={systemMessage.onConfirm} className={styles.confirmBtn}>Confirmar</button>
                            <button onClick={systemMessage.onCancel} className={styles.cancelBtn}>Cancelar</button>
                        </div>
                    </div>
                )}

                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Email</th>
                                <th>Rol</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{roleMap[user.roleId] || 'Sin Rol'}</td>
                                    <td>{user.status}</td>
                                    <td>
                                        <button onClick={() => handleEdit(user.id)}>Editar</button>
                                        <button onClick={() => handleDelete(user.id)}>Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UserRoleManagement;
