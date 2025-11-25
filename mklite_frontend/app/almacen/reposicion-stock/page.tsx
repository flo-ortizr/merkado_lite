// frontend/app/almacen/reposicion-stock/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Producto, AlertaStock } from './types';
import { AlertaService, OrdenCompraService } from './services';
import stylesAlertas from './alertas.module.css';
import stylesOrdenes from './ordenes.module.css';

export default function ReposicionStockPage() {
  const [alertas, setAlertas] = useState<AlertaStock[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
  const [cantidadPedido, setCantidadPedido] = useState<number>(0);
  const [mostrarModal, setMostrarModal] = useState<boolean>(false);
  const [mensaje, setMensaje] = useState<string>('');
  const [cargando, setCargando] = useState<boolean>(true);

  // Cargar alertas al montar el componente
  useEffect(() => {
    cargarAlertas();
  }, []);

  const cargarAlertas = async () => {
    try {
      setCargando(true);
      const alertasData = await AlertaService.obtenerAlertasActivas();
      setAlertas(alertasData);
    } catch (error) {
      console.error('Error cargando alertas:', error);
      setMensaje('Error al cargar las alertas de stock');
    } finally {
      setCargando(false);
    }
  };

  // Abrir modal para pedir stock
  const abrirModalPedido = (producto: Producto) => {
    setProductoSeleccionado(producto);
    setCantidadPedido(producto.stock_minimo - producto.stock_actual);
    setMostrarModal(true);
    setMensaje('');
  };

  // Cerrar modal
  const cerrarModal = () => {
    setMostrarModal(false);
    setProductoSeleccionado(null);
    setCantidadPedido(0);
    setMensaje('');
  };

  // Procesar pedido de stock
  const procesarPedido = async () => {
    if (!productoSeleccionado || cantidadPedido <= 0) {
      setMensaje('Por favor ingresa una cantidad válida');
      return;
    }

    try {
      setMensaje('Generando orden de compra...');
      
      const orden = await OrdenCompraService.crearOrdenCompra(
        productoSeleccionado.id,
        cantidadPedido,
        productoSeleccionado.proveedor
      );

      // Marcar la alerta como procesada
      const alertaId = `ALERT-${productoSeleccionado.id}`;
      await AlertaService.marcarAlertaComoProcesada(alertaId);

      setMensaje(`✅ Orden ${orden.id} generada para ${cantidadPedido} unidades de ${productoSeleccionado.nombre}`);
      
      // Recargar alertas para reflejar el cambio
      setTimeout(() => {
        cargarAlertas();
        cerrarModal();
      }, 2000);

    } catch (error) {
      console.error('Error generando orden:', error);
      setMensaje(`❌ Error: ${error instanceof Error ? error.message : 'No se pudo generar la orden'}`);
    }
  };

  // Obtener clase CSS según la prioridad
  const getAlertaCardClass = (prioridad: string) => {
    switch (prioridad) {
      case 'alta':
        return stylesAlertas.alertaCardAlta;
      case 'media':
        return stylesAlertas.alertaCardMedia;
      case 'baja':
        return stylesAlertas.alertaCardBaja;
      default:
        return '';
    }
  };

  // Obtener icono según la prioridad
  const getIconoPrioridad = (prioridad: string) => {
    switch (prioridad) {
      case 'alta': return '🔴';
      case 'media': return '🟡';
      case 'baja': return '🔵';
      default: return '⚪';
    }
  };

  return (
    <div className="min-h-screen bg-rose-50 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Sistema de Reposición de Stock</h1>
          <p className="text-gray-600 mt-2">Monitoreo y gestión de inventario</p>
        </div>

        {/* FH11: Alertas de Stock Mínimo */}
        <div className={stylesAlertas.container}>
          <div className={stylesAlertas.header}>
            <h2 className={stylesAlertas.title}>Alertas de Stock Mínimo</h2>
            {!cargando && (
              <span className={stylesAlertas.contadorAlertas}>
                {alertas.length} alertas activas
              </span>
            )}
          </div>

          {cargando ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
              <p className="text-gray-500 mt-4">Cargando alertas...</p>
            </div>
          ) : alertas.length === 0 ? (
            <div className={stylesAlertas.emptyState}>
              <div className={stylesAlertas.emptyIcon}>🎉</div>
              <p className={stylesAlertas.emptyText}>No hay alertas de stock activas</p>
              <p className={stylesAlertas.emptySubtext}>Todo el inventario está en niveles óptimos</p>
            </div>
          ) : (
            <div className={stylesAlertas.alertaList}>
              {alertas.map((alerta) => (
                <div 
                  key={alerta.id}
                  className={`${stylesAlertas.alertaCard} ${getAlertaCardClass(alerta.prioridad)}`}
                >
                  <div className={stylesAlertas.alertaContent}>
                    <div className={stylesAlertas.alertaInfo}>
                      <span className={stylesAlertas.alertaIcon}>
                        {getIconoPrioridad(alerta.prioridad)}
                      </span>
                      <div className={stylesAlertas.alertaDetails}>
                        <h3>{alerta.producto.nombre}</h3>
                        <p>
                          Stock actual: <strong>{alerta.producto.stock_actual}</strong> | 
                          Mínimo requerido: <strong>{alerta.producto.stock_minimo}</strong>
                        </p>
                        <p>
                          Proveedor: {alerta.producto.proveedor}
                          {alerta.producto.categoria && ` | Categoría: ${alerta.producto.categoria}`}
                        </p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => abrirModalPedido(alerta.producto)}
                      className={stylesAlertas.btnPedirStock}
                    >
                      Pedir Stock
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FH12: Modal para Orden de Compra */}
        {mostrarModal && productoSeleccionado && (
          <div className={stylesOrdenes.modalOverlay}>
            <div className={stylesOrdenes.modalContent}>
              <div className={stylesOrdenes.modalHeader}>
                <h3 className={stylesOrdenes.modalTitle}>
                  Orden de Compra
                </h3>
                <button
                  onClick={cerrarModal}
                  className={stylesOrdenes.btnCerrar}
                >
                  ×
                </button>
              </div>

              <div className={stylesOrdenes.productoInfo}>
                <h4 className={stylesOrdenes.productoNombre}>{productoSeleccionado.nombre}</h4>
                <div className={stylesOrdenes.productoGrid}>
                  <div className={stylesOrdenes.productoItem}>
                    <span className={stylesOrdenes.productoLabel}>Stock actual:</span>
                    <span className={stylesOrdenes.productoValor}>{productoSeleccionado.stock_actual}</span>
                  </div>
                  <div className={stylesOrdenes.productoItem}>
                    <span className={stylesOrdenes.productoLabel}>Stock mínimo:</span>
                    <span className={stylesOrdenes.productoValor}>{productoSeleccionado.stock_minimo}</span>
                  </div>
                  <div className={stylesOrdenes.productoItem}>
                    <span className={stylesOrdenes.productoLabel}>Proveedor:</span>
                    <span className={stylesOrdenes.productoValor}>{productoSeleccionado.proveedor}</span>
                  </div>
                  <div className={stylesOrdenes.productoItem}>
                    <span className={stylesOrdenes.productoLabel}>Faltan:</span>
                    <span className={`${stylesOrdenes.productoValor} ${stylesOrdenes.productoValorFaltan}`}>
                      {productoSeleccionado.stock_minimo - productoSeleccionado.stock_actual}
                    </span>
                  </div>
                </div>
              </div>

              <div className={stylesOrdenes.formGroup}>
                <label className={stylesOrdenes.formLabel}>
                  Cantidad a pedir:
                </label>
                <input
                  type="number"
                  min="1"
                  value={cantidadPedido}
                  onChange={(e) => setCantidadPedido(Number(e.target.value))}
                  className={stylesOrdenes.formInput}
                  placeholder="Ingresa la cantidad"
                />
              </div>

              {mensaje && (
                <div className={`${stylesOrdenes.mensaje} ${
                  mensaje.includes('✅') || mensaje.includes('generando') 
                    ? stylesOrdenes.mensajeExito 
                    : stylesOrdenes.mensajeError
                }`}>
                  {mensaje}
                </div>
              )}

              <div className={stylesOrdenes.modalActions}>
                <button
                  onClick={cerrarModal}
                  className={stylesOrdenes.btnCancelar}
                  disabled={mensaje.includes('generando')}
                >
                  Cancelar
                </button>
                <button
                  onClick={procesarPedido}
                  className={stylesOrdenes.btnGenerar}
                  disabled={mensaje.includes('generando')}
                >
                  {mensaje.includes('generando') ? 'Generando...' : 'Generar Orden'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Información adicional */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Resumen del Sistema</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl mb-2">📊</div>
              <div className="font-bold">Monitoreo Automático</div>
              <div className="text-gray-600">Sistema revisa stock 24/7</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl mb-2">⚠️</div>
              <div className="font-bold">Alertas Inteligentes</div>
              <div className="text-gray-600">Notificaciones por prioridad</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl mb-2">🚀</div>
              <div className="font-bold">Pedidos Rápidos</div>
              <div className="text-gray-600">Órdenes en 2 clics</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}