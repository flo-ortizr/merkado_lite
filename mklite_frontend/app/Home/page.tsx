'use client'; // <-- OBLIGATORIO para 'useState' y 'onClick'

import React from 'react'; // Importamos React para usar 'useRef' y 'useState'

// --- Colores ---
const colorAhorro = '#dc2626'; // Rojo para la etiqueta "Ahorrado"
const colorBotones = '#1a1a1a'; // Negro para los botones

// --- 1. Definimos los "Tipos" para TypeScript ---
type Product = {
  id: number;
  nombre: string;
  precio: string;
  description: string; // NUEVO: para el modal
};
type ProductCardProps = {
  product: Product; // CAMBIO: Pasamos el producto completo
  onCardClick: (product: Product) => void; // NUEVO: Función para abrir el modal
};
type ProductShelfProps = {
  title: string;
  products: Product[];
  forwardRef: React.RefObject<HTMLElement | null>; 
  onProductClick: (product: Product) => void; // NUEVO: Función para abrir el modal
};
// NUEVO: Tipo para el Modal
type ProductModalProps = {
  product: Product | null;
  onClose: () => void; // Función para cerrar el modal
};


// --- 2. Definimos el Componente de Tarjeta de Producto (SIMPLIFICADO) ---
const ProductCard = ({ product, onCardClick }: ProductCardProps) => {

  // Esta función SÓLO se activa con el botón "+"
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // ¡CLAVE! Evita que se abra el modal.
    alert(`"${product.nombre}" añadido al carrito (próximamente)`);
  };

  // Esta función se activa al hacer clic en CUALQUIER OTRA PARTE de la tarjeta
  const handleCardClick = () => {
    onCardClick(product);
  };

  return (
    <div 
      onClick={handleCardClick} // <-- CAMBIO: Clic en la tarjeta
      style={{ 
        backgroundColor: '#fff', 
        borderRadius: '10px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
        overflow: 'hidden',
        cursor: 'pointer' // Indica que se puede hacer clic
      }}
    >
      <div style={{ height: '140px', backgroundColor: '#bbb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>
        (Imagen del producto)
      </div>
      <div style={{ padding: '15px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '10px', minHeight: '32px', color: '#333' }}>
          {product.nombre}
        </h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#333' }}>
            {product.precio}
          </span>
          {/* CAMBIO: Botón "+" ahora tiene su propio onClick */}
          <button 
            onClick={handleAddToCart} 
            style={{ 
              backgroundColor: colorBotones, 
              color: '#fff', 
              border: 'none', 
              borderRadius: '50%', 
              width: '35px', 
              height: '35px', 
              fontSize: '20px', 
              cursor: 'pointer', 
              lineHeight: '35px',
              zIndex: 2 // Asegura que esté "encima" del clic de la tarjeta
            }}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
};

// --- 3. Definimos el Componente de Fila de Productos ---
const ProductShelf = ({ title, products, forwardRef, onProductClick }: ProductShelfProps) => ( // CAMBIO: Añadido 'onProductClick'
  <section ref={forwardRef} style={{ marginBottom: '40px', paddingTop: '20px' }}>
    <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'left', color: '#333' }}>
      {title}
    </h2>
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(5, 1fr)', // 5 columnas
      gap: '20px' 
    }}>
      {products.map((producto) => (
        <ProductCard 
          key={producto.id}
          product={producto} // CAMBIO: Pasamos el producto completo
          onCardClick={onProductClick} // CAMBIO: Pasamos la función
        />
      ))}
    </div>
  </section>
);

