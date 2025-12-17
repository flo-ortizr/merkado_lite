"use client";

import React, { useState, useEffect, useCallback } from 'react';
import * as XLSX from "xlsx"; 
import { saveAs } from "file-saver";
import { useRouter } from "next/navigation";

// Definición de datos detallados por periodo
const SIMULATION_DATA = {
    // 1. Datos para Reporte Mensual (Desglose por Semanas)
    mensual: {
        title: "Ventas/Transacciones por Semana del Mes",
        detalle: [
            { periodo: 'Semana 1', venta: 250000.00, transacciones: 3000, crecimientoVenta: '+12%', crecimientoTransacciones: '+8%' },
            { periodo: 'Semana 2', venta: 310000.00, transacciones: 3800, crecimientoVenta: '+24%', crecimientoTransacciones: '+15%' },
            { periodo: 'Semana 3', venta: 385000.00, transacciones: 4500, crecimientoVenta: '+24%', crecimientoTransacciones: '+18%' },
            { periodo: 'Semana 4', venta: 300000.00, transacciones: 3261, crecimientoVenta: '-22%', crecimientoTransacciones: '-27%' },
        ],
    },
    // 2. Datos para Reporte Semanal (Desglose por Días)
    semanal: {
        title: "Ventas/Transacciones Diarias de la Semana",
        detalle: [
            { periodo: 'Lunes', venta: 45000.00, transacciones: 500, crecimientoVenta: '+5%', crecimientoTransacciones: '+3%' },
            { periodo: 'Martes', venta: 50000.00, transacciones: 550, crecimientoVenta: '+8%', crecimientoTransacciones: '+7%' },
            { periodo: 'Miércoles', venta: 65000.00, transacciones: 700, crecimientoVenta: '+15%', crecimientoTransacciones: '+10%' },
            { periodo: 'Jueves', venta: 40000.00, transacciones: 450, crecimientoVenta: '-3%', crecimientoTransacciones: '-5%' },
            { periodo: 'Viernes', venta: 75000.00, transacciones: 800, crecimientoVenta: '+20%', crecimientoTransacciones: '+18%' },
            { periodo: 'Sábado', venta: 105000.00, transacciones: 1100, crecimientoVenta: '+25%', crecimientoTransacciones: '+20%' },
            { periodo: 'Domingo', venta: 95000.00, transacciones: 980, crecimientoVenta: '+10%', crecimientoTransacciones: '+9%' },
        ],
    },
    // 3. Datos para Reporte Diario (Desglose por Turnos)
    diario: {
        title: "Ventas/Transacciones por Turno del Día",
        detalle: [
            { periodo: 'Turno Mañana', venta: 15000.00, transacciones: 166, crecimientoVenta: '+5%', crecimientoTransacciones: '+6%' },
            { periodo: 'Turno Tarde', venta: 27000.00, transacciones: 300, crecimientoVenta: '-2%', crecimientoTransacciones: '-1%' },
            { periodo: 'Turno Noche', venta: 8000.00, transacciones: 94, crecimientoVenta: '+10%', crecimientoTransacciones: '+11%' },
        ],
    },
};

// Mapeo de colores para las barras del histograma
const BAR_COLORS = ['#DC2626', '#3B82F6', '#FCD34D', '#A855F7', '#10B981', '#F97316', '#EF4444'];


// --- Componentes Reutilizables ---

