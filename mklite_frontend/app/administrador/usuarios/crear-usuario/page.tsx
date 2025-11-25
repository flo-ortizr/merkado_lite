'use client';

import { getAllRoles } from '@/services/roleService';
// Nota: Se han eliminado las importaciones de '@/app/models/User' y '@/services/roleService' 
// porque no se pueden resolver en este entorno, usando mock data o interfaces locales en su lugar.
import React, { useState, useEffect, useMemo } from 'react';

// =================================================================
// 1. TIPOS Y DATOS MOCKEADOS
// =================================================================

// Interfaces simplificadas para el entorno (simulando modelos reales)
interface Role {
  id: number;
  name: string;
  defaultPermissions: string[];
}

interface UserData {
  name: string;
  ci: string;
  phone: string;
  email: string;
  password?: string; // Opcional si solo se usa para creación
  role: string;
  roleId: number;
  status: string;
  permissions: string[];
}



const ALL_PERMISSIONS = [
  { id: 'gestion_usuarios', name: 'Gestionar Usuarios y Roles' },
  { id: 'ver_reportes', name: 'Ver Todos los Reportes (Ventas, Stock, Personal)' },
  { id: 'gestion_stock', name: 'Gestionar Stock, Lotes y Mermas' },
  { id: 'gestion_ordenes', name: 'Gestionar Órdenes de Compra a Proveedores' },
  { id: 'registro_ventas', name: 'Registrar Ventas Físicas (Caja)' },
  { id: 'ver_inventario', name: 'Ver Inventario General' },
  { id: 'gestion_entregas', name: 'Gestionar Estado de Entregas Asignadas' },
  { id: 'gestion_consultas', name: 'Gestionar Consultas e Incidencias (Chat)' },
  { id: 'ver_finanzas', name: 'Ver Reportes Financieros' },
];

const STATUS_OPTIONS = ['Activo', 'Inactivo', 'Suspendido'];

// =================================================================
// 2. COMPONENTES REUTILIZABLES
// =================================================================

// Define las props para InputField (usa genéricos para evitar re-definiciones)
interface InputFieldProps {
  label: string;
  name: keyof UserData | 'password'; // Permite acceder a cualquier clave de UserData más 'password'
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, type = 'text', placeholder = '', value, onChange }) => (
  <div className="flex flex-col">
    <label htmlFor={String(name)} className="text-sm font-semibold text-gray-400 mb-1">{label}</label>
    <input
      type={type}
      id={String(name)}
      name={String(name)} // Asegurar que el atributo name sea el string de la clave
      value={value} // ¡CORREGIDO! Valor pasado explícitamente.
      onChange={onChange} // ¡CORREGIDO! Handler pasado explícitamente.
      placeholder={placeholder}
      className="bg-gray-700 border border-gray-600 text-gray-200 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-3 transition duration-200 shadow-inner placeholder:text-gray-500"
      required
    />
  </div>
);

interface SelectFieldProps {
  label: string;
  name: string; // Puede ser 'rolAsignado' o 'status'
  value: string | number;
  options: any[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const SelectField: React.FC<SelectFieldProps> = ({ label, name, value, options, onChange }) => (
  <div className="flex flex-col">
    <label htmlFor={name} className="text-sm font-semibold text-gray-400 mb-1">{label}</label>
    <select
      id={name}
      name={name}
      value={value} // ¡CORREGIDO! Valor pasado explícitamente.
      onChange={onChange as (e: React.ChangeEvent<HTMLSelectElement>) => void} // Casting para onChange de select
      className="bg-gray-700 border border-gray-600 text-gray-200 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block w-full p-3 appearance-none transition duration-200 shadow-inner"
    >
      {/* Si es un array de strings (como STATUS_OPTIONS) */}
      {typeof options[0] === 'string'
        ? options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))
        // Si es un array de objetos (como MOCK_ROLES_DATA)
        : options.map(option => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))
      }
    </select>
  </div>
);


// =================================================================
// 3. COMPONENTE PRINCIPAL DEL FORMULARIO
// =================================================================

