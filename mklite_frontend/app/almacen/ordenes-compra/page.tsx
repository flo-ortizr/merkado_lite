'use client';

import React, { useState, useMemo } from 'react';
const MENU_OPTIONS = [
  
  { 
    label: 'Alertas', 
    path: '/almacen/alertas', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
      </svg>
    ) 
  },
  { 
    label: 'Inventario', 
    path: '/almacen/inventario', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10m-4-6h8m-4 0v-4"></path>
      </svg>
    ) 
  },
  { 
    label: 'Reposición Stock', 
    path: '/almacen/reposicion-stock', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 0020 8h-2.22l-.123-.382a8.04 8.04 0 00-15.658 0L4.22 8H20v2m-6-10v5m-6-5v5m-4 2l4 4m6-4l-4 4"></path>
      </svg>
    ) 
  },
  { 
    label: 'Vencidos', 
    path: '/almacen/vencidos', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
      </svg>
    ) 
  },
  { 
    label: 'Órdenes de Compra', 
    path: '/almacen/ordenes-compra', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
      </svg>
    ) 
  },
];


const SidebarMenu = ({ menuOptions, activePath }) => {
  return (
    <nav className="flex flex-col space-y-2">
      {menuOptions.map((item) => (
        <a
          key={item.path}
          href={item.path}
          className={`
            flex items-center px-4 py-3 rounded-lg
            text-sm font-medium transition-colors duration-200
            ${
              item.path === activePath || item.isActive
                ? 'bg-gray-700 text-gray-100'
                : 'text-gray-300 hover:bg-gray-600 hover:text-gray-100'
            }
          `}
        >
          <span className="mr-3">{item.icon}</span>
          {item.label}
        </a>
      ))}
    </nav>
  );
};

// =================================================================
// 1. CONSTANTES Y DATOS MOCKEADOS
// =================================================================

const ENCARGADO_ALMACEN = "Ana Gómez";
const CURRENT_DATE = new Date().toLocaleDateString('es-CL', { year: 'numeric', month: '2-digit', day: '2-digit' });

const SUPPLIERS = [
    { id: 'PROV001', name: 'Bebidas del Sur S.A.' },
    { id: 'PROV002', name: 'Granos y Aceites Ltda.' },
    { id: 'PROV003', name: 'Embotelladora Sol' },
];

const PRODUCTS = [
    { id: 'SKU001', name: 'Coca-Cola Clásica (Caja 12x1L)', unitPrice: 15.00 },
    { id: 'SKU002', name: 'Fanta Naranja (Pack 6x355ml)', unitPrice: 5.50 },
    { id: 'SKU003', name: 'Jugo Del Valle (Caja 1L)', unitPrice: 8.00 },
    { id: 'SKU004', name: 'Leche URT (Litro)', unitPrice: 2.20 },
    { id: 'SKU005', name: 'Arroz Blanco (1kg)', unitPrice: 1.50 },
];

const ORDER_STATUS = {
    PENDIENTE: 'Pendiente',
    ENVIADA: 'Enviada',
    RECIBIDA: 'Recibida',
    ANULADA: 'Anulada',
};

// Mapeo de estados a colores de Tailwind. Mantener estos colores para la semántica de estado.
const STATUS_COLORS = {
    [ORDER_STATUS.PENDIENTE]: 'bg-yellow-600 text-yellow-100',
    [ORDER_STATUS.ENVIADA]: 'bg-indigo-600 text-indigo-100', // Azul Oscuro para Enviada
    [ORDER_STATUS.RECIBIDA]: 'bg-green-600 text-green-100',
    [ORDER_STATUS.ANULADA]: 'bg-red-800 text-red-100', // Rojo Oscuro para Anulada
};

// Órdenes de compra simuladas
const MOCK_ORDERS_DB = [
    { id: 'OC-2024-001', date: '2024-10-20', supplier: 'Bebidas del Sur S.A.', total: 450.00, status: ORDER_STATUS.RECIBIDA },
    { id: 'OC-2024-002', date: '2024-10-25', supplier: 'Granos y Aceites Ltda.', total: 120.50, status: ORDER_STATUS.ENVIADA },
    { id: 'OC-2024-003', date: '2024-11-01', supplier: 'Embotelladora Sol', total: 95.00, status: ORDER_STATUS.PENDIENTE },
];

// =================================================================
// 2. COMPONENTE PRINCIPAL: GestionOrdenesCompra
// =================================================================