// Componente para la barra individual del histograma
const BarComponent = ({ label, value, color, maxValue, formatValue, valuePrefix }) => {
    // Calcula la altura de la barra en porcentaje (máximo 100%)
    const heightPercentage = (value / maxValue) * 100;

    return (
        <div className="flex flex-col items-center justify-end h-full mx-2 min-w-[50px]"> {/* min-w para evitar que se aplasten */}
            <div className="tooltip-container relative group h-full flex items-end">
                {/* La barra de la simulación */}
                <div 
                    className="w-8 rounded-t-lg transition-all duration-700 ease-out hover:opacity-80 shadow-lg"
                    style={{ 
                        height: `${heightPercentage}%`, 
                        backgroundColor: color,
                        minHeight: heightPercentage > 0 ? '5px' : '0px' // Asegura visibilidad mínima si hay valor
                    }}
                ></div>
                {/* Tooltip de valor */}
                <div className="tooltip absolute bottom-full mb-2 p-1 px-2 bg-gray-700 text-xs text-white rounded-md opacity-0 transition-opacity duration-300 pointer-events-none group-hover:opacity-100 whitespace-nowrap">
                    {valuePrefix}{formatValue(value)}
                </div>
            </div>
            {/* Etiqueta del eje X - Posicionada debajo de la barra */}
            <span className="absolute bottom-[-20px] text-xs font-medium text-gray-400 text-center">{label}</span>
        </div>
    );
};

// Componente del Histograma Dinámico (Gráfico de Tendencia)
const HistogramChartMock = ({ data, title, selectedMetric, formatBs, formatNumber }) => {
    if (!data || data.length === 0) {
        return <div className="text-gray-500 text-center py-16">No hay datos para mostrar el gráfico.</div>;
    }

    // Determina la métrica que se va a graficar
    const metricKey = selectedMetric === 'venta' ? 'venta' : 'transacciones';
    const unitLabel = selectedMetric === 'venta' ? '(Bs.)' : '';
    const valuePrefix = selectedMetric === 'venta' ? 'Bs. ' : ''; // Prefijo para valores del tooltip y eje Y
    
    // Usamos un formato más compacto y sin decimales en el eje Y para que quepa mejor,
    // pero mantenemos los decimales en el tooltip.
    const formatValueYAxis = (value) => {
        // Formato para el eje Y: miles separados, sin decimales, usando 'es-ES' para el punto decimal (más común)
        // Usamos Intl.NumberFormat para un formato más profesional y consistente
        return new Intl.NumberFormat('es-BO', { 
            maximumFractionDigits: 0, 
            minimumFractionDigits: 0
        }).format(value);
    };
    
    // Función de formato para el tooltip (con decimales)
    const formatValueTooltip = selectedMetric === 'venta' ? formatBs : formatNumber;


    // Calcula el valor máximo para establecer la escala del eje Y (con un 10% de buffer)
    const rawMaxValue = Math.max(...data.map(item => item[metricKey]));
    const safeMaxValue = rawMaxValue > 0 ? rawMaxValue * 1.1 : 1000; // Asegura un mínimo si no hay datos

    // Adapta los datos de 'detalle' para el componente de barra
    const chartData = data.map((item, index) => ({
        label: item.periodo, // Usa el periodo completo para la etiqueta X
        value: item[metricKey],
        color: BAR_COLORS[index % BAR_COLORS.length]
    }));

    // Simulación del Eje Y
    // Genera 5 etiquetas para el eje Y: 0, 25%, 50%, 75%, 100% del valor máximo
    const yAxisLabels = Array.from({ length: 5 }).map((_, i, arr) => {
        const value = safeMaxValue * (i / (arr.length - 1));
        return { 
            label: `${valuePrefix}${formatValueYAxis(value)}`, // Usamos el formato compacto
            value: value 
        };
    }).reverse(); // Invierte para que el 100% esté arriba y 0% abajo


    return (
        <div className="flex flex-col h-full">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">
                {title.replace('Ventas/Transacciones', selectedMetric === 'venta' ? 'Ventas' : 'Transacciones')} {unitLabel}
            </h3>
            <div className="flex-grow p-4 bg-gray-900 rounded-xl shadow-inner flex relative">
                
                {/* Eje Y de Simulación (a la izquierda para las etiquetas de valor) */}
                {/* Manteniendo el w-28 y aplicando text-xs para mayor profesionalismo y espacio */}
                <div className="absolute left-0 w-28 h-full text-xs text-gray-400 pr-2 pt-4 pb-0 flex flex-col justify-between">
                    {yAxisLabels.map((item, index) => (
                        // La línea del 0 debe ir en la parte inferior (index 4)
                        <span 
                            key={index} 
                            className="whitespace-nowrap text-right" 
                            style={{ 
                                marginBottom: index === yAxisLabels.length - 1 ? '-0.5rem' : '0' 
                            }}
                        > 
                            {item.label}
                        </span>
                    ))}
                </div>

                {/* Área de Gráfico con Líneas de Cuadrícula y Barras */}
                {/* Manteniendo el padding-left a pl-28 para compensar el ancho del eje Y */}
                <div className="flex flex-col h-full w-full pl-28 relative"> 
                    
                    {/* Contenedor de las Líneas de Cuadrícula */}
                    <div className="absolute left-0 right-0 top-0 bottom-[30px] pointer-events-none">
                        <div className="h-full flex flex-col justify-between"> 
                            {/* Dibuja 5 líneas de cuadrícula */}
                            {Array.from({ length: 5 }).map((_, i) => (
                                <hr key={i} className="border-gray-700 w-full" />
                            ))}
                        </div>
                    </div>

                    {/* Contenedor de las Barras */}
                    {/* Usamos padding-bottom para separar las barras de la línea del 0/Eje X y las etiquetas */}
                    <div className="flex items-end justify-around h-full relative z-10 pb-[30px]"> 
                        {chartData.map((item, index) => (
                            <BarComponent
                                key={index}
                                label={item.label}
                                value={item.value}
                                color={item.color}
                                maxValue={safeMaxValue}
                                formatValue={formatValueTooltip}
                                valuePrefix={valuePrefix}
                            />
                        ))}
                    </div>

                    {/* Eje X (Línea de base) - Ubicado donde terminan las barras */}
                    <div className="absolute bottom-[30px] left-0 right-0 h-px border-t border-gray-600"></div>

                </div>
            </div>
        </div>
    );
};


