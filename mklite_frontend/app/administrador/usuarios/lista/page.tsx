'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './UserRoleManagement.module.css';
import { getUsers, disableUser } from "@/services/userService";

const UserRoleManagement = () => {
    const router = useRouter(); // ← hook para navegación
    const [users, setUsers] = useState<any[]>([]);
    const [systemMessage, setSystemMessage] = useState<any>(null);

    // 👉 Cargar usuarios desde backend
    const loadUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (err) {
            setSystemMessage({ type: 'info', text: 'Error cargando usuarios.' });
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    // 👉 Navegación real
    const handleCreateNew = () => router.push('/administrador/usuarios/crear-usuario');
    const handleEdit = (userId: number) => router.push(`/administrador/usuarios/editar-usuario/${userId}`);

    // 👉 Desactivar usuario
    const handleDelete = (userId: number) => {
        setSystemMessage({
            type: 'confirm',
            text: `¿Está seguro de que desea desactivar al usuario con ID ${userId}?`,
            onConfirm: async () => {
                try {
                    await disableUser(userId);
                    await loadUsers(); // refrescar lista
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

    // Auto-cerrar mensajes
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
                                    <th>ID</th>
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
                                        <td>{user.id_user}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        {/* 👈 Acceder directamente al nombre del rol */}
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
    );
};

export default UserRoleManagement;