const GestionOrdenesCompra = () => {
    // Estado para la nueva orden que se está creando
    const [orders, setOrders] = useState(MOCK_ORDERS_DB);
    const [selectedSupplier, setSelectedSupplier] = useState('');
    const [orderDetail, setOrderDetail] = useState([]); // Array de { skuId, name, quantity, unitPrice, total }
    const [message, setMessage] = useState('');
 const [activePath, setActivePath] = useState('/almacen/productos');
    // Estado para agregar un nuevo producto al detalle
    const [newProductSku, setNewProductSku] = useState('');
    const [newQuantity, setNewQuantity] = useState(1);

    // Calcular el total de la orden en tiempo real
    const orderTotal = useMemo(() => {
        return orderDetail.reduce((sum, item) => sum + item.total, 0).toFixed(2);
    }, [orderDetail]);

    // Función para obtener el producto seleccionado en el dropdown
    const selectedProduct = useMemo(() => {
        return PRODUCTS.find(p => p.id === newProductSku);
    }, [newProductSku]);

    // --- Lógica de la Nueva Orden ---

    const handleAddProduct = () => {
        if (!selectedProduct || newQuantity <= 0) {
            setMessage('ERROR: Seleccione un producto y una cantidad válida.');
            return;
        }

        const existingItemIndex = orderDetail.findIndex(item => item.skuId === newProductSku);

        const itemToAdd = {
            skuId: selectedProduct.id,
            name: selectedProduct.name,
            quantity: newQuantity,
            unitPrice: selectedProduct.unitPrice,
            total: newQuantity * selectedProduct.unitPrice,
        };

        if (existingItemIndex > -1) {
            // Si el producto ya existe, actualiza la cantidad y el total
            const updatedDetail = [...orderDetail];
            updatedDetail[existingItemIndex] = {
                ...updatedDetail[existingItemIndex],
                quantity: updatedDetail[existingItemIndex].quantity + newQuantity,
                total: (updatedDetail[existingItemIndex].quantity + newQuantity) * selectedProduct.unitPrice,
            };
            setOrderDetail(updatedDetail);
        } else {
            // Si es un producto nuevo, añádelo
            setOrderDetail([...orderDetail, itemToAdd]);
        }

        // Resetear inputs para el siguiente producto
        setNewProductSku('');
        setNewQuantity(1);
        setMessage('');
    };

    const handleRemoveProduct = (skuId) => {
        setOrderDetail(orderDetail.filter(item => item.skuId !== skuId));
    };

    const handleSubmitOrder = () => {
        if (!selectedSupplier) {
            setMessage('ERROR: Debe seleccionar un proveedor.');
            return;
        }
        if (orderDetail.length === 0) {
            setMessage('ERROR: La orden de compra no puede estar vacía.');
            return;
        }

        setMessage('Creando orden de compra...');

        // Simulación de creación de ID y guardado
        setTimeout(() => {
            const newOrderId = `OC-${new Date().getFullYear()}-${orders.length + 1}`;
            const supplierName = SUPPLIERS.find(s => s.id === selectedSupplier)?.name || 'Desconocido';

            const newOrder = {
                id: newOrderId,
                date: CURRENT_DATE,
                supplier: supplierName,
                total: parseFloat(orderTotal),
                status: ORDER_STATUS.PENDIENTE,
                details: orderDetail,
            };

            setOrders([newOrder, ...orders]);
            
            // Resetear el formulario de creación
            setSelectedSupplier('');
            setOrderDetail([]);
            setNewProductSku('');
            setNewQuantity(1);

            setMessage(`ÉXITO: Orden de Compra ${newOrderId} creada y en estado Pendiente.`);
        }, 1000);
    };
    
    // --- Componentes Reutilizables ---

    const StatusBadge = ({ status }) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[status] || 'bg-gray-500 text-white'}`}>
            {status}
        </span>
    );
    
    // --- Renderizado de la Interfaz ---

    return (
  <div className="min-h-screen p-6 bg-gray-900 text-gray-100 font-sans flex justify-center items-start">
    <div className="w-full max-w-7xl flex gap-8">

      {/* Menu lateral */}
      <div className="lg:w-1/6 p-4 bg-gray-900 rounded-lg shadow-inner flex flex-col flex-shrink-0">
        <h2 className="text-lg font-semibold mb-5 text-gray-300 border-b border-gray-700 pb-3">Menú</h2>
        <SidebarMenu menuOptions={MENU_OPTIONS} activePath={activePath} />
      </div>

      {/* Contenido Principal */}
      <div className="flex-1 bg-gray-800 rounded-xl shadow-2xl p-8 flex flex-col">

        {/* Header Principal */}
        <header className="mb-8 flex justify-between items-center border-b border-gray-700 pb-4">
          <h1 className="text-3xl font-extrabold text-red-600 flex items-center">
            <svg className="w-8 h-8 mr-3" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 17H7v-2h10v2zm0-4H7v-2h10v2zm0-4H7V7h10v2zm4-3v14c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2zM9 16h6v-2H9zM9 12h6v-2H9v2zM9 8h6V6H9v2z"></path>
            </svg>
            Gestión de Órdenes de Compra
          </h1>
          <div className="text-sm text-gray-400">
            <span className="mr-4">Encargado: <span className="font-semibold text-white">{ENCARGADO_ALMACEN}</span></span>
            <span className="font-semibold text-white">Fecha: {CURRENT_DATE}</span>
          </div>
        </header>

        {/* Contenido Principal: Creación y Listado */}
        <div className="flex flex-col lg:flex-row gap-8 min-h-[60vh]">
          {/* Columna Izquierda: Crear Nueva Orden */}
          <div className="lg:w-3/5 p-5 bg-gray-900 rounded-lg shadow-inner flex flex-col">
            <h2 className="text-xl font-bold mb-4 text-white border-b border-gray-700 pb-2">Crear Nueva Orden de Compra</h2>

            {/* Selector de Proveedor */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-400 mb-1">Proveedor (Supplier)</label>
              <select
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
                className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-red-500 focus:border-red-500 text-sm appearance-none"
              >
                <option value="">Seleccione un Proveedor...</option>
                {SUPPLIERS.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Selector de Productos y Cantidad */}
            <div className="mb-4 p-4 bg-gray-700 rounded-lg border border-gray-600">
              <label className="block text-sm font-medium text-gray-300 mb-2">Agregar Producto</label>
              <div className="flex space-x-3">
                <select
                  value={newProductSku}
                  onChange={(e) => setNewProductSku(e.target.value)}
                  className="flex-grow p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-green-500 focus:border-green-500 text-sm appearance-none"
                >
                  <option value="">Producto</option>
                  {PRODUCTS.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (${p.unitPrice.toFixed(2)})</option>
                  ))}
                </select>
                <input
                  type="number"
                  min="1"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(parseInt(e.target.value) || 1)}
                  placeholder="Qty"
                  className="w-20 p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-green-500 focus:border-green-500 text-center"
                />
                <button
                  onClick={handleAddProduct}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
                >
                  +
                </button>
              </div>
            </div>

            {/* Detalle de la Orden */}
            <h3 className="text-lg font-bold text-gray-300 mb-3">Detalle del Pedido ({orderDetail.length} items)</h3>
            <div className="flex-grow overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 h-64 mb-4">
              {orderDetail.length === 0 ? (
                <p className="text-gray-500 italic text-center py-4">Aún no hay productos agregados.</p>
              ) : (
                <table className="min-w-full text-sm text-left text-gray-200">
                  <thead className="text-xs text-gray-400 uppercase bg-gray-700 sticky top-0">
                    <tr>
                      <th className="px-3 py-2">Producto</th>
                      <th className="px-3 py-2 text-center">Cant.</th>
                      <th className="px-3 py-2 text-right">Precio/U</th>
                      <th className="px-3 py-2 text-right">Total</th>
                      <th className="px-3 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetail.map(item => (
                      <tr key={item.skuId} className="border-b border-gray-700 hover:bg-gray-700/50">
                        <td className="px-3 py-2 font-semibold">{item.name}</td>
                        <td className="px-3 py-2 text-center">{item.quantity}</td>
                        <td className="px-3 py-2 text-right">${item.unitPrice.toFixed(2)}</td>
                        <td className="px-3 py-2 text-right">${item.total.toFixed(2)}</td>
                        <td className="px-3 py-2 text-right">
                          <button onClick={() => handleRemoveProduct(item.skuId)} className="text-red-500 hover:text-red-400">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 10-2 0v6a1 1 0 102 0V8z" clipRule="evenodd"></path></svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Totales y Botón de Creación */}
            <div className="mt-auto pt-4 border-t border-gray-700">
              <div className="flex justify-between items-center text-xl font-extrabold mb-4">
                <span>TOTAL DE LA ORDEN:</span>
                <span className="text-red-400">${orderTotal}</span>
              </div>
              <button
                onClick={handleSubmitOrder}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition duration-300 disabled:bg-gray-600 disabled:text-gray-400"
                disabled={!selectedSupplier || orderDetail.length === 0}
              >
                GENERAR ORDEN DE COMPRA PENDIENTE
              </button>
            </div>
          </div>

          {/* Columna Derecha: Historial de Órdenes */}
          <div className="lg:w-2/5 p-5 bg-gray-900 rounded-lg shadow-inner flex flex-col">
            <h2 className="text-xl font-bold mb-4 text-white border-b border-gray-700 pb-2">Historial de Órdenes</h2>

            <div className="flex-grow overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
              <table className="min-w-full table-auto text-sm text-left text-gray-200">
                <thead className="text-xs text-gray-400 uppercase bg-gray-700 sticky top-0 z-10">
                  <tr>
                    <th scope="col" className="px-4 py-3">ID Orden</th>
                    <th scope="col" className="px-4 py-3">Proveedor</th>
                    <th scope="col" className="px-4 py-3 text-right">Total</th>
                    <th scope="col" className="px-4 py-3 text-center">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                      <td className="px-4 py-3 font-semibold text-red-300">{order.id}</td>
                      <td className="px-4 py-3">{order.supplier}</td>
                      <td className="px-4 py-3 text-right">${order.total.toFixed(2)}</td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge status={order.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Mensajes del Sistema */}
        {message && (
          <p className={`mt-6 p-3 text-center rounded-lg font-semibold ${message.startsWith('ERROR:') ? 'bg-red-900 text-red-200' : 'bg-green-900 text-green-200'}`}>
            {message}
          </p>
        )}

        {/* Footer del Sistema */}
        <footer className="mt-6 pt-4 border-t border-gray-700 text-sm text-gray-500 flex justify-end">
          <span>El sistema actualiza el inventario automáticamente al recibir la orden.</span>
        </footer>

      </div>
    </div>
  </div>
);

};

export default GestionOrdenesCompra;