'use client';

import React, { useState, useCallback, useMemo } from 'react';

// =================================================================
// 1. CONSTANTES Y DATOS MOCKEADOS (Simulando BBDD de Ventas y Productos)
// =================================================================

const USER_ID = "Ana Gómez"; 
const MOCK_DATE = new Date().toISOString().split('T')[0];
const FORMAT_CURRENCY = (value) => (value || 0).toLocaleString('es-BO', { style: 'currency', currency: 'BOB', minimumFractionDigits: 2 });

const REASON_OPTIONS = [
    'Error de ingreso del vendedor',
    'Producto defectuoso/dañado',
    'Cambio de opinión del cliente',
    'Talla/Color/Modelo incorrecto',
    'Fallo en el pago o transacción',
];

// Simulamos una venta registrada para poder buscarla.
const MOCK_SALES_DB = [
    { 
        id: 'VNT2023-10-26-145', 
        date: '2023-10-26', 
        client: 'Juan Pérez', 
        total: 75.00, 
        status: 'Completado',
        items: [
            { id: 'SKU001', name: 'Coca-Cola (600ml)', price: 7.50, quantity: 4, totalLine: 30.00 },
            { id: 'SKU003', name: 'Fanta Naranja (600ml)', price: 7.00, quantity: 5, totalLine: 35.00 },
            { id: 'SKU004', name: 'Agua Mineral (1L)', price: 4.00, quantity: 2, totalLine: 8.00 },
            { id: 'TAX', name: 'Impuesto (13%)', price: 0, quantity: 1, totalLine: 2.00 },
        ]
    },
    { 
        id: 'VNT2023-11-01-201', 
        date: '2023-11-01', 
        client: 'Elena Rojas', 
        total: 100.00, 
        status: 'Anulado' 
    },
    { 
        id: 'VNT2023-11-05-300', 
        date: '2023-11-05', 
        client: 'María Soto', 
        total: 50.00, 
        status: 'Completado' 
    },
    // VENTA CON ESTADO NO PROCESABLE (Pendiente)
    {
        id: 'VNT2025-11-19-400', 
        date: '2025-11-19', 
        client: 'Carlos Lima', 
        total: 30.00, 
        status: 'Pendiente', 
        items: [
            { id: 'SKU001', name: 'Coca-Cola (600ml)', price: 7.50, quantity: 2, totalLine: 15.00 },
            { id: 'SKU003', name: 'Fanta Naranja (600ml)', price: 7.00, quantity: 1, totalLine: 7.00 },
            { id: 'TAX', name: 'Impuesto (13%)', price: 0, quantity: 1, totalLine: 8.00 },
        ]
    }
];

// Inventario simulado para la actualización de stock
const MOCK_INVENTORY_DB = [
    { id: 'SKU001', name: 'Coca-Cola (600ml)', stock: 50 },
    { id: 'SKU003', name: 'Fanta Naranja (600ml)', stock: 25 },
    { id: 'SKU004', name: 'Agua Mineral (1L)', stock: 100 },
];

// =================================================================
// 2. COMPONENTE PRINCIPAL: DevolucionesAnulaciones
// =================================================================

