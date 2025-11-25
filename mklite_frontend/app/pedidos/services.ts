import { Pedido, pedidosEjemplo } from './types';

export class PedidoService {
  static async obtenerPedidosUsuario(userId?: string): Promise<Pedido[]> {
    // Simulación de API - luego reemplazar con fetch real
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(pedidosEjemplo);
      }, 500);
    });
  }

  static async obtenerPedidoPorId(id: string): Promise<Pedido | null> {
    const pedido = pedidosEjemplo.find(p => p.id_order === id);
    return pedido || null;
  }
}

// Funciones de formateo aquí también
export const formatearFecha = (fecha: string): string => {
  return new Date(fecha).toLocaleDateString('es-ES');
};

export const formatearMoneda = (monto: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP'
  }).format(monto);
};

export const getColorEstado = (estado: string): string => {
  switch (estado) {
    case 'Entregado': return 'bg-green-100 text-green-800';
    case 'En camino': return 'bg-blue-100 text-blue-800';
    case 'Procesando': return 'bg-yellow-100 text-yellow-800';
    case 'Cancelado': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};