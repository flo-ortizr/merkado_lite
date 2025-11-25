'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './UserRoleManagement.module.css';
import { getUsers, disableUser } from "@/services/userService";

const MENU_OPTIONS = [
  { label: 'Ventas', path: '/administrador/ventas' },
  { label: 'Usuarios', path: '/administrador/usuarios/lista' },
  { label: 'Proveedores', path: '/administrador/proveedores' },
  { label: 'Promociones', path: '/administrador/promociones' },
  { label: 'Pedidos', path: '/administrador/pedidos' },
  { label: 'Ofertas', path: '/administrador/ofertas' },
  { label: 'Historial Precios', path: '/administrador/historial-precios' },
];

const UserRoleManagement = () => {
    const router = useRouter(); 
    const [users, setUsers] = useState<any[]>([]);
    const [systemMessage, setSystemMessage] = useState<any>(null);
    const [activePath, setActivePath] = useState<string>(router.pathname);

    const loadUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (err) {
            setSystemMessage({ type: 'info', text: 'Error cargando usuarios.', duration: 3000 });
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleCreateNew = () => router.push('/administrador/usuarios/crear-usuario');
    const handleEdit = (userId: number) => router.push(`/administrador/usuarios/editar-usuario/${userId}`);

    const handleDelete = (userId: number) => {
        setSystemMessage({
            type: 'confirm',
            text: `¿Está seguro de que desea desactivar al usuario con ID ${userId}?`,
            onConfirm: async () => {
                try {
                    await disableUser(userId);
                    await loadUsers();
                    setSystemMessage({
                        type: 'success',
                        text: `Usuario desactivado correctamente.`,
                        duration: 3000
                    });
                } catch (error) {
                    setSystemMessage({
                        type: 'info',
                        text: `Error desactivando usuario.`,
                        duration: 3000
                    });
                }
            },
            onCancel: () => setSystemMessage(null)
        });
    };

    const handleLogout = () => {
        router.push('/'); // Redirige al inicio
    };

    const goTo = (path: string) => {
        setActivePath(path);
        router.push(path);
    };

    useEffect(() => {
        if (systemMessage && (systemMessage.type === 'success' || systemMessage.type === 'info') && systemMessage.duration) {
            const timer = setTimeout(() => setSystemMessage(null), systemMessage.duration);
            return () => clearTimeout(timer);
        }
    }, [systemMessage]);

    return (
        <div style={{ display: 'flex', position: 'relative' }}>
            
            {/* Menú lateral */}
            <nav style={{
                width: '220px',
                backgroundColor: '#1F2937',
                minHeight: '100vh',
                padding: '20px',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            }}>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px' }}>Menú</h2>
                {MENU_OPTIONS.map(option => (
                    <button 
                        key={option.path}
                        onClick={() => goTo(option.path)}
                        style={{
                            padding: '10px 15px',
                            backgroundColor: activePath === option.path ? '#4B5563' : '#374151',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            color: '#fff',
                            textAlign: 'left',
                            transition: 'background-color 0.2s',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4B5563')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = activePath === option.path ? '#4B5563' : '#374151')}
                    >
                        {option.label}
                    </button>
                ))}
            </nav>

            {/* Contenedor principal */}
            <div className={styles.container} style={{ flex: 1, position: 'relative', padding: '20px' }}>
                
                <button 
                    onClick={handleLogout} 
                    style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        background: 'none',
                        border: 'none',
                        color: '#eef0f5ff',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        fontSize: '14px',
                    }}
                >
                    Cerrar Sesión
                </button>

                <div className={styles.card}>
                    <header className={styles.header}>
                        <h1 className={styles.title}>Gestión de Usuarios y Roles</h1>
                        <button onClick={handleCreateNew} className={styles.createBtn}>Crear Nuevo Usuario</button>
                    </header>

                    {systemMessage && systemMessage.type === 'success' && (
                        <div className={styles.messageSuccess}>{systemMessage.text}</div>
                    )}
                    {systemMessage && systemMessage.type === 'info' && (
                        <div className={styles.messageInfo}>{systemMessage.text}</div>
                    )}
                    {systemMessage && systemMessage.type === 'confirm' && (
                        <div className={styles.messageConfirm}>
                            <span>{systemMessage.text}</span>
                            <div className="space-x-3">
                                <button onClick={systemMessage.onConfirm} className={styles.confirmBtn}>Confirmar</button>
                                <button onClick={systemMessage.onCancel} className={styles.cancelBtn}>Cancelar</button>
                            </div>
                        </div>
                    )}

                    <div className={styles.tableWrapper}>
                        <div className={styles.tableContainer}>
                            <table className={styles.table}>
                                <thead className={styles.thead}>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Email</th>
                                        <th>Rol</th>
                                        <th className="text-center">Estado</th>
                                        <th className="text-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id_user} className={styles.trHover}>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.role?.name || 'Sin Rol'}</td>
                                            <td>
                                                <span className={
                                                    user.status === 'active'
                                                        ? styles.statusActive
                                                        : styles.statusInactive
                                                }>
                                                    {user.status === 'active' ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center space-x-3">
                                                <button onClick={() => handleEdit(user.id_user)} className={styles.actionBtnEdit}>Editar</button>
                                                <button onClick={() => handleDelete(user.id_user)} className={styles.actionBtnDelete}>Desactivar</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserRoleManagement;
