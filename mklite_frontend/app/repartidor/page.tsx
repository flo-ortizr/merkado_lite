'use client';

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
// =================================================================
// 1. CONSTANTES Y DATOS MOCKEADOS (Simulando BBDD de Pedidos y Productos)
// =================================================================

const REPARTIDOR_ID = "Luis Fernández";                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
const MOCK_DATE = new Date().toISOString().split('T')[0];

const ORDER_STATUS_OPTIONS = {
    PENDIENTE: 'Pendiente',
    EN_CAMINO: 'En Camino',
    ENTREGADO: 'Entregado',
    CANCELADO: 'Cancelado',
};

// Pedidos mockeados para el repartidor
const MOCK_ORDERS_DB = [
    {
        id: 'REP2023-11-20-007',
        client: 'Ana Torres',
        address: 'Calle Falsa 123',
        status: ORDER_STATUS_OPTIONS.EN_CAMINO,
        items: [
            { id: 'SKU001', name: 'Coca-Cola (600ml)', quantity: 3 },
            { id: 'SKU003', name: 'Fanta Naranja (600ml)', quantity: 2 },
            { id: 'SKU005', name: 'Paquete Galletas', quantity: 1 },
        ],
        notes: 'Llamar al llegar',
        incidences: [],
        deliveryAttempts: 1,
    },
    {
        id: 'REP2023-11-20-008',
        client: 'Roberto Gámez',
        address: 'Av. Siempre Viva 742',
        status: ORDER_STATUS_OPTIONS.PENDIENTE,
        items: [
            { id: 'SKU002', name: 'Sprite (600ml)', quantity: 4 },
            { id: 'SKU006', name: 'Snack Papas', quantity: 2 },
        ],
        notes: '',
        incidences: [],
        deliveryAttempts: 0,
    },
    {
        id: 'REP2023-11-20-009',
        client: 'Sofía Montaño',
        address: 'Calle Principal 456',
        status: ORDER_STATUS_OPTIONS.ENTREGADO,
        items: [
            { id: 'SKU004', name: 'Agua Mineral (1L)', quantity: 6 },
        ],
        notes: 'Dejar en portería',
        incidences: [],
        deliveryAttempts: 1,
    },
    {
        id: 'REP2023-11-20-010',
        client: 'Miguel Pardo',
        address: 'Calle Secundaria 789',
        status: ORDER_STATUS_OPTIONS.CANCELADO,
        items: [
            { id: 'SKU001', name: 'Coca-Cola (600ml)', quantity: 2 },
        ],
        notes: '',
        incidences: ['Cliente no contesta', 'Dirección incorrecta'],
        deliveryAttempts: 2,
    },
];

// Inventario simulado (para devolver stock en caso de cancelación)
const MOCK_INVENTORY_DB = [
    { id: 'SKU001', name: 'Coca-Cola (600ml)', stock: 50 },
    { id: 'SKU002', name: 'Sprite (600ml)', stock: 30 },
    { id: 'SKU003', name: 'Fanta Naranja (600ml)', stock: 25 },
    { id: 'SKU004', name: 'Agua Mineral (1L)', stock: 100 },
    { id: 'SKU005', name: 'Paquete Galletas', stock: 60 },
    { id: 'SKU006', name: 'Snack Papas', stock: 40 },
];

// =================================================================
// 2. COMPONENTE PRINCIPAL: GestionPedidosRepartidor
// =================================================================

