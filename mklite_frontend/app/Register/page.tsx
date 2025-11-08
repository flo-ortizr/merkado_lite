import React from 'react';

// Se recomienda usar la palabra clave 'function' o 'const'
// Y DEBE USAR 'export default'
export default function RegisterPage() {
  
  // DEBE retornar JSX (el código HTML/Tailwind)
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold">Página de Registro (RegisterPage)</h1>
    </div>
  );
}

// Nota: Si usó el App Router, no necesita importar React,
// pero el export default function es obligatorio.