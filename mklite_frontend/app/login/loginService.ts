import LoginModel from "./login.model";

export const loginUser = async (data: LoginModel) => {
  const response = await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.message || "Error al iniciar sesión");
  }

  return await response.json(); // { message, token, user }
};
