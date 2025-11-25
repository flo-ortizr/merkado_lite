"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { loginUser } from "./login/loginService";
import LoginModel from "./login/login.model";
import { User } from "./models/User";
import styles from "./login/LoginPage.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    

    setError("");
    if (!email || !password) {
      
      setError("Por favor ingresa email y contraseña");
      return;
    }

    setLoading(true);
   

    try {
      const data: LoginModel = { email, password };
     

      const response: { token: string; user: User } = await loginUser(data);
      

      if (!response?.user) {
       
        setError("Usuario o contraseña incorrectos");
        return;
      }

      localStorage.setItem("token", response.token);
      localStorage.setItem("role", response.user.role || "Cliente");
      

      const roleName = response.user?.role

      switch (roleName) {
        case "Administrador":
          console.log("Redirigiendo a /administrador/usuarios/lista");
          await router.push("/administrador/usuarios/lista");
          break;
        case "Vendedor":
          console.log("Redirigiendo a /vendedor/ventas-presenciales");
          await router.push("/vendedor/ventas-presenciales");
          break;
        case "Encargado de Almacén":
          console.log("Redirigiendo a /almacen/inventario");
          await router.push("/almacen/inventario");
          break;
        case "Repartidor":
          console.log("Redirigiendo a /repartidor");
          await router.push("/repartidor");
          break;
        case "Soporte":
          console.log("Redirigiendo a /SoporteHome");
          await router.push("/SoporteHome");
          break;
        default:
          console.log("Redirigiendo a /Home por defecto");
          await router.push("/Home");
          break;
      }

      console.log("Redirección completada (si no hubo errores)");

    } catch (err: any) {
      console.error("Error login:", err);
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
      console.log("Login finalizado");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftSide}>
        <div className={styles.formWrapper}>
          <h1 className="text-4xl font-extrabold mb-8 text-center text-red-600 tracking-tight">
            Login
          </h1>

          <form className="space-y-6" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
            />

            {error && <p className={styles.error}>{error}</p>}

            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? "Iniciando..." : "Iniciar sesión"}
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

      <div className={styles.rightSide}>
        <Image
          src="/Imagines/Logo.jpg"
          alt="Logo de la app"
          width={950}
          height={950}
          className="object-contain drop-shadow-2xl"
        />
      </div>
    </div>
  );
}
