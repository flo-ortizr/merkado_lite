"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { loginUser } from "./loginService";
import LoginModel from "./login.model";
import { User } from "../models/User";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    console.log("handleLogin ejecutado"); // log de depuración
    setError("");

    if (!email || !password) {
      setError("Por favor ingresa email y contraseña");
      return;
    }

    setLoading(true);

    try {
      const data: LoginModel = { email, password };
      const response: { token: string; user: User } = await loginUser(data);
      console.log("Usuario recibido:", response.user);

      // Guardar token y rol en localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("role", response.user.role || "Cliente");

      // Redirigir según rol
      const roleName = response.user.role;
      switch (roleName) {
        case "Administrador":
          router.push("/administrador/usuarios/lista");
          break;
        case "Vendedor":
          router.push("/VendedorHome");
          break;
        case "Encargado de Almacén":
          router.push("/AlmacenHome");
          break;
        case "Repartidor":
          router.push("/RepartidorHome");
          break;
        case "Soporte":
          router.push("/SoporteHome");
          break;
        default:
          router.push("/administrador/usuarios/lista");
          break;
      }
    } catch (err: any) {
      console.error("Error login:", err);
      setError(err.message || "Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftSide}>
        <div className={styles.formWrapper}>
          <h1 className="text-4xl font-extrabold mb-12 text-center text-red-600 tracking-tight">
            Login
          </h1>

          {/* Quitamos onSubmit para evitar recarga y problemas de submit */}
          <form className="space-y-6" onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleLogin();
            }
          }}>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />
            <input
              type="password"
              placeholder="Contraseña2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
            />

            {error && <p className={styles.error}>{error}</p>}

            <button
              type="button"
              onClick={handleLogin}
              className={styles.button}
              disabled={loading}
            >
              {loading ? "Iniciando..." : "Iniciar sesión"}
            </button>
          </form>

          <div className="text-center mt-8">
            <a
              href="/Register"
              className="text-red-600 font-medium hover:text-red-800 transition"
            >
              Crear cuenta
            </a>
          </div>
        </div>
      </div>

      <div className={styles.rightSide}>
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
