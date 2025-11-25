// mklite_frontend/app/almacen/reposicion-stock/services.ts

import { Producto, AlertaStock, OrdenCompra, productosEjemplo } from './types';

// Simulación de API - luego reemplazar con fetch real
export class AlertaService {
  static async obtenerAlertasActivas(): Promise<AlertaStock[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const alertas: AlertaStock[] = productosEjemplo
          .filter(producto => producto.stock_actual <= producto.stock_minimo)
          .map(producto => ({
            id: `ALERT-${producto.id}`,
            producto,
            fecha_alerta: new Date().toISOString(),
            prioridad: this.calcularPrioridad(producto),
            estado: 'pendiente' as const
          }));
        resolve(alertas);
      }, 800);
    });
  }

  static async marcarAlertaComoProcesada(alertaId: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Alerta ${alertaId} marcada como procesada`);
        resolve();
      }, 300);
    });
  }

  private static calcularPrioridad(producto: Producto): 'alta' | 'media' | 'baja' {
    const porcentaje = (producto.stock_actual / producto.stock_minimo) * 100;

    if (producto.stock_actual === 0 || porcentaje <= 20) return 'alta';
    if (porcentaje <= 50) return 'media';
    return 'baja';
  }
}

export class OrdenCompraService {
  static async crearOrdenCompra(
    productoId: string, 
    cantidad: number, 
    proveedor: string
  ): Promise<OrdenCompra> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (cantidad <= 0) {
          reject(new Error('La cantidad debe ser mayor a 0'));
          return;
        }

        const producto = productosEjemplo.find(p => p.id === productoId);
        if (!producto) {
          reject(new Error('Producto no encontrado'));
          return;
        }

        const nuevaOrden: OrdenCompra = {
          id: `ORD-${Date.now()}`,
          producto_id: productoId,
          producto_nombre: producto.nombre,
          proveedor: proveedor,
          cantidad: cantidad,
          fecha_creacion: new Date().toISOString(),
          estado: 'pendiente' as const,
          total: producto.precio_compra ? producto.precio_compra * cantidad : undefined
        };

        console.log('Orden de compra creada:', nuevaOrden);
        resolve(nuevaOrden);
      }, 1000);
    });
  }

  static async obtenerHistorialOrdenes(): Promise<OrdenCompra[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([]);
      }, 500);
    });
  }

  static async cancelarOrden(ordenId: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Orden ${ordenId} cancelada`);
        resolve();
      }, 300);
    });
  }
}

export class StockService {
  static async obtenerProductosBajoStock(): Promise<Producto[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const productosBajoStock = productosEjemplo.filter(
          producto => producto.stock_actual <= producto.stock_minimo
        );
        resolve(productosBajoStock);
      }, 600);
    });
  }

  static async obtenerProveedores(): Promise<{ id: string; nombre: string }[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const proveedores = [
          { id: 'PROV-001', nombre: 'TecnoSupply' },
          { id: 'PROV-002', nombre: 'AccesoriosTech' },
          { id: 'PROV-003', nombre: 'AudioPro' },
          { id: 'PROV-004', nombre: 'ComponentesMX' }
        ];
        resolve(proveedores);
      }, 500);
    });
  }
}