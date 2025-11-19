'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';

// =================================================================
// 1. CONSTANTES Y DATOS MOCKEADOS (Simulando inventario)
// =================================================================

const TAX_RATE = 0.13; // Tasa de Impuesto (ejemplo: 13%)

// Estructura del inventario ahora incluye 'discountPercentage'
const MOCK_INVENTORY = [
    { id: 'SKU001', name: 'Coca-Cola (600ml)', price: 7.50, stock: 50, discountPercentage: 0.0 }, // Sin descuento
    { id: 'SKU002', name: 'Coca-Cola Light (350ml)', price: 6.00, stock: 30, discountPercentage: 0.10 }, // 10% descuento
    { id: 'SKU003', name: 'Fanta Naranja (600ml)', price: 7.00, stock: 25, discountPercentage: 0.15 }, // 15% descuento
    { id: 'SKU004', name: 'Agua Mineral (1L)', price: 4.00, stock: 100, discountPercentage: 0.0 },
    { id: 'SKU005', name: 'Sprite (2L)', price: 15.00, stock: 20, discountPercentage: 0.05 }, // 5% descuento
    { id: 'SKU006', name: 'Frugos Durazno (300ml)', price: 5.50, stock: 40, discountPercentage: 0.0 },
    { id: 'SKU007', name: 'Coca-Cola (2L)', price: 15.00, stock: 15, discountPercentage: 0.0 },
    { id: 'SKU008', name: 'Powerade (600ml)', price: 8.00, stock: 35, discountPercentage: 0.0 },
    { id: 'SKU009', name: 'Galletas Oreo', price: 3.50, stock: 60, discountPercentage: 0.0 },
    { id: 'SKU010', name: 'Papas Fritas Lay\'s', price: 6.00, stock: 45, discountPercentage: 0.0 },
];


// =================================================================
// 2. COMPONENTE PRINCIPAL (Solo la lógica de UI y estado local)
// =================================================================

