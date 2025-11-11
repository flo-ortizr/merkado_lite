"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validación básica
    if (!nombre || !email || !password) {
      setError("Por favor completa todos los campos");
      return;
    }

    // Aquí iría la llamada real a tu backend
    router.push("/Login");
  };

  return (
    <div className="min-h-screen flex relative">
      {/* --- LADO IZQUIERDO --- */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-2xl">
          <h1 className="text-3xl font-semibold mb-8 text-center text-gray-800">
            Registro
          </h1>

          <form className="space-y-6" onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Nombre completo"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
            />

            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
            />

            <div className="relative">
              <input
                type={mostrarPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg pr-20"
              />

              {/* Botón solo con texto */}
              <button
                type="button"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                className="absolute right-3 top-2.5 text-sm text-gray-600 hover:text-black"
              >
                {mostrarPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full px-4 py-3 bg-black text-white rounded-lg"
            >
              Registrarme
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <Link href="/Login" className="text-blue-600 hover:text-blue-800">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* --- LADO DERECHO (IMAGEN) --- */}
      <div className="hidden md:flex w-1/2 bg-gray-200 relative">
        <Image
          src="/Imagines/Logo.jpg"
          alt="Logo de registro"
          width={600}
          height={600}
          className="object-contain"
        />
      </div>
    </div>
  );
}