const GestionPedidosRepartidor = () => {
    const [orders, setOrders] = useState(MOCK_ORDERS_DB);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [incidences, setIncidences] = useState('');
    const [message, setMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Función para obtener el color de la etiqueta de estado
    const getStatusTagColor = (status) => {
        switch (status) {
            case ORDER_STATUS_OPTIONS.EN_CAMINO:
                return 'bg-orange-500';
            case ORDER_STATUS_OPTIONS.ENTREGADO:
                return 'bg-green-600';
            case ORDER_STATUS_OPTIONS.CANCELADO:
                return 'bg-red-700';
            case ORDER_STATUS_OPTIONS.PENDIENTE:
                return 'bg-blue-500';
            default:
                return 'bg-gray-500';
        }
    };
const router = useRouter();
    // Al seleccionar un pedido de la lista
    const handleSelectOrder = useCallback((order) => {
        setSelectedOrder(order);
        setNewStatus(''); // Resetear el estado para el nuevo pedido
        setIncidences(order.incidences.join(', ') || '');
        setMessage('');
    }, []);

    // Actualizar el estado del pedido (ENTREGADO o CANCELADO)
    const handleUpdateStatus = useCallback(async (status) => {
        if (!selectedOrder || isProcessing) return;

        // Validaciones específicas para cada estado
        if (status === ORDER_STATUS_OPTIONS.ENTREGADO) {
            if (selectedOrder.status === ORDER_STATUS_OPTIONS.ENTREGADO) {
                setMessage('ALERTA: Este pedido ya ha sido entregado.');
                return;
            }
        } else if (status === ORDER_STATUS_OPTIONS.CANCELADO) {
            if (selectedOrder.status === ORDER_STATUS_OPTIONS.CANCELADO) {
                setMessage('ALERTA: Este pedido ya ha sido cancelado.');
                return;
            }
            if (!incidences.trim()) {
                setMessage('ALERTA: Debe especificar las incidencias para una cancelación.');
                return;
            }
        } else { // Para "En Camino" o "Pendiente" desde el dropdown
            if (!newStatus) {
                setMessage('ALERTA: Debe seleccionar un nuevo estado para el pedido.');
                return;
            }
            status = newStatus; // Usar el estado seleccionado del dropdown
        }
        
        setIsProcessing(true);
        setMessage(`Procesando pedido ${selectedOrder.id} a estado "${status}"...`);
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simular latencia

        let updatedOrders = orders.map(order => {
            if (order.id === selectedOrder.id) {
                const updatedOrder = {
                    ...order,
                    status: status,
                    incidences: status === ORDER_STATUS_OPTIONS.CANCELADO ? incidences.split(',').map(s => s.trim()).filter(Boolean) : [],
                    deliveryAttempts: status === ORDER_STATUS_OPTIONS.EN_CAMINO && order.status === ORDER_STATUS_OPTIONS.PENDIENTE 
                                      ? order.deliveryAttempts + 1 
                                      : order.deliveryAttempts,
                };
                // Si es cancelación, devolver stock
                if (status === ORDER_STATUS_OPTIONS.CANCELADO) {
                    updatedOrder.items.forEach(item => {
                        const product = MOCK_INVENTORY_DB.find(p => p.id === item.id);
                        if (product) {
                            product.stock += item.quantity; // Devolver al inventario
                            console.log(`Stock de ${product.name} actualizado: +${item.quantity}. Nuevo stock: ${product.stock}`);
                        }
                    });
                }
                return updatedOrder;
            }
            return order;
        });

        setOrders(updatedOrders);
        setSelectedOrder(null); // Deseleccionar para forzar recarga visual
        setMessage(`ÉXITO: Pedido ${selectedOrder.id} actualizado a "${status}".`);
        setIsProcessing(false);
        setNewStatus('');
        setIncidences('');
    }, [selectedOrder, orders, newStatus, incidences, isProcessing]);

const handleLogout = () => {
        
        router.push('/'); 
    };
    return (
        <div className="min-h-screen p-6 bg-gray-900 text-gray-100 font-sans flex justify-center">
                       <button 
                onClick={handleLogout} 
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    fontSize: '14px',
                }}
            >
                Cerrar Sesión
            </button>
            <div className="w-full max-w-6xl bg-gray-800 rounded-xl shadow-2xl p-6">
                <header className="mb-6 flex justify-between items-center border-b border-red-700 pb-4">
                    <h1 className="text-3xl font-extrabold text-red-500 flex items-center">
                        <svg className="w-8 h-8 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-7 14H8v-4h4v4zm5 0h-4v-4h4v4zm0-6h-4V7h4v4z"></path></svg>
                        Gestión de Pedidos Asignados
                    </h1>
                    <div className="text-sm text-gray-400">
                        <span className="mr-4">Repartidor: {REPARTIDOR_ID}</span>
                        <span className="font-semibold text-white">Fecha: {MOCK_DATE}</span>
                    </div>
                </header>

                {/* Contenedor Principal: Pedidos y Detalle */}
                <div className="flex flex-col lg:flex-row gap-6 h-[70vh]">
                    
                    {/* Columna Izquierda: Lista de Pedidos Asignados */}
                    <div className="lg:w-2/5 p-4 bg-gray-900 rounded-lg shadow-inner flex flex-col">
                        <h2 className="text-xl font-bold mb-4 text-red-500">Pedidos Asignados</h2>
                        
                        {/* Encabezado de la lista */}
                        <div className="grid grid-cols-5 gap-2 text-xs font-bold text-gray-400 border-b border-gray-700 pb-2 mb-2">
                            <span className="col-span-4">ID / Cliente / Dirección</span>
                            <span className="col-span-1 text-right">Estado</span>
                        </div>

                        {/* Lista de Pedidos (Scrollable) */}
                        <div className="overflow-y-auto space-y-3 flex-1 pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                            {orders.length === 0 ? (
                                <p className="text-gray-500 italic text-center py-4">No tienes pedidos asignados actualmente.</p>
                            ) : (
                                orders.map(order => (
                                    <div 
                                        key={order.id}
                                        onClick={() => handleSelectOrder(order)}
                                        className={`p-3 rounded-lg cursor-pointer transition duration-150 border ${
                                            selectedOrder?.id === order.id ? 'border-red-500 bg-gray-700 shadow-md' : 'border-gray-700 hover:bg-gray-700'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1 pr-2">
                                                <span className="font-semibold text-base block text-white">{order.id}</span>
                                                <span className="text-sm text-gray-300 block">Cliente: {order.client}</span>
                                                <span className="text-xs text-gray-400 block truncate">Dirección: {order.address}</span>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusTagColor(order.status)} text-white`}>
                                                    {order.status.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Mensaje de estado */}
                        {message && (
                            <p className={`mt-4 text-sm font-bold p-3 rounded-lg flex-shrink-0 ${message.startsWith('ALERTA:') ? 'bg-red-800 text-red-200' : 'bg-green-800 text-green-200'}`}>
                                {message}
                            </p>
                        )}
                    </div>

                    {/* Columna Derecha: Detalle y Acciones del Pedido */}
                    <div className="lg:w-3/5 p-4 bg-gray-900 rounded-lg shadow-inner flex flex-col">
                        <h2 className="text-xl font-bold mb-4 text-red-500 flex-shrink-0">Detalle y Acciones</h2>
                        
                        {selectedOrder ? (
                            <>
                                {/* Estado Actual del Pedido */}
                                <div className="mb-4 p-3 rounded-lg flex justify-end items-center text-lg font-bold bg-gray-700">
                                    <span className={`text-white px-4 py-2 rounded-full text-base ${getStatusTagColor(selectedOrder.status)}`}>
                                        {selectedOrder.status.toUpperCase()}
                                    </span>
                                </div>

                                {/* Detalles del Pedido */}
                                <div className="mb-4 p-4 bg-gray-700 rounded-lg text-sm flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                                    <h3 className="font-bold text-red-400 mb-2 text-base">Productos:</h3>
                                    <ul className="list-disc list-inside text-gray-200 mb-3 text-sm">
                                        {selectedOrder.items.map(item => (
                                            <li key={item.id}>{item.name} - x{item.quantity}</li>
                                        ))}
                                    </ul>
                                    <p className="text-gray-200 mb-1 text-sm"><span className="font-bold text-red-400">Notas del cliente:</span> {selectedOrder.notes || 'N/A'}</p>
                                    <p className="text-gray-200 text-sm"><span className="font-bold text-red-400">Intentos de entrega:</span> {selectedOrder.deliveryAttempts}</p>
                                    {selectedOrder.incidences.length > 0 && (
                                        <p className="text-red-300 text-sm"><span className="font-bold">Incidencias previas:</span> {selectedOrder.incidences.join(', ')}</p>
                                    )}
                                </div>

                                {/* Actualizar Estado del Pedido */}
                                <div className="mt-4 pt-4 border-t border-gray-700 flex-shrink-0">
                                    <h3 className="font-bold text-red-400 mb-3 text-base">Actualizar Estado del Pedido</h3>
                                    
                                    {/* Selector de estado */}
                                    <select
                                        value={newStatus}
                                        onChange={(e) => setNewStatus(e.target.value)}
                                        className="w-full p-3 mb-3 bg-gray-700 text-white rounded-lg focus:ring-red-500 focus:border-red-500 text-sm"
                                        disabled={isProcessing || selectedOrder.status === ORDER_STATUS_OPTIONS.ENTREGADO || selectedOrder.status === ORDER_STATUS_OPTIONS.CANCELADO}
                                    >
                                        <option value="">Seleccione Nuevo Estado...</option>
                                        {Object.values(ORDER_STATUS_OPTIONS).map(status => (
                                            // Solo mostrar estados relevantes para actualización manual por el repartidor
                                            (status === ORDER_STATUS_OPTIONS.EN_CAMINO || status === ORDER_STATUS_OPTIONS.PENDIENTE) && 
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>

                                    {/* Campo de notas/incidencias */}
                                    <textarea
                                        value={incidences}
                                        onChange={(e) => setIncidences(e.target.value)}
                                        placeholder="Notas/Incidencias (Obligatorio para cancelación)"
                                        rows="2"
                                        className="w-full p-3 mb-4 bg-gray-700 text-white rounded-lg focus:ring-red-500 focus:border-red-500 text-sm"
                                        disabled={isProcessing || selectedOrder.status === ORDER_STATUS_OPTIONS.ENTREGADO || selectedOrder.status === ORDER_STATUS_OPTIONS.CANCELADO}
                                    />

                                    {/* Botones de acción */}
                                    <div className="flex justify-between space-x-2">
                                        <button
                                            onClick={() => handleUpdateStatus(ORDER_STATUS_OPTIONS.ENTREGADO)}
                                            disabled={isProcessing || selectedOrder.status === ORDER_STATUS_OPTIONS.ENTREGADO || selectedOrder.status === ORDER_STATUS_OPTIONS.CANCELADO}
                                            className={`flex-1 px-4 py-3 rounded-lg font-extrabold text-white text-sm transition-all duration-300 ${
                                                !isProcessing && selectedOrder.status !== ORDER_STATUS_OPTIONS.ENTREGADO && selectedOrder.status !== ORDER_STATUS_OPTIONS.CANCELADO
                                                    ? 'bg-green-600 hover:bg-green-700 shadow-lg'
                                                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                            }`}
                                        >
                                            {isProcessing ? 'Procesando...' : 'MARCAR COMO ENTREGADO'}
                                        </button>
                                        <button
                                            onClick={() => handleUpdateStatus(ORDER_STATUS_OPTIONS.CANCELADO)}
                                            disabled={isProcessing || selectedOrder.status === ORDER_STATUS_OPTIONS.ENTREGADO || selectedOrder.status === ORDER_STATUS_OPTIONS.CANCELADO || !incidences.trim()}
                                            className={`flex-1 px-4 py-3 rounded-lg font-extrabold text-white text-sm transition-all duration-300 ${
                                                !isProcessing && selectedOrder.status !== ORDER_STATUS_OPTIONS.ENTREGADO && selectedOrder.status !== ORDER_STATUS_OPTIONS.CANCELADO && incidences.trim()
                                                    ? 'bg-red-600 hover:bg-red-700 shadow-lg'
                                                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                            }`}
                                        >
                                            {isProcessing ? 'Cancelando...' : 'REPORTAR CANCELACIÓN'}
                                        </button>
                                         <button
                                            onClick={() => handleUpdateStatus(newStatus)}
                                            disabled={isProcessing || selectedOrder.status === ORDER_STATUS_OPTIONS.ENTREGADO || selectedOrder.status === ORDER_STATUS_OPTIONS.CANCELADO || !newStatus}
                                            className={`flex-1 px-4 py-3 rounded-lg font-extrabold text-white text-sm transition-all duration-300 ${
                                                !isProcessing && selectedOrder.status !== ORDER_STATUS_OPTIONS.ENTREGADO && selectedOrder.status !== ORDER_STATUS_OPTIONS.CANCELADO && newStatus
                                                    ? 'bg-blue-600 hover:bg-blue-700 shadow-lg'
                                                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                            }`}
                                        >
                                            ACTUALIZAR ESTADO
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center">
                                <p className="text-gray-500 italic text-lg">
                                    Seleccione un pedido de la lista para ver los detalles y actualizar su estado.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Pie de página de estado (VACÍO) */}
                <footer className="mt-4 pt-2 border-t border-gray-700">
                    {/* Contenido eliminado para dejar solo la línea divisoria. */}
                </footer>
            </div>
        </div>
    );
};

export default GestionPedidosRepartidor;