// --- ¡NUEVO! Componente de Modal (Ventana Emergente) ---
const ProductModal = ({ product, onClose }: ProductModalProps) => {
  if (!product) return null;

  return (
    // Fondo Oscuro
    <div 
      onClick={onClose} // Cierra el modal si se hace clic en el fondo
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000 // Asegura que esté por encima de todo
      }}
    >
      {/* Ventana Blanca (Más grande que el ejemplo) */}
      <div 
        onClick={(e) => e.stopPropagation()} // Evita que el clic en la ventana cierre el modal
        style={{
          backgroundColor: '#fff',
          padding: '30px',
          borderRadius: '10px',
          width: '800px', // Más grande que el ejemplo
          maxWidth: '90%',
          position: 'relative'
        }}
      >
        {/* Botón de Cerrar (X) */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: '#eee',
            border: 'none',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          X
        </button>

        {/* Contenido del Modal (como el de Hipermaxi/Televisor) */}
        <div style={{ display: 'flex', gap: '30px' }}>
          
          {/* Columna Izquierda: Imagen */}
          <div style={{ 
            flex: 1, 
            backgroundColor: '#f0f0f0', 
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '400px',
            color: '#888'
          }}>
            (Imagen del producto)
          </div>

          {/* Columna Derecha: Info */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '15px' }}>{product.nombre}</h1>
            <p style={{ fontSize: '16px', color: '#666', marginBottom: '10px' }}>Descripción del Producto:</p>
            <p style={{ fontSize: '16px', color: '#333', marginBottom: '20px', minHeight: '50px' }}>
              {product.description}
            </p>
            
            <span style={{ fontSize: '16px', color: '#888' }}>Categoría: sadfasd</span>
            
            <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#333', margin: '20px 0' }}>
              {product.precio}
            </h2>

            {/* Botones del Modal */}
            <div style={{ display: 'flex', gap: '15px', marginTop: 'auto' }}>
              <button 
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: '15px',
                  border: '1px solid #ccc',
                  borderRadius: '5px',
                  backgroundColor: '#fff',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                Cerrar
              </button>
              <button style={{
                flex: 2, // Botón más grande
                backgroundColor: colorBotones, // Botón negro
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                padding: '15px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}>
                🛒 Añadir al carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- 4. Componente Principal de la Página ---
export default function HomePage() {

  // --- 5. Definimos las 'Refs' para el Scroll (10 refs) ---
  const abarrotesRef = React.useRef<HTMLElement | null>(null);
  const bebidasRef = React.useRef<HTMLElement | null>(null);
  const carnesRef = React.useRef<HTMLElement | null>(null);
  const frutasRef = React.useRef<HTMLElement | null>(null);
  const verdurasRef = React.useRef<HTMLElement | null>(null);
  const lacteosRef = React.useRef<HTMLElement | null>(null);
  const panaderiaRef = React.useRef<HTMLElement | null>(null);
  const limpiezaRef = React.useRef<HTMLElement | null>(null);
  const cuidadoPersonalRef = React.useRef<HTMLElement | null>(null);
  const cerealesRef = React.useRef<HTMLElement | null>(null);

  // --- 6. Definimos la Función de Scroll ---
  const handleScrollTo = (ref: React.RefObject<HTMLElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  // --- ¡NUEVO! Estado para el Modal ---
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);

  // --- ¡NUEVO! Función para ABRIR el Modal ---
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product); // Guarda qué producto abrimos
    setIsModalOpen(true); // Abre el modal
  };

  // --- 7. Definimos los Datos de los Productos (¡con descripción!) ---
  const productData: { [key: string]: Product[] } = {
    abarrotes: [ { id: 101, nombre: 'Arroz 1Kg', precio: 'Bs. 7.00', description: 'Arroz grano de oro, tipo 1.' }, { id: 102, nombre: 'Fideo 1Kg', precio: 'Bs. 6.00', description: 'Fideo de sémola, ideal para sopas.' }, ],
    bebidas: [ { id: 201, nombre: 'Coca Cola 2L', precio: 'Bs. 10.00', description: 'Refresco carbonatado sabor cola.' }, { id: 202, nombre: 'Agua Vital 2L', precio: 'Bs. 5.00', description: 'Agua de mesa purificada.' }, ],
    carnes: [ { id: 301, nombre: 'Pollo (Kg)', precio: 'Bs. 15.00', description: 'Pollo fresco, precio por Kg.' }, { id: 302, nombre: 'Carne Molida (Kg)', precio: 'Bs. 30.00', description: 'Carne de res molida especial.' }, ],
    frutas: [ { id: 401, nombre: 'Manzana Fuji (Kg)', precio: 'Bs. 12.00', description: 'Manzana roja dulce y crujiente.' }, { id: 402, nombre: 'Banana (Kg)', precio: 'Bs. 5.00', description: 'Banana de exportación.' }, { id: 403, nombre: 'Naranja (Kg)', precio: 'Bs. 8.00', description: 'Naranja para jugo.' }, { id: 404, nombre: 'Uva (Kg)', precio: 'Bs. 14.00', description: 'Uva verde sin semilla.' }, { id: 405, nombre: 'Piña (Und)', precio: 'Bs. 10.00', description: 'Piña hawaiana.' }, { id: 406, nombre: 'Sandía (Und)', precio: 'Bs. 20.00', description: 'Sandía grande.' }, { id: 407, nombre: 'Pera (Kg)', precio: 'Bs. 13.00', description: 'Pera de agua.' }, { id: 408, nombre: 'Kiwi (Kg)', precio: 'Bs. 25.00', description: 'Kiwi importado.' }, { id: 409, nombre: 'Mango (Und)', precio: 'Bs. 4.00', description: 'Mango de temporada.' }, { id: 410, nombre: 'Papaya (Und)', precio: 'Bs. 9.00', description: 'Papaya mediana.' }, ],
    verduras: [ { id: 501, nombre: 'Tomate (Kg)', precio: 'Bs. 7.00', description: 'Tomate manzano para ensalada.' }, { id: 502, nombre: 'Lechuga (Und)', precio: 'Bs. 3.00', description: 'Lechuga crespa.' }, { id: 503, nombre: 'Papa (Kg)', precio: 'Bs. 4.00', description: 'Papa holandesa.' }, { id: 504, nombre: 'Cebolla (Kg)', precio: 'Bs. 5.00', description: 'Cebolla roja.' }, { id: 505, nombre: 'Zanahoria (Kg)', precio: 'Bs. 6.00', description: 'Zanahoria fresca.' }, { id: 506, nombre: 'Pimentón (Kg)', precio: 'Bs. 8.00', description: 'Pimentón rojo.' }, { id: 507, nombre: 'Brócoli (Und)', precio: 'Bs. 7.00', description: 'Brócoli fresco.' }, { id: 508, nombre: 'Palta (Und)', precio: 'Bs. 5.00', description: 'Palta (aguacate) mediana.' }, { id: 509, nombre: 'Ajo (Cabeza)', precio: 'Bs. 2.00', description: 'Cabeza de ajo.' }, { id: 510, nombre: 'Zapallo (Kg)', precio: 'Bs. 5.00', description: 'Zapallo macre.' }, ],
    lacteos: [ { id: 601, nombre: 'Leche PIL 1 Litro', precio: 'Bs. 5.50', description: 'Leche fresca UHT.' }, { id: 602, nombre: 'Yogurt 1L', precio: 'Bs. 10.00', description: 'Yogurt bebible sabor frutilla.' }, ],
    panaderia: [ { id: 701, nombre: 'Pan Molde Blanco', precio: 'Bs. 10.00', description: 'Pan de molde sin corteza.' }, { id: 702, nombre: 'Pan Integral', precio: 'Bs. 12.00', description: 'Pan integral con semillas.' }, ],
    limpieza: [ { id: 801, nombre: 'Lavandina 1L', precio: 'Bs. 8.00', description: 'Lavandina (cloro) al 5%.' }, { id: 802, nombre: 'Detergente 1L', precio: 'Bs. 15.00', description: 'Detergente líquido lavaplatos.' }, ],
    cuidadoPersonal: [ { id: 901, nombre: 'Shampoo 400ml', precio: 'Bs. 22.00', description: 'Shampoo anticaspa.' }, { id: 902, nombre: 'Jabón (Pack 3)', precio: 'Bs. 10.00', description: 'Jabón de tocador.' }, ],
    cereales: [ { id: 1001, nombre: 'Galletas de Agua Gacela', precio: 'Bs. 12.00', description: 'Paquete de 3 tacos.' }, { id: 1002, nombre: 'Cereal Flips', precio: 'Bs. 18.00', description: 'Cereal de arroz sabor chocolate.' }, ],
  };


  // --- 8. El HTML (JSX) ---
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f0f0' }}>

      {/* Header */}
      <header style={{ backgroundColor: '#1a1a1a', color: '#fff', padding: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '0 20px' }}>
          <div style={{ fontWeight: 'bold', fontSize: '24px', color: '#fff' }}>MERCADO LITE</div>
          <input type="text" placeholder="Buscar productos por nombre..." style={{ padding: '10px', width: '400px', borderRadius: '5px', border: 'none', backgroundColor: '#fff', color: '#333' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ cursor: 'pointer' }}>Account</span>
            <span style={{ cursor: 'pointer' }}>Cart</span>
          </div>
        </div>
      </header>

      {/* Main Section */}
      <section style={{ padding: '0', textAlign: 'center' }}>
        
        {/* Banner Principal */}
        <div style={{
          backgroundColor: '#1a1a1a', padding: '20px', marginBottom: '0', height: '700px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff'
        }}>
          <div style={{ textAlign: 'left', maxWidth: '50%', padding: '0 40px' }}>
            <span style={{ backgroundColor: '#555', color: '#fff', padding: '5px 10px', borderRadius: '5px', fontSize: '14px', fontWeight: 'bold', marginBottom: '10px', display: 'inline-block' }}>
              Oferta Flash!
            </span>
            <h1 style={{ fontSize: '48px', marginBottom: '10px', color: '#fff' }}>Alimentos Frescos Delivery Fast</h1>
            <p style={{ fontSize: '18px', color: '#ccc' }}>Recibe productos frescos, artículos de despensa y todo para tu hogar en la puerta de tu casa en menos de 30 minutos.</p>
            <button style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#555', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '20px' }}>
              Comprar ahora
            </button>
          </div>
          <div style={{ width: '45%', height: '460px', backgroundColor: '#888', borderRadius: '10px', marginRight: '40px' }}>
          </div>
        </div>

        {/* --- BARRA DE 10 CATEGORÍAS (FULL ANCHO) --- */}
        <div style={{ 
          display: 'grid', gridTemplateColumns: 'repeat(10, 1fr)', backgroundColor: '#fff',
          borderBottom: '1px solid #ddd', padding: '15px 0' 
        }}>
          <span onClick={() => handleScrollTo(abarrotesRef)} style={{ color: '#000', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', textAlign: 'center', padding: '0 5px' }}>Abarrotes</span>
          <span onClick={() => handleScrollTo(bebidasRef)} style={{ color: '#000', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', textAlign: 'center', padding: '0 5px' }}>Bebidas</span>
          <span onClick={() => handleScrollTo(carnesRef)} style={{ color: '#000', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', textAlign: 'center', padding: '0 5px' }}>Carnes</span>
          <span onClick={() => handleScrollTo(frutasRef)} style={{ color: '#000', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', textAlign: 'center', padding: '0 5px' }}>Frutas</span>
          <span onClick={() => handleScrollTo(verdurasRef)} style={{ color: '#000', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', textAlign: 'center', padding: '0 5px' }}>Verduras</span>
          <span onClick={() => handleScrollTo(lacteosRef)} style={{ color: '#000', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', textAlign: 'center', padding: '0 5px' }}>Lácteos</span>
          <span onClick={() => handleScrollTo(panaderiaRef)} style={{ color: '#000', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', textAlign: 'center', padding: '0 5px' }}>Panadería</span>
          <span onClick={() => handleScrollTo(limpiezaRef)} style={{ color: '#000', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', textAlign: 'center', padding: '0 5px' }}>Limpieza</span>
          <span onClick={() => handleScrollTo(cuidadoPersonalRef)} style={{ color: '#000', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', textAlign: 'center', padding: '0 5px' }}>C. Personal</span>
          <span onClick={() => handleScrollTo(cerealesRef)} style={{ color: '#000', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', textAlign: 'center', padding: '0 5px' }}>Cereales</span>
        </div>

        {/* --- FILAS DE PRODUCTOS --- */}
        <div style={{ padding: '40px 20px 0 20px', maxWidth: '1200px', margin: 'auto' }}>
          {/* CAMBIO: Pasamos la función 'handleProductClick' a cada fila */}
          <ProductShelf title="Abarrotes" products={productData.abarrotes} forwardRef={abarrotesRef} onProductClick={handleProductClick} />
          <ProductShelf title="Bebidas" products={productData.bebidas} forwardRef={bebidasRef} onProductClick={handleProductClick} />
          <ProductShelf title="Carnes" products={productData.carnes} forwardRef={carnesRef} onProductClick={handleProductClick} />
          <ProductShelf title="Frutas frescas" products={productData.frutas} forwardRef={frutasRef} onProductClick={handleProductClick} />
          <ProductShelf title="Verduras" products={productData.verduras} forwardRef={verdurasRef} onProductClick={handleProductClick} />
          <ProductShelf title="Productos lácteos" products={productData.lacteos} forwardRef={lacteosRef} onProductClick={handleProductClick} />
          <ProductShelf title="Panadería" products={productData.panaderia} forwardRef={panaderiaRef} onProductClick={handleProductClick} />
          <ProductShelf title="Limpieza" products={productData.limpieza} forwardRef={limpiezaRef} onProductClick={handleProductClick} />
          <ProductShelf title="Cuidado Personal" products={productData.cuidadoPersonal} forwardRef={cuidadoPersonalRef} onProductClick={handleProductClick} />
          <ProductShelf title="Cereales y Bocadillos" products={productData.cereales} forwardRef={cerealesRef} onProductClick={handleProductClick} />
        </div>

      </section>

      {/* --- ¡NUEVO! RENDERIZADO DEL MODAL --- */}
      {/* Esto solo se mostrará si 'isModalOpen' es 'true' */}
      {isModalOpen && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}

    </div>
  );
}