const App = () => {
    const [products, setProducts] = useState(MOCK_INVENTORY); 
    const [cart, setCart] = useState([]); // Carrito
    const [totalSummary, setTotalSummary] = useState({ subtotal: 0, discount: 0, tax: 0, total: 0 });
    const [paymentMethod, setPaymentMethod] = useState('Efectivo');
    const [cashReceived, setCashReceived] = useState(0);
    const [message, setMessage] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const userId = "Juan Pérez"; // Vendedor mockeado


    // -----------------------------------------------------------------
    // A. CÁLCULO Y MONEDA (Bolivianos)
    // -----------------------------------------------------------------
    const formatCurrency = (value) => 
        (value || 0).toLocaleString('es-BO', { style: 'currency', currency: 'BOB', minimumFractionDigits: 2 });

    const calculateTotals = useCallback(() => {
        let rawSubtotal = 0;
        let totalDiscount = 0;

        cart.forEach(item => {
            const itemSubtotal = item.price * item.quantity;
            rawSubtotal += itemSubtotal;
            
            // Cálculo del descuento basado en el producto
            const discountAmount = itemSubtotal * (item.discountPercentage || 0);
            totalDiscount += discountAmount;
        });

        const subtotalWithDiscount = rawSubtotal - totalDiscount;
        const tax = subtotalWithDiscount * TAX_RATE;
        const total = subtotalWithDiscount + tax;

        setTotalSummary({ subtotal: rawSubtotal, discount: totalDiscount, tax, total });
    }, [cart]);

    useEffect(() => {
        calculateTotals();
    }, [cart, calculateTotals]);


    // -----------------------------------------------------------------
    // B. MANEJO DE LÓGICA DE VENTA (Mockeada)
    // -----------------------------------------------------------------

    const handleSearchAndAdd = (term, quantityToAdd = 1) => {
        const foundProduct = products.find(p =>
            p.id.toLowerCase() === term.toLowerCase() || 
            p.name.toLowerCase().includes(term.toLowerCase())
        );

        if (!foundProduct || foundProduct.stock <= 0) {
            setMessage(foundProduct ? `¡Stock agotado para ${foundProduct.name}!` : `❌ Producto no encontrado para: ${term}`);
            return;
        }
        
        quantityToAdd = Math.max(1, quantityToAdd);

        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === foundProduct.id);
            let newCart;

            if (existingItem) {
                const newQuantity = existingItem.quantity + quantityToAdd;
                const liveStock = products.find(p => p.id === foundProduct.id)?.stock || foundProduct.stock;

                if (newQuantity > liveStock) {
                    setMessage(`¡Alerta! Solo quedan ${liveStock} unidades de ${foundProduct.name}.`);
                    newCart = prevCart.map(item =>
                        item.id === foundProduct.id ? { ...item, quantity: liveStock, maxStock: liveStock } : item
                    );
                } else {
                    newCart = prevCart.map(item =>
                        item.id === foundProduct.id ? { ...item, quantity: newQuantity, maxStock: liveStock } : item
                    );
                }
            } else {
                newCart = [...prevCart, {
                    id: foundProduct.id,
                    name: foundProduct.name,
                    price: foundProduct.price,
                    quantity: quantityToAdd,
                    maxStock: foundProduct.stock,
                    // IMPORTANTE: Añadir el porcentaje de descuento al ítem del carrito
                    discountPercentage: foundProduct.discountPercentage,
                }];
            }
            setMessage(`✅ Añadido: ${foundProduct.name} x ${quantityToAdd}`);
            return newCart;
        });
        setSearchTerm('');
    };

    const updateCartItemQuantity = (itemId, newQuantity) => {
        setCart(prevCart => {
            return prevCart.map(item => {
                if (item.id === itemId) {
                    const liveProduct = products.find(p => p.id === itemId);
                    const liveStock = liveProduct ? liveProduct.stock : item.maxStock;

                    const quantityToSet = Math.max(0, Math.min(newQuantity, liveStock)); // Min 0, Max stock
                    
                    if (quantityToSet > liveStock) {
                        setMessage(`¡Alerta! Solo ${liveStock} en stock.`);
                    }
                    
                    if (isNaN(quantityToSet) || newQuantity < 0) {
                        return { ...item, quantity: 0, maxStock: liveStock };
                    }

                    return { ...item, quantity: quantityToSet, maxStock: liveStock };
                }
                return item;
            }).filter(item => item.quantity > 0); // Eliminar si la cantidad es 0
        });
    };

    const handleCheckout = async () => {
        if (cart.length === 0 || isProcessing) return false;

        setIsProcessing(true);
        setMessage('Simulando procesamiento de venta...');
        
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simular latencia

        // Simulación de actualización de stock local (No persistente)
        const updatedProducts = products.map(p => {
            const soldItem = cart.find(c => c.id === p.id);
            if (soldItem) {
                return { ...p, stock: p.stock - soldItem.quantity };
            }
            return p;
        });
        setProducts(updatedProducts);

        // Post-Transacción simulada exitosa
        setMessage('✅ Venta simulada completada. Stock local actualizado.');
        setCart([]);
        setCashReceived(0);
        setPaymentMethod('Efectivo');
        setIsProcessing(false);
        return true;
    };

    const clearCart = () => {
        setCart([]);
        setCashReceived(0);
        setMessage("Carrito vaciado.");
    };
    
    const handleCashReceivedChange = (e) => {
        const value = parseFloat(e.target.value) || 0;
        setCashReceived(value);
    };


    // -----------------------------------------------------------------
    // C. HELPERS Y UI
    // -----------------------------------------------------------------
    const changeToReturn = totalSummary.total > 0 && cashReceived > totalSummary.total
        ? cashReceived - totalSummary.total
        : 0;
    const isCheckoutEnabled = cart.length > 0 && !isProcessing && (paymentMethod !== 'Efectivo' || cashReceived >= totalSummary.total);
    
    // Función para manejar Enter en la búsqueda
    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter' && searchTerm.trim() !== '') {
            handleSearchAndAdd(searchTerm, 1); // Asume cantidad 1 al escanear/buscar
        }
    };
    
    const filteredProducts = useMemo(() => {
        if (!searchTerm) return products.filter(p => p.stock > 0);
        return products.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) && p.stock > 0
        );
    }, [products, searchTerm]);


    return (
        <div className="min-h-screen h-screen bg-gray-900 text-gray-100 font-sans flex flex-col lg:flex-row overflow-hidden">
            
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
            
            {/* 1. Columna Izquierda: Productos (Scrollable) */}
            <div className="lg:w-2/5 p-4 bg-gray-800 shadow-xl flex flex-col h-full">
                <header className="mb-4 flex justify-between items-center flex-shrink-0">
                    <h1 className="text-xl font-bold text-red-500">Registro de Venta Presencial</h1>
                    <div className="text-sm text-gray-400">
                        <span className="mr-2">Vendedor: {userId}</span>
                        {/* Icono de usuario de Lucide-React */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                </header>

                {/* Búsqueda */}
                <div className="mb-4 flex-shrink-0">
                    <div className="relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                            placeholder="Escanear Código o Buscar Producto"
                            className="w-full p-3 pl-10 text-lg bg-gray-700 border border-gray-600 rounded-lg focus:ring-red-500 focus:border-red-500 text-white placeholder-gray-400"
                        />
                        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    {message && (
                        <p className={`mt-2 text-sm font-bold p-2 rounded-lg ${message.startsWith('❌') || message.startsWith('¡Alerta!') ? 'bg-red-800 text-red-200' : 'bg-green-800 text-green-200'}`}>
                            {message}
                        </p>
                    )}
                </div>

                {/* Lista de Productos (Scrollable) */}
                <div className="flex-1 grid grid-cols-1 gap-3 overflow-y-auto pr-2">
                    {filteredProducts.map(p => (
                        <button
                            key={p.id}
                            onClick={() => handleSearchAndAdd(p.id)} // Añadir con un clic, cantidad 1
                            disabled={p.stock <= 0}
                            className={`p-4 bg-red-600 text-white border-b-4 border-red-800 rounded-xl shadow-lg flex justify-between items-center transition duration-150 transform hover:scale-[1.01] ${p.stock > 0 ? 'hover:bg-red-700 active:border-red-600' : 'opacity-50 cursor-not-allowed bg-red-800 border-red-900'}`}
                        >
                            <div className="text-left flex flex-col">
                                <span className="font-extrabold text-xl leading-tight">{p.name}</span>
                                <span className={`text-sm font-medium mt-1 ${p.stock <= 5 ? 'text-red-200' : 'text-green-300'}`}>
                                    Stock: {p.stock}
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="text-3xl font-black">{formatCurrency(p.price)}</span>
                                {p.discountPercentage > 0 && (
                                    <span className="text-xs font-semibold text-yellow-300 block">
                                        -{p.discountPercentage * 100}%
                                    </span>
                                )}
                            </div>
                        </button>
                    ))}
                    {filteredProducts.length === 0 && (
                        <p className="text-gray-500 italic col-span-full text-center py-10">
                            No hay productos disponibles o coincidencia.
                        </p>
                    )}
                </div>
            </div>

            {/* 2. Columna Central: Carrito y Resumen (Contenedor flex para fijar el resumen) */}
            <div className="lg:w-2/5 p-4 bg-gray-900 flex flex-col h-full">
                <h2 className="text-xl font-bold mb-4 text-red-500 border-b border-gray-700 pb-2 flex-shrink-0">Lista de Artículos de la Venta</h2>
                
                {/* Encabezados de tabla para el carrito (Fijos) */}
                {/* 7 columnas: Producto (2), Cant., P. Unitario, Subtotal, Desc., Total */}
                <div className="grid grid-cols-7 gap-2 text-xs font-semibold text-gray-400 mb-2 border-b border-gray-700 pb-1 flex-shrink-0">
                    <span className="col-span-2">Producto</span>
                    <span className="text-center">Cant.</span>
                    <span className="text-right">P. Unitario</span>
                    <span className="text-right">Subtotal</span>
                    <span className="text-right">Desc.</span>
                    <span className="text-right">Total</span>
                </div>

                {/* Artículos del Carrito (Scrollable) */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                    {cart.length === 0 ? (
                        <p className="text-gray-500 italic text-center py-10">Carrito vacío.</p>
                    ) : (
                        cart.map(item => {
                            const itemSubtotal = item.price * item.quantity;
                            const itemDiscount = itemSubtotal * (item.discountPercentage || 0);
                            const itemTotal = itemSubtotal - itemDiscount;

                            return (
                                <div key={item.id} className="grid grid-cols-7 gap-2 items-center text-sm bg-gray-800 p-3 rounded-lg">
                                    {/* Columna de Producto y Botón de Eliminar (Col-span-2) */}
                                    <div className="col-span-2 flex flex-col justify-center">
                                        <span className="font-semibold text-white truncate text-base leading-tight">{item.name}</span>
                                        {/* Botón de Eliminar */}
                                        <button onClick={() => updateCartItemQuantity(item.id, 0)} className="text-red-500 hover:text-red-300 transition-colors text-xs font-medium w-fit mt-1">
                                            Eliminar
                                        </button>
                                    </div>
                                    
                                    {/* Control de Cantidad (Cant.) */}
                                    <div className="flex items-center justify-center space-x-1">
                                        {/* Botones de cantidad más grandes (w-7 h-7) y mejor estilo */}
                                        <button
                                            onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                                            className="bg-gray-700 text-white w-7 h-7 rounded-md text-base font-bold hover:bg-red-600 transition"
                                            disabled={item.quantity <= 1}
                                        >
                                            −
                                        </button>
                                        <input 
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => updateCartItemQuantity(item.id, parseInt(e.target.value) || 0)}
                                            onFocus={(e) => e.target.select()} // Seleccionar todo el texto al enfocar
                                            className="w-10 p-1 bg-gray-900 text-white text-center rounded-sm text-sm focus:ring-red-500 focus:border-red-500 hide-number-arrows"
                                            min="1"
                                            max={item.maxStock}
                                        />
                                        <button
                                            onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                                            className="bg-red-600 text-white w-7 h-7 rounded-md text-base font-bold hover:bg-red-700 transition disabled:bg-gray-500"
                                            disabled={item.quantity >= item.maxStock}
                                        >
                                            +
                                        </button>
                                    </div>
                                    {/* Precio Unitario */}
                                    <span className="text-right text-gray-300 font-medium">{formatCurrency(item.price)}</span>
                                    {/* Subtotal por Item */}
                                    <span className="text-right text-white font-semibold">{formatCurrency(itemSubtotal)}</span>
                                    {/* Descuento por Item */}
                                    <span className="text-right font-medium text-green-400">
                                        {item.discountPercentage > 0 ? formatCurrency(itemDiscount) : formatCurrency(0)}
                                    </span>
                                    {/* Total por Item (Subtotal - Descuento) */}
                                    <span className={`text-right font-bold text-base ${itemDiscount > 0 ? 'text-yellow-400' : 'text-red-400'}`}>{formatCurrency(itemTotal)}</span>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Resumen de Totales (Fijo al fondo) */}
                <div className="mt-4 p-4 bg-gray-800 rounded-lg shadow-inner flex-shrink-0">
                    <h3 className="text-xl font-bold mb-3 text-red-400">Resumen de Venta</h3>
                    <div className="space-y-2 text-base">
                        <div className="flex justify-between text-gray-300"><span>Subtotal Bruto:</span><span>{formatCurrency(totalSummary.subtotal)}</span></div>
                        {/* El descuento ahora es la suma de los descuentos por producto */}
                        <div className="flex justify-between text-gray-300"><span>Descuento Total:</span><span className="text-green-400">- {formatCurrency(totalSummary.discount)}</span></div>
                        <div className="flex justify-between text-gray-300"><span>Subtotal Neto (Antes de Impuesto):</span><span>{formatCurrency(totalSummary.subtotal - totalSummary.discount)}</span></div>
                        <div className="flex justify-between text-gray-300"><span>Impuestos ({TAX_RATE * 100}%):</span><span>{formatCurrency(totalSummary.tax)}</span></div>
                        <div className="flex justify-between pt-3 border-t border-gray-700">
                            <span className="font-extrabold text-2xl text-white">TOTAL A PAGAR:</span>
                            <span className="font-extrabold text-2xl text-red-400">{formatCurrency(totalSummary.total)}</span>
                        </div>
                    </div>
                    <div className="flex justify-end mt-4 space-x-3">
                        <button onClick={clearCart} className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition">Cancelar Venta</button>
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">Asignar Cliente</button>
                    </div>
                </div>
            </div>

            {/* 3. Columna Derecha: Métodos de Pago y Finalización (Contenedor flex para fijar el botón de venta) */}
            <div className="lg:w-1/5 p-4 bg-gray-800 flex flex-col h-full">
                <h2 className="text-xl font-bold mb-4 text-red-500 border-b border-gray-700 pb-2 flex-shrink-0">Opciones de Pago</h2>
                
                {/* Selector de Método de Pago */}
                <div className="grid grid-cols-2 gap-3 mb-6 flex-shrink-0">
                    {['Efectivo', 'Tarjeta', 'QR'].map(method => (
                        <button
                            key={method}
                            onClick={() => setPaymentMethod(method)}
                            className={`py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                                paymentMethod === method
                                    ? 'bg-red-600 text-white shadow-lg border-2 border-red-400'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            {method}
                        </button>
                    ))}
                </div>

                {/* Input de Efectivo Recibido (Sólo si es Efectivo) - Fijo */}
                {paymentMethod === 'Efectivo' && (
                    <div className="mb-6 p-3 bg-gray-900 rounded-lg flex-shrink-0">
                        <label htmlFor="cashReceivedInput" className="block text-sm font-medium text-gray-400 mb-2">
                            Monto Recibido ({formatCurrency(1)})
                        </label>
                        <input
                            id="cashReceivedInput"
                            type="number"
                            step="0.01"
                            value={cashReceived === 0 ? '' : cashReceived}
                            onChange={handleCashReceivedChange}
                            onFocus={(e) => e.target.select()}
                            placeholder="0.00"
                            className="w-full p-3 text-2xl font-bold bg-gray-700 border border-gray-600 rounded-lg text-white text-right focus:ring-red-500 focus:border-red-500 hide-number-arrows"
                        />
                        <div className="mt-3 p-2 bg-gray-700 rounded-lg text-sm flex justify-between">
                            <span className="text-gray-300">Cambio a Devolver:</span>
                            <span className="font-bold text-lg text-green-400">{formatCurrency(changeToReturn)}</span>
                        </div>
                    </div>
                )}
                
                {/* Información extra para otros pagos (Scrollable / o push down) */}
                {(paymentMethod === 'Tarjeta' || paymentMethod === 'QR') && (
                     <div className="mb-6 p-3 bg-gray-900 rounded-lg text-center flex-shrink-0">
                        <p className="text-gray-400 italic">
                            {paymentMethod === 'Tarjeta' ? 'Procesando pago con tarjeta...' : `Generar código QR para ${formatCurrency(totalSummary.total)}`}
                        </p>
                        {paymentMethod === 'Tarjeta' ? (
                            <svg className="mx-auto mt-2 text-red-500 w-8 h-8 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                            </svg>
                        ) : (
                            <svg className="mx-auto mt-2 text-red-500 w-12 h-12" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="8" x="2" y="2" rx="1"/><rect width="8" height="8" x="14" y="2" rx="1"/><path d="M2 14h2"/><path d="M6 14v2"/><path d="M10 14h2"/><path d="M14 14v2"/><path d="M18 14h2"/><path d="M22 14v2"/><rect width="8" height="8" x="14" y="14" rx="1"/><path d="M18 18h.01"/><path d="M6 18h.01"/><path d="M10 18h.01"/><path d="M6 22h.01"/><path d="M10 22h.01"/></svg>
                        )}
                    </div>
                )}

                {/* Relleno (empuja el botón de venta hacia abajo) */}
                <div className="flex-1 min-h-[10px]">
                    {/* Contenido que podría deslizarse si fuera necesario (aquí está vacío) */}
                </div>

                {/* Botón de Finalización de Venta (Fijo al fondo) */}
                <button
                    onClick={handleCheckout}
                    disabled={!isCheckoutEnabled}
                    className={`w-full py-4 rounded-lg text-xl font-extrabold transition-all duration-300 flex-shrink-0
                        ${isCheckoutEnabled
                            ? 'bg-red-600 text-white shadow-xl hover:bg-red-700 active:bg-red-800'
                            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    {isProcessing ? 'Simulando...' : 'COMPLETAR VENTA'}
                </button>
            </div>
        </div>
    );
};

export default App;