const DevolucionesAnulaciones = () => {
    // Estado de la búsqueda de ventas
    const [searchTerm, setSearchTerm] = useState('');
    const [foundSales, setFoundSales] = useState(MOCK_SALES_DB);
    const [selectedSale, setSelectedSale] = useState(null);
    
    // Estado de la acción
    const [reason, setReason] = useState('');
    const [comments, setComments] = useState('');
    const [itemsToProcess, setItemsToProcess] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [message, setMessage] = useState('');

    // Simulamos la búsqueda de ventas
    const handleSearchSale = () => {
        setMessage('');
        if (!searchTerm.trim()) {
            setFoundSales(MOCK_SALES_DB);
            return;
        }
        
        const results = MOCK_SALES_DB.filter(sale => 
            sale.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
            (sale.client && sale.client.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        
        setFoundSales(results);
        setSelectedSale(null);
        if (results.length === 1) {
            handleSelectSale(results[0]);
        }
    };

    // Al seleccionar una venta, pre-cargar los ítems
    const handleSelectSale = (sale) => {
        setSelectedSale(sale);
        if (sale.items) {
            setItemsToProcess(sale.items.filter(item => item.id !== 'TAX').map(item => ({
                ...item,
                quantityToProcess: item.quantity,
                maxQuantity: item.quantity,
                reason: '',
            })));
        } else {
             setItemsToProcess([]);
        }
        setReason('');
        setComments('');
        setMessage(`ÉXITO: Venta ${sale.id} seleccionada.`);
    };

    // Actualiza la cantidad o el motivo para un ítem específico
    const handleItemChange = useCallback((itemId, key, value) => {
        setItemsToProcess(prevItems => 
            prevItems.map(item => {
                if (item.id === itemId) {
                    if (key === 'quantityToProcess') {
                        const newQty = Math.max(0, Math.min(parseInt(value) || 0, item.maxQuantity));
                        return { ...item, quantityToProcess: newQty };
                    }
                    return { ...item, [key]: value };
                }
                return item;
            })
        );
    }, []);

    // -----------------------------------------------------------------
    // Lógica de Procesamiento (Anulación / Devolución)
    // -----------------------------------------------------------------
    
    const processAction = async (type) => {
        if (!selectedSale || isProcessing) return;

        // Validación: Solo permitir acciones si el estado es 'Completado' o 'Devolución Parcial'
        if (selectedSale.status !== 'Completado' && selectedSale.status !== 'Devolución Parcial') {
             setMessage(`ALERTA: La venta ${selectedSale.id} ya está en estado ${selectedSale.status}. No se puede procesar.`);
             return;
        }

        const itemsToUpdate = itemsToProcess.filter(item => item.quantityToProcess > 0);
        if (itemsToUpdate.length === 0) {
            setMessage(`ALERTA: Debe seleccionar al menos un producto para ${type.toLowerCase()}.`);
            return;
        }
        if (!reason && type === 'DEVOLUCIÓN') {
             setMessage('ALERTA: Debe seleccionar un motivo para la devolución.');
             return;
        }
        
        setIsProcessing(true);
        setMessage(`Simulando procesamiento de ${type.toLowerCase()}...`);
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simular latencia

        let stockChanges = [];

        // 1. Simulación de actualización de stock
        itemsToUpdate.forEach(item => {
            const currentProduct = MOCK_INVENTORY_DB.find(p => p.id === item.id);
            if (currentProduct) {
                currentProduct.stock += item.quantityToProcess;
                stockChanges.push(`${item.name}: +${item.quantityToProcess}`);
            }
        });
        
        // 2. Simulación de registro del cambio
        const logEntry = {
            saleId: selectedSale.id,
            actionType: type,
            date: MOCK_DATE,
            user: USER_ID,
            reason: reason || 'Anulación Total (Motivo General)',
            comments,
            processedItems: itemsToUpdate.map(i => ({ 
                id: i.id, 
                qty: i.quantityToProcess, 
                reason: i.reason || reason 
            }))
        };
        console.log("Registro de Log:", logEntry); // En una app real, esto iría a la BBDD

        // 3. Simulación de actualización del estado de la Venta
        const isTotalCancellation = type === 'ANULACIÓN' || itemsToUpdate.every(item => item.quantityToProcess === item.maxQuantity);
        if (isTotalCancellation) {
             selectedSale.status = 'Anulado/Devuelto';
        } else if (type === 'DEVOLUCIÓN') {
             selectedSale.status = 'Devolución Parcial';
        }

        // Limpiar y notificar
        setMessage(`ÉXITO: ${type} completada para Venta ${selectedSale.id}. Inventario actualizado. Cambios: ${stockChanges.join(', ')}`);
        setSelectedSale(null);
        setItemsToProcess([]);
        setSearchTerm('');
        setFoundSales(MOCK_SALES_DB);
        setIsProcessing(false);
    };

    // Renderizado de la lista de ventas
    const renderSalesList = () => (
        <div className="overflow-y-auto space-y-1 mt-3 h-52">
            {foundSales.length === 0 ? (
                <p className="text-gray-500 italic text-center py-4">No se encontraron ventas.</p>
            ) : (
                foundSales.map(sale => (
                    <div 
                        key={sale.id}
                        onClick={() => handleSelectSale(sale)}
                        className={`grid grid-cols-4 gap-2 p-3 rounded-lg cursor-pointer transition duration-150 ${
                            selectedSale?.id === sale.id ? 'bg-red-700 shadow-md border-2 border-red-500' : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                    >
                        <span className="font-semibold text-sm truncate">{sale.id}</span>
                        <span className="text-sm">{sale.date}</span>
                        <span className="text-sm truncate">{sale.client || 'N/A'}</span>
                        <span className={`text-right font-bold text-sm ${sale.status === 'Completado' ? 'text-green-400' : 'text-yellow-400'}`}>
                            {FORMAT_CURRENCY(sale.total)}
                        </span>
                    </div>
                ))
            )}
        </div>
    );

    // Renderizado del detalle de la acción (ítems, motivos)
    const renderActionDetail = () => (
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            
            <h3 className="text-lg font-bold text-red-400 border-b border-gray-700 pb-2">Productos a Procesar</h3>
            
            {/* Encabezado de la tabla de ítems */}
            <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-gray-400 pb-1 border-b border-gray-700">
                <span className="col-span-5">Producto</span>
                <span className="col-span-2 text-center">Máx.</span>
                <span className="col-span-2 text-center">Cant.</span>
                <span className="col-span-3">Motivo Específico</span>
            </div>

            {/* Fila de ítems */}
            {itemsToProcess.map(item => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-center text-sm bg-gray-700 p-2 rounded-md">
                    <span className="col-span-5 font-medium truncate">{item.name}</span>
                    
                    {/* Cantidad Máxima */}
                    <span className="col-span-2 text-center text-gray-400">{item.maxQuantity}</span>
                    
                    {/* Cantidad a Procesar (Input) */}
                    <div className="col-span-2 flex justify-center">
                        <input
                            type="number"
                            value={item.quantityToProcess}
                            onChange={(e) => handleItemChange(item.id, 'quantityToProcess', e.target.value)}
                            className="w-full p-1 bg-gray-800 text-white text-center rounded-sm text-sm focus:ring-red-500 focus:border-red-500 hide-number-arrows"
                            min="0"
                            max={item.maxQuantity}
                        />
                    </div>
                    
                    {/* Motivo por Item (Opcional) */}
                    <div className="col-span-3">
                        <select
                            value={item.reason}
                            onChange={(e) => handleItemChange(item.id, 'reason', e.target.value)}
                            className="w-full p-1 bg-gray-800 text-white rounded-sm text-xs focus:ring-red-500 focus:border-red-500"
                        >
                            <option value="">(Motivo General)</option>
                            {REASON_OPTIONS.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                </div>
            ))}

            <h3 className="text-lg font-bold text-red-400 border-b border-gray-700 pb-2 pt-4">Motivo General y Comentarios</h3>
            
            {/* Motivo General */}
            <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-red-500 focus:border-red-500 text-sm"
            >
                <option value="">Seleccione Motivo Principal...</option>
                {REASON_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
            
            {/* Comentarios Adicionales */}
            <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Comentarios adicionales (Ej: Contacto con el cliente, estado del producto devuelto...)"
                rows="3"
                className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-red-500 focus:border-red-500 text-sm"
            />
        </div>
    );
    
    // El botón de Anular solo se activa si no hay ítems con cantidad parcial
    const isFullCancellation = selectedSale && itemsToProcess.every(item => item.quantityToProcess === item.maxQuantity);
    
    // El botón de Devolución se activa si al menos 1 ítem tiene cantidad > 0 y la razón general está seleccionada (o hay razones por ítem)
    const isReturnEnabled = selectedSale && itemsToProcess.some(item => item.quantityToProcess > 0) && (reason || itemsToProcess.some(item => item.reason));
    
    const isCancelEnabled = isFullCancellation && selectedSale && (reason || comments);
    
    // Función para obtener el color del estado
    const getStatusColor = (status) => {
        switch (status) {
            case 'Completado':
                return 'bg-green-600';
            case 'Anulado':
                return 'bg-red-600';
            case 'Devolución Parcial':
                return 'bg-yellow-600';
            case 'Pendiente': // NUEVO ESTADO
                return 'bg-orange-500'; 
            default:
                return 'bg-gray-500';
        }
    }


    return (
        <div className="min-h-screen p-6 bg-gray-900 text-gray-100 font-sans flex justify-center">
            {/* Oculta las flechas del input number */}
            <style jsx global>{`
                .hide-number-arrows::-webkit-outer-spin-button,
                .hide-number-arrows::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
                .hide-number-arrows[type='number'] {
                    -moz-appearance: textfield;
                }
            `}</style>
            
            <div className="w-full max-w-5xl bg-gray-800 rounded-xl shadow-2xl p-6">
                <header className="mb-6 flex justify-between items-center border-b border-red-700 pb-4">
                    <h1 className="text-3xl font-extrabold text-red-500">
                        Gestión de Devoluciones y Anulaciones
                    </h1>
                    <div className="text-sm text-gray-400">
                        <span className="mr-2">Vendedor: {USER_ID}</span> 
                        <span className="font-semibold text-white">Fecha: {MOCK_DATE}</span>
                    </div>
                </header>

                {/* Contenedor Principal: Búsqueda y Detalle */}
                <div className="flex flex-col lg:flex-row gap-6 h-[70vh]">
                    
                    {/* Columna Izquierda: Búsqueda y Lista de Ventas */}
                    <div className="lg:w-2/5 p-4 bg-gray-900 rounded-lg shadow-inner flex flex-col">
                        <h2 className="text-xl font-bold mb-3 text-red-500">Buscar Venta Registrada</h2>
                        
                        {/* Campo de Búsqueda */}
                        <div className="flex mb-4">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearchSale()}
                                placeholder="ID de Venta o Nombre de Cliente"
                                className="flex-1 p-3 text-lg bg-gray-700 border border-gray-600 rounded-l-lg focus:ring-red-500 focus:border-red-500 text-white placeholder-gray-400"
                            />
                            <button 
                                onClick={handleSearchSale}
                                className="p-3 bg-red-600 text-white rounded-r-lg hover:bg-red-700 transition"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                            </button>
                        </div>

                        {/* Encabezado de la tabla de ventas */}
                        <div className="grid grid-cols-4 gap-2 text-xs font-bold text-gray-400 border-b border-gray-700 pb-1">
                            <span>ID Venta</span>
                            <span>Fecha</span>
                            <span>Cliente</span>
                            <span className="text-right">Total</span>
                        </div>

                        {/* Lista de Ventas (Scrollable) */}
                        {renderSalesList()}

                        {/* Mensaje de estado */}
                        {message && (
                            <p className={`mt-4 text-sm font-bold p-3 rounded-lg flex-shrink-0 ${message.startsWith('ALERTA:') ? 'bg-red-800 text-red-200' : 'bg-green-800 text-green-200'}`}>
                                {message}
                            </p>
                        )}
                    </div>

                    {/* Columna Derecha: Detalle de Acción y Botones */}
                    <div className="lg:w-3/5 p-4 bg-gray-900 rounded-lg shadow-inner flex flex-col">
                        <h2 className="text-xl font-bold mb-3 text-red-500 flex-shrink-0">Detalle y Acciones</h2>
                        
                        {selectedSale ? (
                            <>
                                {/* INDICADOR DE ESTADO */}
                                <div className="mb-4 p-3 rounded-lg flex justify-between items-center text-lg font-bold bg-gray-700">
                                    <span className="text-gray-400">Estado Actual de Venta:</span>
                                    <span className={`text-white px-3 py-1 rounded-full text-base ${getStatusColor(selectedSale.status)}`}>
                                        {selectedSale.status.toUpperCase()}
                                    </span>
                                </div>
                                {/* FIN INDICADOR DE ESTADO */}

                                {/* Detalle de Productos a Procesar (Scrollable) */}
                                <div className="flex-1 overflow-y-auto pr-2">
                                    {renderActionDetail()}
                                </div>

                                {/* Botones de Acción (Fijos) */}
                                <div className="mt-6 pt-4 border-t border-gray-700 flex justify-end space-x-4 flex-shrink-0">
                                    <button
                                        onClick={() => processAction('ANULACIÓN')}
                                        disabled={!isCancelEnabled || isProcessing}
                                        className={`px-6 py-3 rounded-lg font-extrabold text-white transition-all duration-300 ${
                                            isCancelEnabled && !isProcessing
                                                ? 'bg-red-700 hover:bg-red-800 shadow-lg'
                                                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                        }`}
                                    >
                                        {isProcessing ? 'Anulando...' : 'PROCESAR ANULACIÓN TOTAL'}
                                    </button>
                                    
                                    <button
                                        onClick={() => processAction('DEVOLUCIÓN')}
                                        disabled={!isReturnEnabled || isProcessing}
                                        className={`px-6 py-3 rounded-lg font-extrabold text-white transition-all duration-300 ${
                                            isReturnEnabled && !isProcessing
                                                ? 'bg-blue-600 hover:bg-blue-700 shadow-lg'
                                                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                        }`}
                                    >
                                        {isProcessing ? 'Devolviendo...' : 'PROCESAR DEVOLUCIÓN'}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center">
                                <p className="text-gray-500 italic text-lg">
                                    Seleccione una venta de la lista de la izquierda para continuar.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Pie de página de estado */}
                <footer className="mt-4 pt-2 border-t border-gray-700 text-xs text-gray-500 flex justify-between">
                    <span>Usuario: **{USER_ID}**</span>
                    <span>Inventario actualizado automáticamente al procesar.</span>
                </footer>
            </div>
        </div>
    );
};

export default DevolucionesAnulaciones;