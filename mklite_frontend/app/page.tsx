"use client"; // Necesario en App Router para usar hooks

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Por favor ingresa email y contraseña");
      return;
    }

    // Simulación de login correcto
    router.push("/Home");
  };

  return (
    <div className="min-h-screen flex relative bg-gradient-to-r from-red-700 via-red-600 to-red-500">
      {/* --- LADO IZQUIERDO (formulario) --- */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white/90 backdrop-blur-sm">
        <div className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-2xl border border-red-100">
          <h1 className="text-4xl font-extrabold mb-8 text-center text-red-600 tracking-tight">
            Login
          </h1>

          <form className="space-y-6" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition shadow-sm"
            />

            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition shadow-sm"
            />

            {error && (
              <p className="text-red-600 text-sm text-center font-medium">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300 font-semibold shadow-md hover:shadow-lg"
            >
              Iniciar sesión
            </button>
          </form>

          <div className="text-center mt-4">
            <a
              href="/Register"
              className="text-red-600 font-medium hover:text-red-800 transition"
            >
              Crear cuenta
            </a>
          </div>
        </div>
      </div>

      {/* --- LADO DERECHO (imagen) --- */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-black/30 backdrop-blur-md">
        <Image
          src="/Imagines/Logo.jpg"
          alt="Logo de la app"
          width={550}
          height={550}
          className="object-contain drop-shadow-2xl"
        />
      </div>
    </div>
  );
}