const CrearUsuarioForm: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  
  // Combina UserData con el estado de UI
  const [formData, setFormData] = useState<UserData & { isSubmitting: boolean }>({
    name: 'Juan Pérez',
    ci: '12345678',
    phone: '+59171234567',
    email: 'ejemplo@empresa.cl',
    password: 'password123',
    role: '',
    roleId: 0,
    status: STATUS_OPTIONS[0],
    permissions: [],
    isSubmitting: false,
  });

  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);

  // Simulación de useEffect para cargar roles (reemplaza 'getAllRoles')
 useEffect(() => {
  const fetchRoles = async () => {
    try {
      const data = await getAllRoles();
      setRoles(data);

      if (data.length > 0) {
        setFormData(prev => ({
          ...prev,
          role: data[0].name,
          roleId: data[0].id,
          permissions: data[0].defaultPermissions || [],
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };
  fetchRoles();
}, []);


  // Mapeo para facilitar la búsqueda de roles
  const roleMap = useMemo(() => 
    roles.reduce((map, role) => ({ ...map, [role.id]: role }), {} as Record<number, Role>),
    [roles]
  );

  // =================================================================
  // HANDLERS
  // =================================================================

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // 1. Manejo de Rol (Select con name="rolAsignado")
    if (name === 'rolAsignado') {
        // CORRECCIÓN CLAVE: Convertir value (string) a número para buscar el rol
        const idNumber = parseInt(value, 10);
        const newRole = roleMap[idNumber]; 
        
        if (newRole) {
            setFormData(prev => ({
                ...prev,
                role: newRole.name,
                roleId: newRole.id,
                permissions: newRole.defaultPermissions || [],
            }));
        }
        return;
    }

    // 2. Manejo de Estado (Select con name="status")
    if (name === 'status') {
      setFormData(prev => ({ ...prev, status: value }));
      return;
    }

    // 3. Manejo de Inputs de Texto/Email/Password (name="name", "ci", "phone", etc.)
    // Los campos de texto mapean directamente a las claves de formData
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePermissionChange = (permissionId: string) => {
    setFormData(prev => {
      const perms = prev.permissions || [];
      const newPerms = perms.includes(permissionId)
        ? perms.filter(p => p !== permissionId)
        : [...perms, permissionId];
      return { ...prev, permissions: newPerms };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormData(prev => ({ ...prev, isSubmitting: true }));

    // Simulación de envío API
    setTimeout(() => {
      setFormData(prev => ({ ...prev, isSubmitting: false }));
      setMessage({ type: 'success', text: `¡Usuario ${formData.name} creado con éxito!` });
      // Aquí se llamaría a la API de creación con los datos en formData
      console.log('Datos enviados:', formData);
    }, 1500);
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gray-900 flex justify-center items-center font-inter">
      <div className="w-full max-w-3xl bg-gray-800 rounded-xl shadow-2xl p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-red-500 border-b-4 border-red-600 pb-3 mb-6">
          Crear Nuevo Usuario
        </h1>

        {message && (
          <div
            className={`p-4 mb-6 rounded-lg font-semibold shadow-xl transition-opacity duration-300 flex justify-between items-start ${message.type === 'success' ? 'bg-green-700 text-white' : 'bg-indigo-700 text-white'}`}
            role="alert"
          >
            <span>{message.text}</span>
            <button onClick={() => setMessage(null)} className="text-lg font-bold ml-4 leading-none">&times;</button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Inputs de texto (Name, CI, Phone, Email, Password) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <InputField 
                label="Nombre Completo" 
                name="name" 
                placeholder="EJ: Juan Pérez" 
                value={formData.name} 
                onChange={handleInputChange} 
            />
            <InputField 
                label="C.I." 
                name="ci" 
                placeholder="Número de documento" 
                value={formData.ci} 
                onChange={handleInputChange} 
            />
            <InputField 
                label="Teléfono" 
                name="phone" 
                placeholder="Número de teléfono" 
                value={formData.phone} 
                onChange={handleInputChange} 
            />
            <InputField 
                label="Email" 
                name="email" 
                type="email" 
                placeholder="ejemplo@empresa.cl" 
                value={formData.email} 
                onChange={handleInputChange} 
            />
            <InputField 
                label="Contraseña" 
                name="password" 
                type="password" 
                placeholder="******" 
                // Nota: Usar un valor no controlado o una cadena vacía en producción
                value={formData.password || ''} 
                onChange={handleInputChange} 
            />
          </div>

          {/* Selectores */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <SelectField 
                label="Rol Asignado" 
                name="rolAsignado" 
                value={formData.roleId} // El valor debe ser el ID (number)
                options={roles} // Opciones de objetos {id, name, ...}
                onChange={handleInputChange} 
            />
            <SelectField 
                label="Estado" 
                name="status" 
                value={formData.status} // El valor es el string del estado
                options={STATUS_OPTIONS} // Opciones de strings
                onChange={handleInputChange} 
            />
          </div>

          {/* Permisos */}
          <div className="bg-gray-900 p-5 sm:p-6 rounded-xl shadow-lg border border-gray-700">
            <h2 className="text-xl font-bold text-gray-200 mb-4">Permisos Específicos (Ajustados por Rol)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              {ALL_PERMISSIONS.map(permission => (
                <div key={permission.id} className="flex flex-col w-full h-full">
                  <label htmlFor={`permiso-${permission.id}`} className="flex items-start bg-gray-700 p-3 rounded-lg border border-gray-600 hover:bg-gray-600 transition duration-150 cursor-pointer h-full">
                    <input
                      type="checkbox"
                      id={`permiso-${permission.id}`}
                      checked={formData.permissions?.includes(permission.id)}
                      onChange={() => handlePermissionChange(permission.id)}
                      className="form-checkbox h-5 w-5 mt-1 text-red-600 bg-gray-800 border-gray-500 rounded focus:ring-red-500 transition duration-150 flex-shrink-0"
                    />
                    <span className="ml-3 leading-tight text-gray-300">{permission.name}</span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-4 mt-8">
            <button type="button" onClick={() => setMessage({ type: 'info', text: 'Operación cancelada' })} className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition duration-200 shadow-md">
              Cancelar
            </button>
            <button type="submit" disabled={formData.isSubmitting} className={`px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition duration-200 shadow-lg ${formData.isSubmitting ? 'opacity-70 cursor-not-allowed' : 'focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900'}`}>
              {formData.isSubmitting ? 'Creando Usuario...' : 'Crear Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearUsuarioForm;