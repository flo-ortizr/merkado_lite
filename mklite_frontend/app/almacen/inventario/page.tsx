'use client';

import React, { useState, useCallback, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"; // Importar estilos de datepicker

// =================================================================
// 1. CONSTANTES Y DATOS MOCKEADOS (Simulando BBDD de Productos, Lotes y Movimientos)
// =================================================================

const ALMACEN_ENCARGADO = "Carlos Ruiz";
const CURRENT_DATE = new Date();

const PRODUCT_TYPES = [
    { id: 'SKU0078', name: 'Coca-Cola Clásica (Caja 12x1L)', unit: 'Caja' },
    { id: 'SKU0079', name: 'Coca-Cola Zero (Caja 12x1L)', unit: 'Caja' },
    { id: 'SKU0080', name: 'Fanta Naranja (Pack 6x355ml)', unit: 'Pack' },
    { id: 'SKU0081', name: 'Sprite Limón (Pack 6x355ml)', unit: 'Pack' },
    { id: 'SKU0082', name: 'Agua Ciel (Botella 1.5L)', unit: 'Botella' },
    { id: 'SKU0083', name: 'Jugo Del Valle (Caja 1L)', unit: 'Caja' },
];

const MOVEMENT_TYPES = {
    ENTRADA: 'Entrada',
    SALIDA: 'Salida',
};

const ENTRY_REASONS = [
    'Compra a Proveedor',
    'Devolución de Cliente',
    'Producción Interna',
    'Ajuste de Inventario (Positivo)',
];

const EXIT_REASONS = [
    'Venta a Cliente',
    'Merma / Deterioro',
    'Devolución a Proveedor',
    'Uso Interno / Consumo',
    'Ajuste de Inventario (Negativo)',
];

// Inventario actual de lotes
const MOCK_LOT_INVENTORY_DB = [
    {
        productId: 'SKU0078',
        productName: 'Coca-Cola Clásica (Caja 12x1L)',
        lotNumber: 'COC-CLAS-20250115',
        quantity: 300,
        expirationDate: new Date('2025-01-15'),
        status: 'ACTIVO',
        lastMovementDate: new Date('2024-10-26'),
    },
    {
        productId: 'SKU0079',
        productName: 'Coca-Cola Zero (Caja 12x1L)',
        lotNumber: 'COC-ZERO-20241220',
        quantity: 120,
        expirationDate: new Date('2024-12-20'), // Próximo a vencer
        status: 'PROX_VENC',
        lastMovementDate: new Date('2024-10-20'),
    },
    {
        productId: 'SKU0080',
        productName: 'Fanta Naranja (Pack 6x355ml)',
        lotNumber: 'FAN-NAR-20241130',
        quantity: 180,
        expirationDate: new Date('2024-11-30'), // Próximo a vencer
        status: 'PROX_VENC',
        lastMovementDate: new Date('2024-10-20'),
    },
    {
        productId: 'SKU0081',
        productName: 'Sprite Limón (Pack 6x355ml)',
        lotNumber: 'SPR-LIM-20241031',
        quantity: 45,
        expirationDate: new Date('2024-10-31'), // Vencido
        status: 'VENCIDO',
        lastMovementDate: new Date('2024-10-15'),
    },
    {
        productId: 'SKU0078',
        productName: 'Coca-Cola Clásica (Caja 12x1L)',
        lotNumber: 'COC-CLAS-20250630',
        quantity: 250,
        expirationDate: new Date('2025-06-30'),
        status: 'ACTIVO',
        lastMovementDate: new Date('2024-10-20'),
    },
];

// =================================================================
// 2. COMPONENTE PRINCIPAL: GestionInventarioAlmacen
// =================================================================

const GestionInventarioAlmacen = () => {
    const [movements, setMovements] = useState(MOCK_LOT_INVENTORY_DB); // Para la tabla
    const [lastUpdateTime, setLastUpdateTime] = useState(new Date());

    // Estado del formulario de registro
    const [formDate, setFormDate] = useState(CURRENT_DATE);
    const [movementType, setMovementType] = useState(MOVEMENT_TYPES.ENTRADA);
    const [selectedProduct, setSelectedProduct] = useState(null); // {id, name, unit}
    const [lotNumber, setLotNumber] = useState('');
    const [quantity, setQuantity] = useState('');
    const [expirationDate, setExpirationDate] = useState(null);
    const [reason, setReason] = useState('');
    const [message, setMessage] = useState(''); // Mensajes para el usuario (éxito/error)

    // Lotes existentes del producto seleccionado (para salidas y auto-llenado)
    const [existingLotsForProduct, setExistingLotsForProduct] = useState([]);

    // Actualizar el estado de los lotes (Vencido, Próx. Venc.)
    const getLotStatus = useCallback((expDate) => {
        if (!expDate) return 'DESCONOCIDO';
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Resetear horas para comparación
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(today.getDate() + 30);
        thirtyDaysFromNow.setHours(0, 0, 0, 0);

        if (expDate <= today) {
            return 'VENCIDO';
        } else if (expDate <= thirtyDaysFromNow) {
            return 'PROX_VENC';
        }
        return 'ACTIVO';
    }, []);

    // Actualizar todos los estados de los lotes en la tabla
    useMemo(() => {
        setMovements(prevMovements => prevMovements.map(lot => ({
            ...lot,
            status: getLotStatus(lot.expirationDate)
        })));
    }, [getLotStatus]); // Se ejecuta solo si getLotStatus cambia (raro) o al montar


    // --- Funciones para manejar la lógica del formulario ---

    const handleProductSearch = () => {
        // Simulación: en una app real, esto abriría un modal de búsqueda o un autocompletado
        setMessage('Buscando productos...');
        setTimeout(() => {
            const product = PRODUCT_TYPES[0]; // Selecciona el primero como ejemplo
            setSelectedProduct(product);
            setMessage(`Producto seleccionado: ${product.name}`);
        }, 500);
    };

    const handleLotSearch = () => {
        if (!selectedProduct) {
            setMessage('ALERTA: Seleccione primero un producto.');
            return;
        }
        setMessage('Buscando lotes existentes para el producto...');
        
        // Simulación: filtra lotes existentes para el producto seleccionado
        const foundLots = MOCK_LOT_INVENTORY_DB.filter(lot => 
            lot.productId === selectedProduct.id && lot.status !== 'VENCIDO' // No cargar lotes vencidos para salidas
        );
        setExistingLotsForProduct(foundLots);

        if (foundLots.length > 0 && movementType === MOVEMENT_TYPES.SALIDA) {
            setMessage(`Lotes encontrados para ${selectedProduct.name}. Elija uno para la salida.`);
            // Opcional: auto-seleccionar el primer lote para salida si es el único
            // setLotNumber(foundLots[0].lotNumber);
            // setExpirationDate(foundLots[0].expirationDate);
        } else if (movementType === MOVEMENT_TYPES.ENTRADA) {
             setMessage(`Prepare para registrar un nuevo lote de ${selectedProduct.name}.`);
        } else if (movementType === MOVEMENT_TYPES.SALIDA && foundLots.length === 0) {
            setMessage(`ALERTA: No se encontraron lotes activos para la salida de ${selectedProduct.name}.`);
        } else {
            setMessage('Búsqueda de lotes completada.');
        }
    };

    const handleLotSelectionForExit = (e) => {
        const selectedLotNum = e.target.value;
        setLotNumber(selectedLotNum);
        if (selectedLotNum) {
            const lot = movements.find(l => l.lotNumber === selectedLotNum);
            if (lot) {
                setExpirationDate(lot.expirationDate);
                // Aquí podrías mostrar el stock actual del lote si lo tuvieras en el mock
                setMessage(`Lote ${lot.lotNumber} seleccionado. Stock actual: ${lot.quantity || 'N/D'}`);
            }
        } else {
            setExpirationDate(null);
            setMessage('');
        }
    };


    const handleRegisterMovement = useCallback(async () => {
        if (!formDate || !movementType || !selectedProduct || !lotNumber || !quantity || !reason) {
            setMessage('ERROR: Por favor, complete todos los campos obligatorios.');
            return;
        }
        if (movementType === MOVEMENT_TYPES.ENTRADA && !expirationDate) {
            setMessage('ERROR: Para entradas, la fecha de vencimiento es obligatoria.');
            return;
        }
        if (isNaN(parseInt(quantity)) || parseInt(quantity) <= 0) {
            setMessage('ERROR: La cantidad debe ser un número positivo.');
            return;
        }

        setMessage('Registrando movimiento...');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simular latencia

        const parsedQuantity = parseInt(quantity);
        let success = false;

        if (movementType === MOVEMENT_TYPES.ENTRADA) {
            const existingLotIndex = movements.findIndex(m => m.lotNumber === lotNumber && m.productId === selectedProduct.id);
            if (existingLotIndex !== -1) {
                // Actualizar cantidad de un lote existente
                const updatedMovements = [...movements];
                updatedMovements[existingLotIndex].quantity += parsedQuantity;
                updatedMovements[existingLotIndex].lastMovementDate = formDate;
                updatedMovements[existingLotIndex].status = getLotStatus(updatedMovements[existingLotIndex].expirationDate); // Re-evaluar estado
                setMovements(updatedMovements);
                setMessage(`ÉXITO: Entrada de ${parsedQuantity} ${selectedProduct.unit}(s) al lote ${lotNumber}. Stock actualizado.`);
            } else {
                // Registrar nuevo lote
                const newLot = {
                    productId: selectedProduct.id,
                    productName: selectedProduct.name,
                    lotNumber: lotNumber,
                    quantity: parsedQuantity,
                    expirationDate: expirationDate,
                    status: getLotStatus(expirationDate),
                    lastMovementDate: formDate,
                };
                setMovements(prev => [...prev, newLot]);
                setMessage(`ÉXITO: Entrada de nuevo lote ${lotNumber} (${parsedQuantity} ${selectedProduct.unit}(s)).`);
            }
            success = true;

        } else if (movementType === MOVEMENT_TYPES.SALIDA) {
            const existingLotIndex = movements.findIndex(m => m.lotNumber === lotNumber && m.productId === selectedProduct.id);
            if (existingLotIndex === -1) {
                setMessage('ERROR: Lote no encontrado para la salida.');
            } else if (movements[existingLotIndex].quantity < parsedQuantity) {
                setMessage(`ERROR: Cantidad insuficiente en el lote ${lotNumber}. Disponible: ${movements[existingLotIndex].quantity}.`);
            } else {
                const updatedMovements = [...movements];
                updatedMovements[existingLotIndex].quantity -= parsedQuantity;
                updatedMovements[existingLotIndex].lastMovementDate = formDate;
                updatedMovements[existingLotIndex].status = getLotStatus(updatedMovements[existingLotIndex].expirationDate); // Re-evaluar estado
                setMovements(updatedMovements);
                setMessage(`ÉXITO: Salida de ${parsedQuantity} ${selectedProduct.unit}(s) del lote ${lotNumber}. Stock actualizado.`);
                success = true;
            }
        }

        if (success) {
            setLastUpdateTime(new Date()); // Actualizar timestamp de última actualización
            // Limpiar formulario después de un registro exitoso
            setLotNumber('');
            setQuantity('');
            setExpirationDate(null);
            setReason('');
            setSelectedProduct(null);
            setExistingLotsForProduct([]);
        }

    }, [formDate, movementType, selectedProduct, lotNumber, quantity, expirationDate, reason, movements, getLotStatus]);


    const handleMovementTypeChange = (e) => {
        setMovementType(e.target.value);
        // Resetear campos relacionados con lotes al cambiar el tipo de movimiento
        setLotNumber('');
        setQuantity('');
        setExpirationDate(null);
        setExistingLotsForProduct([]);
        setReason(''); // También el motivo, ya que son diferentes
    };

    const handleProductChange = (e) => {
        const productId = e.target.value;
        const product = PRODUCT_TYPES.find(p => p.id === productId);
        setSelectedProduct(product || null);
        // Resetear lotes y vencimiento al cambiar el producto
        setLotNumber('');
        setExpirationDate(null);
        setExistingLotsForProduct([]);
        if (product) {
            setMessage(`Producto seleccionado: ${product.name}.`);
        } else {
            setMessage('');
        }
    };


    // Filtrar los motivos según el tipo de movimiento
    const currentReasons = movementType === MOVEMENT_TYPES.ENTRADA ? ENTRY_REASONS : EXIT_REASONS;


    return (
        <div className="min-h-screen p-6 bg-gray-900 text-gray-100 font-sans flex justify-center items-center">
            <div className="w-full max-w-7xl bg-gray-800 rounded-xl shadow-2xl p-8">
                {/* Header */}
                <header className="mb-8 flex justify-between items-center border-b border-red-600 pb-4"> {/* Rojo Coca-Cola */}
                    <h1 className="text-3xl font-extrabold text-red-500 flex items-center"> {/* Rojo Coca-Cola */}
                        <svg className="w-9 h-9 mr-3" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11 17h2v-6h-2v6zm-5 0h2v-6H6v6zm14 0h2v-6h-2v6zm-5-14H9V5h6V3zm-2 2h-2V3h2v2zm10 0v-2c0-1.1-.9-2-2-2h-6c-1.1 0-2 .9-2 2V5h-2c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-2zM9 7h2v2H9V7zm4 0h2v2h-2V7z"></path></svg>
                        GESTIÓN DE INVENTARIO
                    </h1>
                    <div className="text-sm text-gray-400">
                        <span className="mr-4">Encargado: {ALMACEN_ENCARGADO}</span>
                        <span className="font-semibold text-white">Fecha: {CURRENT_DATE.toLocaleDateString()}</span>
                    </div>
                </header>

                {/* Contenido Principal: Formulario y Tabla */}
                <div className="flex flex-col lg:flex-row gap-8 h-[65vh]">
                    {/* Columna Izquierda: Registrar Movimiento */}
                    <div className="lg:w-2/5 p-6 bg-gray-900 rounded-lg shadow-inner flex flex-col">
                        <h2 className="text-xl font-bold mb-5 text-red-400">REGISTRAR MOVIMIENTO POR LOTE</h2> {/* Rojo Coca-Cola */}
                        
                        <div className="space-y-4 flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                            {/* Campo Fecha */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Fecha:</label>
                                <DatePicker
                                    selected={formDate}
                                    onChange={(date) => setFormDate(date)}
                                    dateFormat="yyyy-MM-dd"
                                    className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-red-500 focus:border-red-500 text-sm" // Focus rojo
                                />
                            </div>

                            {/* Tipo de Movimiento */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Tipo de Movimiento:</label>
                                <select
                                    value={movementType}
                                    onChange={handleMovementTypeChange}
                                    className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-red-500 focus:border-red-500 text-sm" // Focus rojo
                                >
                                    <option value={MOVEMENT_TYPES.ENTRADA}>Entrada</option>
                                    <option value={MOVEMENT_TYPES.SALIDA}>Salida</option>
                                </select>
                            </div>

                            {/* Producto */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Producto:</label>
                                <div className="flex">
                                    <select
                                        value={selectedProduct?.id || ''}
                                        onChange={handleProductChange}
                                        className="flex-1 p-3 bg-gray-700 text-white rounded-l-lg border border-gray-600 focus:ring-red-500 focus:border-red-500 text-sm" // Focus rojo
                                    >
                                        <option value="">Seleccione un producto</option>
                                        {PRODUCT_TYPES.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={handleProductSearch} // Esto podría lanzar un modal o hacer algo más complejo
                                        className="p-3 bg-gray-600 text-gray-200 rounded-r-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm" // Focus rojo
                                        title="Buscar producto"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                    </button>
                                </div>
                            </div>
                            
                            {/* Número de Lote */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Número de Lote:</label>
                                {movementType === MOVEMENT_TYPES.SALIDA && selectedProduct ? (
                                    <div className="flex">
                                        <select
                                            value={lotNumber}
                                            onChange={handleLotSelectionForExit}
                                            className="flex-1 p-3 bg-gray-700 text-white rounded-l-lg border border-gray-600 focus:ring-red-500 focus:border-red-500 text-sm" // Focus rojo
                                            disabled={!selectedProduct || existingLotsForProduct.length === 0}
                                        >
                                            <option value="">Seleccione un lote existente</option>
                                            {existingLotsForProduct.map(lot => (
                                                <option key={lot.lotNumber} value={lot.lotNumber}>
                                                    {lot.lotNumber} (Disp: {lot.quantity})
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={handleLotSearch}
                                            className="p-3 bg-gray-600 text-gray-200 rounded-r-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm" // Focus rojo
                                            title="Cargar lotes disponibles"
                                            disabled={!selectedProduct}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex">
                                        <input
                                            type="text"
                                            value={lotNumber}
                                            onChange={(e) => setLotNumber(e.target.value)}
                                            placeholder="Ej: LOTE-ABC-001"
                                            className="flex-1 p-3 bg-gray-700 text-white rounded-l-lg border border-gray-600 focus:ring-red-500 focus:border-red-500 text-sm" // Focus rojo
                                            disabled={!selectedProduct}
                                        />
                                        <button
                                            onClick={handleLotSearch}
                                            className="p-3 bg-gray-600 text-gray-200 rounded-r-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm" // Focus rojo
                                            title="Buscar lotes existentes"
                                            disabled={!selectedProduct}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Cantidad y Unidad */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Cantidad (Unidades):</label>
                                <div className="flex">
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                        placeholder="Ej: 150"
                                        min="1"
                                        className="flex-1 p-3 bg-gray-700 text-white rounded-l-lg border border-gray-600 focus:ring-red-500 focus:border-red-500 text-sm" // Focus rojo
                                    />
                                    {selectedProduct && (
                                        <span className="p-3 bg-gray-600 text-gray-200 rounded-r-lg border border-l-0 border-gray-600 text-sm flex items-center">
                                            {selectedProduct.unit}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Fecha de Vencimiento (solo para entradas o cuando se selecciona lote) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Fecha de Vencimiento:</label>
                                <DatePicker
                                    selected={expirationDate}
                                    onChange={(date) => setExpirationDate(date)}
                                    dateFormat="yyyy-MM-dd"
                                    minDate={CURRENT_DATE} // No se puede vencer antes de hoy
                                    className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-red-500 focus:border-red-500 text-sm" // Focus rojo
                                    disabled={movementType === MOVEMENT_TYPES.SALIDA && lotNumber !== ''} // Si es salida y hay lote, la fecha viene del lote
                                />
                            </div>

                            {/* Motivo del Movimiento */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Motivo:</label>
                                <select
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-red-500 focus:border-red-500 text-sm" // Focus rojo
                                >
                                    <option value="">Seleccione un motivo</option>
                                    {currentReasons.map((r, index) => (
                                        <option key={index} value={r}>{r}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Botón de Registrar y Mensaje */}
                        <div className="mt-6 flex-shrink-0">
                            <button
                                onClick={handleRegisterMovement}
                                className="w-full px-5 py-3 bg-red-600 text-white font-extrabold rounded-lg hover:bg-red-700 transition-all duration-300 shadow-lg text-base" // Rojo Coca-Cola
                            >
                                REGISTRAR MOVIMIENTO
                            </button>
                            {message && (
                                <p className={`mt-3 text-center text-sm font-semibold p-2 rounded-lg ${message.startsWith('ERROR:') ? 'bg-red-800 text-red-200' : 'bg-gray-700 text-gray-200'}`}>
                                    {message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Columna Derecha: Historial de Lotes y Vencimientos */}
                    <div className="lg:w-3/5 p-6 bg-gray-900 rounded-lg shadow-inner flex flex-col">
                        <h2 className="text-xl font-bold mb-5 text-red-400">HISTORIAL DE LOTES Y VENCIMIENTOS</h2> {/* Rojo Coca-Cola */}
                        
                        <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                            <table className="min-w-full table-auto text-sm text-left text-gray-200">
                                <thead className="text-xs text-gray-400 uppercase bg-gray-700 sticky top-0 z-10">
                                    <tr>
                                        <th scope="col" className="px-4 py-3">Fecha Mov.</th>
                                        <th scope="col" className="px-4 py-3">Producto</th>
                                        <th scope="col" className="px-4 py-3">Lote</th>
                                        <th scope="col" className="px-4 py-3 text-right">Cantidad</th>
                                        <th scope="col" className="px-4 py-3">Vencimiento</th>
                                        <th scope="col" className="px-4 py-3">Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {movements.sort((a,b) => b.lastMovementDate - a.lastMovementDate).map((lot, index) => (
                                        <tr key={lot.lotNumber + "-" + index} className="border-b border-gray-700 hover:bg-gray-700">
                                            <td className="px-4 py-3">{lot.lastMovementDate.toLocaleDateString()}</td>
                                            <td className="px-4 py-3">{lot.productName}</td>
                                            <td className="px-4 py-3">{lot.lotNumber}</td>
                                            <td className="px-4 py-3 text-right">{lot.quantity} {PRODUCT_TYPES.find(p => p.id === lot.productId)?.unit || ''}</td>
                                            <td className="px-4 py-3">{lot.expirationDate ? lot.expirationDate.toLocaleDateString() : 'N/A'}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium 
                                                    ${lot.status === 'VENCIDO' ? 'bg-red-700' :         // Rojo más oscuro
                                                      lot.status === 'PROX_VENC' ? 'bg-orange-500' :    // Naranja
                                                      'bg-green-600'} text-white`}>                      {/* Verde */}
                                                    {lot.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {movements.length === 0 && (
                                <p className="text-center text-gray-500 italic py-5">No hay movimientos registrados.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer con última actualización */}
                <footer className="mt-6 pt-4 border-t border-gray-700 text-sm text-gray-500 text-center">
                    Última actualización: {lastUpdateTime.toLocaleString()} (Hora del sistema central)
                </footer>
            </div>
        </div>
    );
};

export default GestionInventarioAlmacen;