// Componente Principal de Reportes
const ReportesDeVentas = () => {
    // --- Estado General de Filtros ---
    const [fechaInicio, setFechaInicio] = useState('2025-01-01');
    const [fechaFin, setFechaFin] = useState('2025-01-31');
    const [periodo, setPeriodo] = useState('mensual'); // 'diario', 'semanal', 'mensual'
    const [metrica, setMetrica] = useState('venta'); // 'venta' o 'transacciones'
const router = useRouter();
    // --- Estado de Datos del Reporte ---
    const [reporteTitulo, setReporteTitulo] = useState('Resultados (Mensual) - Enero 2025');
    const [metricas, setMetricas] = useState({
        ventas: 1245000.00,
        ticket: 85.50,
        transacciones: 14561,
        margen: 35.2,
    });
    // Se inicializa la tabla de detalle y el histograma con datos mensuales por defecto
    const [detalleData, setDetalleData] = useState(SIMULATION_DATA.mensual.detalle);
    const [currentHistogramTitle, setCurrentHistogramTitle] = useState(SIMULATION_DATA.mensual.title);
    const exportToExcel = () => { if (!detalleData || detalleData.length === 0) return; const dataForExcel = detalleData.map((item) => ({ Periodo: item.periodo, Venta_Bs: item.venta, Crecimiento_Venta: item.crecimientoVenta, Transacciones: item.transacciones, Crecimiento_Transacciones: item.crecimientoTransacciones, })); const worksheet = XLSX.utils.json_to_sheet(dataForExcel); const workbook = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(workbook, worksheet, "Detalle"); const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" }); const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", }); saveAs(blob, `Reporte_Ventas_${periodo}_${fechaInicio}_a_${fechaFin}.xlsx`); };
    // --- Estado de UI y Control ---
    const [isReportVisible, setIsReportVisible] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    // --- Funciones de Utilidad ---
    const mostrarMensaje = (texto) => {
        setModalMessage(texto);
        setShowModal(true);
    };

    // Formato de moneda con dos decimales y separador de miles correcto (Bolivia)
    const formatBs = (value) => new Intl.NumberFormat('es-BO', { 
        minimumFractionDigits: 2, 
        maximumFractionDigits: 2 
    }).format(value);
    
    // Formato de número entero con separador de miles
    const formatNumber = (value) => new Intl.NumberFormat('es-BO', { 
        minimumFractionDigits: 0, 
        maximumFractionDigits: 0 
    }).format(value);


    // Lógica de generación del reporte (simulación)
    const generarReporte = useCallback(() => {
        if (new Date(fechaInicio) > new Date(fechaFin)) {
            mostrarMensaje('¡Error! La Fecha Inicial no puede ser posterior a la Fecha Final.');
            return;
        }

        setIsReportVisible(false);
        setIsLoading(true);
        mostrarMensaje(`Generando reporte ${periodo} con métrica ${metrica}...`);

        setTimeout(() => {
            let nuevosDatos = {
                titulo: '',
                ventas: 0,
                ticket: 0,
                transacciones: 0,
                margen: 0,
                tabla: SIMULATION_DATA[periodo].detalle,
                chartTitle: SIMULATION_DATA[periodo].title,
            };

            // Simulación de métricas clave según el período
            switch (periodo) {
                case 'diario':
                    nuevosDatos.titulo = `Resultados (Diario) - ${fechaFin}`;
                    nuevosDatos.ventas = 50000.00;
                    nuevosDatos.ticket = 90.25;
                    nuevosDatos.transacciones = 560;
                    nuevosDatos.margen = 30.1;
                    break;
                case 'semanal':
                    nuevosDatos.titulo = `Resultados (Semanal) - ${fechaInicio} a ${fechaFin}`;
                    nuevosDatos.ventas = 480000.00;
                    nuevosDatos.ticket = 88.00;
                    nuevosDatos.transacciones = 5400;
                    nuevosDatos.margen = 33.5;
                    break;
                case 'mensual':
                default:
                    nuevosDatos.titulo = `Resultados (Mensual) - ${fechaInicio.substring(0, 7)}`;
                    nuevosDatos.ventas = 1245000.00;
                    nuevosDatos.ticket = 85.50;
                    nuevosDatos.transacciones = 14561;
                    nuevosDatos.margen = 35.2;
                    break;
            }

            // Actualiza el estado
            setReporteTitulo(nuevosDatos.titulo);
            setMetricas({
                ventas: nuevosDatos.ventas,
                ticket: nuevosDatos.ticket,
                transacciones: nuevosDatos.transacciones,
                margen: nuevosDatos.margen,
            });
            setCurrentHistogramTitle(nuevosDatos.chartTitle);
            setDetalleData(nuevosDatos.tabla);

            setShowModal(false);
            setIsLoading(false);
            setIsReportVisible(true);
        }, 1500);
    }, [fechaInicio, fechaFin, periodo, metrica, formatBs]);

    // Mapeo para el título de la tabla de detalle
    const getDetalleTableTitle = () => {
        switch (periodo) {
            case 'diario': return 'Detalle de Ventas y Transacciones por Turno';
            case 'semanal': return 'Detalle de Ventas y Transacciones por Día';
            case 'mensual': return 'Detalle de Ventas y Transacciones por Semana';
            default: return 'Detalle de Ventas y Transacciones';
        }
    };
    
    // Función para obtener el valor de crecimiento según la métrica seleccionada (no se usa en la tabla, pero se mantiene la estructura por si acaso)
    const getCrecimientoValue = (item) => {
        return metrica === 'venta' ? item.crecimientoVenta : item.crecimientoTransacciones;
    };

    return (
        // Contenedor principal con fondo oscuro
        <div className="min-h-screen bg-gray-900 p-4 sm:p-8 font-sans">
            <div id="app" className="max-w-7xl mx-auto">
                {/* Encabezado del Dashboard */}
                <header className="mb-8 p-0 sm:p-0">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-red-500 mb-2">
                        Generador de Reportes de Desempeño
                    </h1>
                    <p className="text-gray-400">
                        Filtra y analiza el desempeño de ventas por periodo y métrica.
                    </p>
                    <button onClick={exportToExcel} className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"> Exportar a Excel </button>
                    // Dentro del componente GestionInventarioAlmacen, junto al botón de Cerrar Sesión
<button 
    onClick={() => router.push('/administrador/usuarios/lista')} 
    style={{
        position: 'absolute',
        top: '20px',
        right: '120px', // Ajusta la separación con el botón "Cerrar Sesión"
        background: 'none',
        border: 'none',
        color: '#eef0f5ff',
        textDecoration: 'underline',
        cursor: 'pointer',
        fontSize: '14px',
        zIndex: 10,
    }}
>
    Volver Atrás
</button>

                </header>

                {/* Bloque de Filtros (Card Oscura) */}
                <div className="bg-gray-800 p-6 rounded-xl shadow-2xl mb-8 border border-gray-700">
                    <h2 className="text-xl font-bold text-red-500 mb-4">Parámetros del Reporte</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                        
                        {/* Filtro de Fecha Inicial */}
                        <div className="flex flex-col">
                            <label htmlFor="fecha-inicio" className="text-sm font-medium text-gray-300 mb-1">Fecha Inicial</label>
                            <input 
                                type="date" 
                                id="fecha-inicio" 
                                className="p-3 border border-gray-700 rounded-lg focus:ring-red-500 focus:border-red-500 transition duration-150 bg-gray-700 text-gray-100" 
                                value={fechaInicio} 
                                onChange={(e) => setFechaInicio(e.target.value)}
                            />
                        </div>

                        {/* Filtro de Fecha Final */}
                        <div className="flex flex-col">
                            <label htmlFor="fecha-fin" className="text-sm font-medium text-gray-300 mb-1">Fecha Final</label>
                            <input 
                                type="date" 
                                id="fecha-fin" 
                                className="p-3 border border-gray-700 rounded-lg focus:ring-red-500 focus:border-red-500 transition duration-150 bg-gray-700 text-gray-100" 
                                value={fechaFin} 
                                onChange={(e) => setFechaFin(e.target.value)}
                            />
                        </div>

                        {/* Selector de Periodo */}
                        <div className="flex flex-col">
                            <label htmlFor="periodo" className="text-sm font-medium text-gray-300 mb-1">Tipo de Reporte</label>
                            <select 
                                id="periodo" 
                                className="p-3 border border-gray-700 rounded-lg bg-gray-700 text-gray-100 focus:ring-red-500 focus:border-red-500 transition duration-150"
                                value={periodo}
                                onChange={(e) => setPeriodo(e.target.value)}
                            >
                                <option value="diario">Ventas Diarias (Turnos)</option>
                                <option value="semanal">Ventas Semanales (Días)</option>
                                <option value="mensual">Ventas Mensuales (Semanas)</option>
                            </select>
                        </div>
                        
                        {/* Selector de Métrica */}
                        <div className="flex flex-col">
                            <label htmlFor="metrica" className="text-sm font-medium text-gray-300 mb-1">Métrica a Visualizar</label>
                            <select 
                                id="metrica" 
                                className="p-3 border border-gray-700 rounded-lg bg-gray-700 text-gray-100 focus:ring-red-500 focus:border-red-500 transition duration-150"
                                value={metrica}
                                onChange={(e) => setMetrica(e.target.value)}
                            >
                                <option value="venta">Ventas (Bs.)</option>
                                <option value="transacciones">Transacciones</option>
                            </select>
                        </div>

                        {/* Botón de Generar (Estilo Rojo Vibrante) */}
                        <button 
                            onClick={generarReporte} 
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg shadow-red-500/50 shadow-md transition duration-300 ease-in-out transform hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Generando...' : 'Generar Reporte'}
                        </button>
                    </div>
                </div>

                {/* Contenedor de Resultados del Reporte */}
                <div 
                    id="resultado-reporte" 
                    className={`transition-opacity duration-500 ${isReportVisible ? 'opacity-100' : 'opacity-0'}`}
                >
                    <h2 className="text-2xl font-bold text-gray-200 mb-6">{reporteTitulo}</h2>

                    {/* Tarjetas de Métricas Clave */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        
                        {/* Venta Total */}
                        <div className="bg-gray-800 p-5 rounded-xl shadow-2xl border-b-4 border-red-500 hover:shadow-red-500/30 transition duration-300">
                            <p className="text-sm font-medium text-gray-400">Ventas Totales (Bs.)</p>
                            <p className="text-3xl font-bold text-red-400 mt-1">{formatBs(metricas.ventas)}</p>
                            <p className="text-xs text-green-400 mt-2">▲ +5.2% vs. Periodo Anterior</p>
                        </div>

                        {/* Ticket Promedio */}
                        <div className="bg-gray-800 p-5 rounded-xl shadow-2xl border-b-4 border-blue-500 hover:shadow-blue-500/30 transition duration-300">
                            <p className="text-sm font-medium text-gray-400">Ticket Promedio (Bs.)</p>
                            <p className="text-3xl font-bold text-blue-400 mt-1">{formatBs(metricas.ticket)}</p>
                            <p className="text-xs text-red-400 mt-2">▼ -1.5% vs. Periodo Anterior</p>
                        </div>

                        {/* Total Transacciones */}
                        <div className="bg-gray-800 p-5 rounded-xl shadow-2xl border-b-4 border-yellow-500 hover:shadow-yellow-500/30 transition duration-300">
                            <p className="text-sm font-medium text-gray-400">Total Transacciones</p>
                            <p className="text-3xl font-bold text-yellow-400 mt-1">{formatNumber(metricas.transacciones)}</p>
                            <p className="text-xs text-green-400 mt-2">▲ +6.9% vs. Periodo Anterior</p>
                        </div>

                        {/* Margen Bruto */}
                        <div className="bg-gray-800 p-5 rounded-xl shadow-2xl border-b-4 border-purple-500 hover:shadow-purple-500/30 transition duration-300">
                            <p className="text-sm font-medium text-gray-400">Margen Bruto (%)</p>
                            <p className="text-3xl font-bold text-purple-400 mt-1">{metricas.margen.toFixed(1)}%</p>
                            <p className="text-xs text-green-400 mt-2">▲ +0.8 pts vs. Periodo Anterior</p>
                        </div>
                    </div>
                    
                    {/* Fila para el Histograma (Gráfico de Barras Dinámico) */}
                    {/* Altura ajustada a 450px para el área del gráfico */}
                    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700 mb-8 h-[450px]">
                        <HistogramChartMock 
                            data={detalleData} // Usamos detalleData para el histograma
                            title={currentHistogramTitle} 
                            selectedMetric={metrica}
                            formatBs={formatBs}
                            formatNumber={formatNumber}
                        />
                    </div>

                    {/* Tabla de Datos Detallados (Ahora incluye ambas métricas) */}
                    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl overflow-x-auto border border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-200 mb-4">{getDetalleTableTitle()}</h3>
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-700/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Periodo</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Venta (Bs.)</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Crecimiento Venta (%)</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Transacciones</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Crecimiento Transacciones (%)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {detalleData.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-700 transition duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">{item.periodo}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatBs(item.venta)}</td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${item.crecimientoVenta.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                                            {item.crecimientoVenta.startsWith('+') ? '▲ ' : '▼ '} {item.crecimientoVenta}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{formatNumber(item.transacciones)}</td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${item.crecimientoTransacciones.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                                            {item.crecimientoTransacciones.startsWith('+') ? '▲ ' : '▼ '} {item.crecimientoTransacciones}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                {/* Modal para mensajes (sustituto de alert) */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
                        <div className="bg-gray-800 p-6 rounded-lg shadow-2xl text-center border border-gray-700">
                            <p className="text-lg font-semibold text-gray-200 mb-4">{modalMessage}</p>
                            {!isLoading && (
                                <button 
                                    onClick={() => setShowModal(false)} 
                                    className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-150 shadow-red-500/50 shadow-md"
                                >
                                    Aceptar
                                </button>
                            )}
                            {isLoading && (
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mt-4"></div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportesDeVentas;