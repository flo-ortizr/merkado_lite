'use client'; 

import React, { useState } from 'react'; 
import Image from 'next/image'; 
import styles from './HomePage.module.css'; 

// --- 1. Definimos los "Tipos" ---
type Product = {
  id: number;
  nombre: string;
  precio: string;
  description: string;
  image: string;
};

type ProductCardProps = {
  product: Product;
  onCardClick: (product: Product) => void;
};

type ProductShelfProps = {
  title: string;
  products: Product[];
  forwardRef: React.RefObject<HTMLElement | null>; 
  onProductClick: (product: Product) => void;
};

type ProductModalProps = {
  product: Product | null;
  onClose: () => void;
};

// --- 2. Tarjeta de Producto (CON CONTADOR Y BOTÓN AGREGAR) ---
const ProductCard = ({ product, onCardClick }: ProductCardProps) => {
  
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setQuantity(prev => prev + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    alert(`Agregado: ${quantity} unidad(es) de "${product.nombre}" al carrito.`);
    setQuantity(1); 
  };

  return (
    <div onClick={() => onCardClick(product)} className={styles.productCard}>
      <div className={styles.cardImage}>
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <Image 
            src={product.image} 
            alt={product.nombre} 
            fill 
            style={{ objectFit: 'contain', padding: '10px' }} 
          />
        </div>
      </div>
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{product.nombre}</h3>
        <span className={styles.cardPrice}>{product.precio}</span>
        
        <div className={styles.actionRow}>
          <div className={styles.qtySelector}>
            <button onClick={handleDecrement} className={styles.qtyBtn}>-</button>
            <span className={styles.qtyValue}>{quantity}</span>
            <button onClick={handleIncrement} className={styles.qtyBtn}>+</button>
          </div>

          <button onClick={handleAddToCart} className={styles.addButton}>
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
};

// --- 3. Fila de Productos ---
const ProductShelf = ({ title, products, forwardRef, onProductClick }: ProductShelfProps) => (
  <section ref={forwardRef} className={styles.productShelf}>
    <h2 className={styles.shelfTitle}>{title}</h2>
    <div className={styles.productGrid}>
      {products.map((producto) => (
        <ProductCard 
          key={producto.id}
          product={producto}
          onCardClick={onProductClick}
        />
      ))}
    </div>
  </section>
);

// --- 4. Modal ---
const ProductModal = ({ product, onClose }: ProductModalProps) => {
  if (!product) return null;

  // Estado local para la cantidad en el modal (se reinicia al abrir)
  // Nota: En una app real, usarías un useEffect para resetear esto cuando cambia el producto
  const [quantityModal, setQuantityModal] = useState(1);

  const handleIncrementModal = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setQuantityModal(prev => prev + 1);
  };

  const handleDecrementModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantityModal(prev => (prev > 1 ? prev - 1 : 1));
  };

  const handleAddToCartModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    alert(`Agregado: ${quantityModal} unidad(es) de "${product.nombre}" al carrito.`);
    setQuantityModal(1);
    onClose();
  };

  return (
    <div onClick={onClose} className={styles.modalBackdrop}>
      <div onClick={(e) => e.stopPropagation()} className={styles.modalWindow}>
        <button onClick={onClose} className={styles.modalCloseButton}>X</button>
        <div className={styles.modalContent}>
          <div className={styles.modalImage}>
             <div style={{ position: 'relative', width: '100%', height: '100%' }}>
               <Image src={product.image} alt={product.nombre} fill style={{ objectFit: 'contain' }} />
             </div>
          </div>
          <div className={styles.modalInfo}>
            <h1 className={styles.modalTitle}>{product.nombre}</h1>
            <p className={styles.modalDescription}>{product.description}</p>
            <h2 className={styles.modalPrice}>{product.precio}</h2>
            
            <div className={styles.modalButtonsContainer}>
              {/* Selector de Cantidad en el Modal */}
              <div className={styles.qtySelectorModal}>
                <button onClick={handleDecrementModal} className={styles.qtyBtnModal}>-</button>
                <span className={styles.qtyValueModal}>{quantityModal}</span>
                <button onClick={handleIncrementModal} className={styles.qtyBtnModal}>+</button>
              </div>

              {/* Botón de Añadir al Carrito del Modal */}
              <button onClick={handleAddToCartModal} className={styles.modalButton}>🛒 Añadir al Carrito</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 5. Componente Principal ---
export default function HomePage() {
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

  const handleScrollTo = (ref: React.RefObject<HTMLElement | null>) => {
    if (ref.current) ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Datos de ejemplo (CORREGIDO: Eliminé el tipo explícito conflictivo)
  const productData = {
    abarrotes: [ 
      { id: 101, nombre: 'Arroz Grano de Oro 1Kg', precio: 'Bs. 7.00', description: 'Arroz de primera calidad.', image: '/imagines/arroz.jpeg' }, 
      { id: 102, nombre: 'Fideo Lazzaroni 1Kg', precio: 'Bs. 6.00', description: 'Fideo para sopas y guisos.', image: '/images/fideo.png' }, 
    ],
    bebidas: [ 
      { id: 201, nombre: 'Coca Cola 2L', precio: 'Bs. 10.00', description: 'Refresco sabor cola.', image: '/images/coca.png' }, 
      { id: 202, nombre: 'Agua Vital 2L', precio: 'Bs. 5.00', description: 'Agua sin gas.', image: '/images/agua.png' }, 
    ],
    carnes: [ 
      { id: 301, nombre: 'Pollo Sofía (Kg)', precio: 'Bs. 15.00', description: 'Pollo fresco entero.', image: '/images/pollo.png' }, 
      { id: 302, nombre: 'Carne Molida Especial', precio: 'Bs. 30.00', description: 'Carne de res seleccionada.', image: '/images/carne.png' }, 
    ],
    frutas: [ 
      { id: 401, nombre: 'Manzana Fuji (Kg)', precio: 'Bs. 12.00', description: 'Manzanas rojas importadas.', image: '/images/manzana.png' }, 
      { id: 402, nombre: 'Banana (Kg)', precio: 'Bs. 5.00', description: 'Banana chapare.', image: '/images/banana.png' }, 
      { id: 403, nombre: 'Naranja (Kg)', precio: 'Bs. 8.00', description: 'Naranja para jugo.', image: '/images/naranja.png' }, 
      { id: 404, nombre: 'Uva Verde (Kg)', precio: 'Bs. 14.00', description: 'Uva sin semilla.', image: '/images/uva.png' }, 
      { id: 405, nombre: 'Piña (Und)', precio: 'Bs. 10.00', description: 'Piña dulce.', image: '/images/pina.png' } 
    ],
    verduras: [ 
      { id: 501, nombre: 'Tomate (Kg)', precio: 'Bs. 7.00', description: 'Tomate perita.', image: '/images/tomate.png' }, 
      { id: 502, nombre: 'Lechuga Crespa', precio: 'Bs. 3.00', description: 'Lechuga hidropónica.', image: '/images/lechuga.png' }, 
    ],
    lacteos: [ 
      { id: 601, nombre: 'Leche PIL 1L', precio: 'Bs. 6.00', description: 'Leche entera pasteurizada.', image: '/images/leche.png' }, 
      { id: 602, nombre: 'Yogurt Bebible 1L', precio: 'Bs. 12.00', description: 'Yogurt sabor frutilla.', image: '/images/yogurt.png' }, 
    ],
    panaderia: [ 
      { id: 701, nombre: 'Pan Molde Blanco', precio: 'Bs. 10.00', description: 'Pan suave para sandwich.', image: '/images/pan.png' }, 
      { id: 702, nombre: 'Pan Integral', precio: 'Bs. 12.00', description: 'Alto en fibra.', image: '/images/pan_integral.png' }, 
    ],
    limpieza: [ 
      { id: 801, nombre: 'Lavandina 1L', precio: 'Bs. 5.00', description: 'Desinfectante potente.', image: '/images/lavandina.png' }, 
      { id: 802, nombre: 'Detergente OMO', precio: 'Bs. 15.00', description: 'Detergente en polvo.', image: '/images/detergente.png' }, 
    ],
    cuidadoPersonal: [ 
      { id: 901, nombre: 'Shampoo Sedal', precio: 'Bs. 22.00', description: 'Para cabello liso.', image: '/images/shampoo.png' }, 
      { id: 902, nombre: 'Jabón Lux (Pack 3)', precio: 'Bs. 10.00', description: 'Jabón de tocador.', image: '/images/jabon.png' }, 
    ],
    cereales: [ 
      { id: 1001, nombre: 'Galletas Mabel', precio: 'Bs. 4.00', description: 'Galletas de agua.', image: '/images/galletas.png' }, 
      { id: 1002, nombre: 'Cereal Chocapic', precio: 'Bs. 25.00', description: 'Cereal de chocolate.', image: '/images/cereal.png' }, 
    ],
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>MERCADO LITE</div>
          <input type="text" placeholder="¿Qué estás buscando?" className={styles.searchBar} />
          <div className={styles.userNav}>
            <span>Cuenta</span>
            <span>Carrito</span>
          </div>
        </div>
      </header>

      <section style={{ padding: '0', textAlign: 'center' }}>
        <div className={styles.banner}>
          <div className={styles.bannerText}>
            <span className={styles.bannerFlash}>OFERTA FLASH</span>
            <h1 className={styles.bannerTitle}>Frescura y Sabor en tu Hogar</h1>
            <p className={styles.bannerDescription}>Los mejores productos seleccionados para ti, con la calidad que mereces.</p>
            <button className={styles.bannerButton}>Ver Ofertas</button>
          </div>
          <div className={styles.bannerImage}></div>
        </div>

        <div className={styles.categoryBar}>
          <span onClick={() => handleScrollTo(abarrotesRef)} className={styles.categoryLink}>Abarrotes</span>
          <span onClick={() => handleScrollTo(bebidasRef)} className={styles.categoryLink}>Bebidas</span>
          <span onClick={() => handleScrollTo(carnesRef)} className={styles.categoryLink}>Carnes</span>
          <span onClick={() => handleScrollTo(frutasRef)} className={styles.categoryLink}>Frutas</span>
          <span onClick={() => handleScrollTo(verdurasRef)} className={styles.categoryLink}>Verduras</span>
          <span onClick={() => handleScrollTo(lacteosRef)} className={styles.categoryLink}>Lácteos</span>
          <span onClick={() => handleScrollTo(panaderiaRef)} className={styles.categoryLink}>Panadería</span>
          <span onClick={() => handleScrollTo(limpiezaRef)} className={styles.categoryLink}>Limpieza</span>
          <span onClick={() => handleScrollTo(cuidadoPersonalRef)} className={styles.categoryLink}>Personal</span>
          <span onClick={() => handleScrollTo(cerealesRef)} className={styles.categoryLink}>Cereales</span>
        </div>

        <div className={styles.shelfContainer}>
          <ProductShelf title="Abarrotes" products={productData.abarrotes} forwardRef={abarrotesRef} onProductClick={handleProductClick} />
          <ProductShelf title="Bebidas" products={productData.bebidas} forwardRef={bebidasRef} onProductClick={handleProductClick} />
          <ProductShelf title="Carnes" products={productData.carnes} forwardRef={carnesRef} onProductClick={handleProductClick} />
          <ProductShelf title="Frutas y Verduras" products={productData.frutas} forwardRef={frutasRef} onProductClick={handleProductClick} />
          <ProductShelf title="Verduras" products={productData.verduras} forwardRef={verdurasRef} onProductClick={handleProductClick} />
          <ProductShelf title="Lácteos" products={productData.lacteos} forwardRef={lacteosRef} onProductClick={handleProductClick} />
          <ProductShelf title="Panadería" products={productData.panaderia} forwardRef={panaderiaRef} onProductClick={handleProductClick} />
          <ProductShelf title="Limpieza" products={productData.limpieza} forwardRef={limpiezaRef} onProductClick={handleProductClick} />
          <ProductShelf title="Cuidado Personal" products={productData.cuidadoPersonal} forwardRef={cuidadoPersonalRef} onProductClick={handleProductClick} />
          <ProductShelf title="Cereales" products={productData.cereales} forwardRef={cerealesRef} onProductClick={handleProductClick} />
        </div>
      </section>

      {isModalOpen && (
        <ProductModal product={selectedProduct} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
}