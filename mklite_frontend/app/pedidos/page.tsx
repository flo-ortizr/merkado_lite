// app/pedidos/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Pedido, pedidosEjemplo } from './Pedido';
import './pedidomodule.css';

// Funciones de utilidad
const formatearFecha = (fecha: string): string => {
  return new Date(fecha).toLocaleDateString('es-ES');
};

const formatearMoneda = (monto: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP'
  }).format(monto);
};

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Simulación de servicio - definida dentro del useEffect
    const obtenerPedidosUsuario = async (): Promise<Pedido[]> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(pedidosEjemplo);
        }, 500);
      });
    };

    const cargarPedidos = async () => {
      try {
        const datosPedidos = await obtenerPedidosUsuario();
        setPedidos(datosPedidos);
      } catch (error) {
        console.error('Error cargando pedidos:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarPedidos();
  }, []); // Dependencias vacías

  // Cálculos para estadísticas
  const totalPedidos = pedidos.length;
  const pedidosEntregados = pedidos.filter(p => p.status === 'Entregado').length;
  const gastoTotal = pedidos.reduce((total, pedido) => total + pedido.total, 0);

  if (cargando) {
    return (
      <div className="loadingContainer">
        <div className="loadingContent">
          <div className="spinner"></div>
          <p className="loadingText">Cargando tus pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pedidosContainer">
      <div className="pedidosContent">
        {/* Header */}
        <div className="pedidosHeader">
          <Link href="/" className="backLink">
            ← Volver al inicio
          </Link>
          <h1 className="title">Mi Historial de Pedidos</h1>
          <p className="subtitle">Revisa tus compras anteriores</p>
        </div>

        {/* Lista de pedidos */}
        <div className="pedidosList">
          {pedidos.length === 0 ? (
            <div className="emptyState">
              <p className="emptyText">No tienes pedidos realizados</p>
              <Link href="/productos" className="ctaButton">
                Realizar mi primera compra
              </Link>
            </div>
          ) : (
            pedidos.map((pedido) => {
              const nombresProductos = pedido.productos.map(p => p.product_name).join(', ');
              const estadoClass = `estadoBadge ${
                pedido.status === 'Entregado' ? 'estadoEntregado' :
                pedido.status === 'En camino' ? 'estadoEnCamino' :
                pedido.status === 'Procesando' ? 'estadoProcesando' : 'estadoCancelado'
              }`;
              
              return (
                <div key={pedido.id_order} className="pedidoItem">
                  {/* Header del pedido */}
                  <div className="pedidoHeader">
                    <h2 className="pedidoNumber">Pedido #{pedido.id_order}</h2>
                    <span className={estadoClass}>{pedido.status}</span>
                  </div>

                  {/* Productos */}
                  <p className="productosList">{nombresProductos}</p>

                  {/* Información del pedido */}
                  <div className="pedidoInfo">
                    <div className="infoRow infoFecha">
                      <span className="icon">📞</span>
                      <span>{formatearFecha(pedido.order_date)}</span>
                    </div>
                    <div className="infoRow infoMonto">
                      <span className="icon">📞</span>
                      <span>{formatearMoneda(pedido.total)}</span>
                    </div>
                  </div>

                  {/* Separador */}
                  <div className="separador"></div>

                  {/* Botones de acción */}
                  <div className="acciones">
                    <button className="btnDetalle">
                      <span className="icon">📞</span>
                      Ver detalles
                    </button>
                    <button className="btnComprar">
                      Volver a comprar
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Separador final */}
        <div className="separadorFinal"></div>

        {/* Estadísticas */}
        <div className="estadisticas">
          <div className="statItem">
            <p className="statLabel">Total de pedidos</p>
            <p className="statValue">{totalPedidos}</p>
          </div>
          <div className="statItem">
            <p className="statLabel">Pedidos entregados</p>
            <p className="statValue">{pedidosEntregados}</p>
          </div>
          <div className="statItem">
            <p className="statLabel">Gasto total</p>
            <p className="statValue statGasto">{formatearMoneda(gastoTotal)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}