"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/services/userService";
import { getAllRoles } from "@/services/roleService";
import { User } from "@/app/models/User";

// ===========================================================
// INPUT FIELD
// ===========================================================
interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type = "text",
  placeholder = "",
  value,
  onChange,
}) => (
  <div className="flex flex-col">
    <label className="text-sm font-semibold text-gray-300 mb-1">{label}</label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded-lg 
                 focus:ring-red-500 focus:border-red-500 block w-full p-3 
                 placeholder:text-gray-500"
      required
    />
  </div>
);

// ===========================================================
// SELECT FIELD
// ===========================================================
interface SelectFieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { id: number; name: string }[]; 
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  value,
  onChange,
  options,
}) => (
  <div className="flex flex-col">
    <label className="text-sm font-semibold text-gray-300 mb-1">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded-lg 
                 focus:ring-red-500 focus:border-red-500 block w-full p-3"
      required
    >
      <option key="default-role-key" value="">
        Seleccione un rol
      </option>
      {options.map((r) => (
        <option key={r.id} value={r.id}>
          {r.name}
        </option>
      ))}
    </select>
  </div>
);

// ===========================================================
// FORMULARIO PRINCIPAL
// ===========================================================
export default function CrearUsuario() {
  const router = useRouter();
  // 🎯 Ruta de Redirección
  const redirectPath = "/administrador/usuarios/lista";

  const [form, setForm] = useState<
    User & { code_user?: string; roleId?: number }
  >({
    name: "",
    ci: "",
    phone: "",
    email: "",
    password: "",
    code_user: "",
    roleId: undefined,
  });

  const [roles, setRoles] = useState<{ id: number; name: string }[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Cargar y mapear roles (id_role -> id)
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rawData = await getAllRoles();
        
        // Mapea id_role del backend a 'id' para el componente SelectField
        const mappedRoles = rawData.map((role: any) => ({
          id: role.id_role,
          name: role.name,
        }));
        setRoles(mappedRoles);
      } catch (err: any) {
        console.error("Error cargando roles:", err.message);
        setError("Error al cargar los roles. Intente refrescar.");
      }
    };
    fetchRoles();
  }, []);

  // Handler que convierte a número
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "roleId") {
      // Convierte el valor a número si no es la opción vacía
      setForm({ ...form, [name]: value === "" ? undefined : Number(value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };


  // Guardar usuario
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Validación
    if (
      !form.name ||
      !form.ci ||
      !form.phone ||
      !form.email ||
      !form.password ||
      form.roleId === undefined
    ) {
      setError("Por favor completa todos los campos y selecciona un rol");
      return;
    }

    setLoading(true);
    try {
      const userToRegister = {
        ...form,
        code_user: form.code_user?.trim() || "CLI",
      };
      
      console.log("Datos del usuario a enviar al backend (roleId debe ser NUMBER):", userToRegister);

      await registerUser(userToRegister);

      // ✅ CAMBIO: Redirección a la ruta /administrador/usuarios/lista
      router.push(redirectPath); 
      
    } catch (err: any) {
      const apiErrorMessage = err.response?.data?.message || err.message;
      setError(`Error al registrar usuario: ${apiErrorMessage}.`);
    } finally {
      setLoading(false);
    }
  };

  // Cancelar
  const handleCancel = () => {
    // ✅ CAMBIO: Redirección a la ruta /administrador/usuarios/lista
    router.push(redirectPath);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex justify-center items-center p-4">
      <div className="w-full max-w-2xl bg-gray-800 rounded-xl shadow-2xl p-8">

        <h1 className="text-3xl font-extrabold text-red-500 border-b-4 border-red-600 pb-3 mb-8">
          Crear Usuario
        </h1>

        <form onSubmit={handleSave}>
          <div className="grid grid-cols-1 gap-6 mb-6">
            <InputField
              label="Nombre Completo"
              name="name"
              placeholder="Juan Pérez"
              value={form.name}
              onChange={handleChange}
            />

            <InputField
              label="Cédula de Identidad"
              name="ci"
              placeholder="12345678"
              value={form.ci}
              onChange={handleChange}
            />

            <InputField
              label="Teléfono"
              name="phone"
              placeholder="+591 70000000"
              value={form.phone}
              onChange={handleChange}
            />

            <InputField
              label="Correo Electrónico"
              name="email"
              type="email"
              placeholder="ejemplo@gmail.com"
              value={form.email}
              onChange={handleChange}
            />

            <InputField
              label="Contraseña"
              name="password"
              type="password"
              placeholder="******"
              value={form.password}
              onChange={handleChange}
            />

            <SelectField
              label="Rol"
              name="roleId"
              value={form.roleId ?? ""} 
              onChange={handleChange}
              options={roles} 
            />

          </div>

          {error && (
            <p className="text-red-500 text-sm font-medium text-center mb-4">
              {error}
            </p>
          )}

          {/* BOTONES */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2 rounded-lg border border-gray-500 text-gray-300 
                          hover:bg-gray-700 transition"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white 
                          font-bold transition shadow-lg 
                          ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {loading ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}