// mklite_frontend/app/almacen/reposicion-stock/types.ts

export interface Producto {
  id: string;
  nombre: string;
  stock_actual: number;
  stock_minimo: number;
  proveedor: string;
  categoria?: string;
  precio_compra?: number;
}

export interface AlertaStock {
  id: string;
  producto: Producto;
  fecha_alerta: string;
  prioridad: 'alta' | 'media' | 'baja';
  estado: 'pendiente' | 'procesada' | 'resuelta';
}

export interface OrdenCompra {
  id: string;
  producto_id: string;
  producto_nombre: string;
  proveedor: string;
  cantidad: number;
  fecha_creacion: string;
  estado: 'pendiente' | 'aprobada' | 'en_camino' | 'recibida';
  total?: number;
}

export interface Proveedor {
  id: string;
  nombre: string;
  contacto: string;
  telefono: string;
  email: string;
}

// Datos de ejemplo - Stock mínimo 10 para todos los productos
export const productosEjemplo: Producto[] = [
  {
    id: "PROD-001",
    nombre: "Laptop Gamer",
    stock_actual: 2,
    stock_minimo: 10,
    proveedor: "TecnoSupply",
    categoria: "Tecnología",
    precio_compra: 1200000
  },
  {
    id: "PROD-002", 
    nombre: "Mouse Inalámbrico",
    stock_actual: 3,
    stock_minimo: 10,
    proveedor: "AccesoriosTech",
    categoria: "Accesorios",
    precio_compra: 45000
  },
  {
    id: "PROD-003",
    nombre: "Auriculares Bluetooth",
    stock_actual: 1,
    stock_minimo: 10,
    proveedor: "AudioPro",
    categoria: "Audio",
    precio_compra: 89000
  },
  {
    id: "PROD-004",
    nombre: "Teclado Mecánico",
    stock_actual: 15,
    stock_minimo: 10,
    proveedor: "AccesoriosTech",
    categoria: "Accesorios",
    precio_compra: 120000
  },
  {
    id: "PROD-005",
    nombre: "Monitor 24''",
    stock_actual: 8,
    stock_minimo: 10,
    proveedor: "TecnoSupply",
    categoria: "Tecnología",
    precio_compra: 450000
  },
  {
    id: "PROD-006",
    nombre: "Webcam HD",
    stock_actual: 12,
    stock_minimo: 10,
    proveedor: "AccesoriosTech",
    categoria: "Accesorios",
    precio_compra: 65000
  }
];