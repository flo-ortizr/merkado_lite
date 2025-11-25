// app/pedidos/pedidos.ts

// Interfaces
export interface Pedido {
  id_order: string;
  order_date: string;
  total: number;
  status: 'Entregado' | 'En camino' | 'Procesando' | 'Cancelado';
  payment_method: string;
  productos: {
    product_name: string;
    quantity: number;
    subtotal: number;
  }[];
}

// Datos de ejemplo
export const pedidosEjemplo: Pedido[] = [
  {
    id_order: "ORD-001",
    order_date: "2024-01-15",
    total: 156800,
    status: "Entregado",
    payment_method: "Tarjeta",
    productos: [
      { product_name: "Laptop Gamer", quantity: 1, subtotal: 150000 },
      { product_name: "Mouse Inalámbrico", quantity: 1, subtotal: 6800 }
    ]
  },
  {
    id_order: "ORD-002",
    order_date: "2024-01-10",
    total: 89900,
    status: "En camino",
    payment_method: "Efectivo",
    productos: [
      { product_name: "Auriculares Bluetooth", quantity: 1, subtotal: 75000 },
      { product_name: "Funda Tablet", quantity: 1, subtotal: 14900 }
    ]
  },
  {
    id_order: "ORD-003", 
    order_date: "2024-01-05",
    total: 45200,
    status: "Procesando",
    payment_method: "Tarjeta",
    productos: [
      { product_name: "Cargador Rápido", quantity: 1, subtotal: 45200 }
    ]
  }
];