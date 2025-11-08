"use client"; // Necesario en App Router para usar hooks

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validación básica
    if (!email || !password) {
      setError("Por favor ingresa email y contraseña");
      return;
    }

    // Aquí iría la llamada real a tu backend
    // const res = await fetch("/api/login", { ... })
    // if (res.ok) { router.push("/Home"); } else { setError("Credenciales inválidas"); }

    // De momento simulamos login correcto
    router.push("/Home");
  };

  return (
    <div className="min-h-screen flex relative">
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-2xl">
          <h1 className="text-3xl font-semibold mb-8 text-center text-gray-800">
            Login In
          </h1>

          <form className="space-y-6" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full px-4 py-3 bg-black text-white rounded-lg"
            >
              Login In
            </button>
          </form>

          <div className="text-center mt-4">
            <Link href="/Register" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </div>
        </div>
      </div>

      <div className="hidden md:flex w-1/2 bg-gray-200 relative">
        <Image
          src="/Imagines/Logo.jpg"
          alt="Carrito de compras"
          width={600}
          height={600}
          className="object-contain"
        />
      </div>
    </div>
  );
}
