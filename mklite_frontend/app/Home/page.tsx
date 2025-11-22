'use client'; 

import React, { useState, useRef, useEffect } from 'react'; 
import Image from 'next/image'; 
import { useRouter } from 'next/navigation'; 
import styles from './HomePage.module.css'; 
// --- 1. Tipos ---
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
  onAddToCart: (product: Product, qty: number) => void;
};

type ProductShelfProps = {
  id: string;
  title: string;
  products: Product[];
  forwardRef: React.RefObject<HTMLElement | null>; 
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product, qty: number) => void;
};

type ProductModalProps = {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, qty: number) => void;
};

type ConfirmationModalProps = {
  isOpen: boolean;
  onKeepShopping: () => void;
  onGoToCart: () => void;
};

// --- 2. Componentes Auxiliares ---

const ConfirmationModal = ({ isOpen, onKeepShopping, onGoToCart }: ConfirmationModalProps) => {
  if (!isOpen) return null;
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.confirmationWindow}>
        <div className={styles.confirmationIcon}>✅</div>
        <h3 className={styles.confirmationTitle}>¡Agregado!</h3>
        <p className={styles.confirmationText}>El producto se añadió a tu carrito.</p>
        <div className={styles.confirmationButtons}>
          <button onClick={onKeepShopping} className={styles.btnKeepShopping}>Seguir viendo</button>
          <button onClick={onGoToCart} className={styles.btnGoToCart}>Ir al carrito</button>
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ product, onCardClick, onAddToCart }: ProductCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const handleIncrement = (e: React.MouseEvent) => { e.stopPropagation(); setQuantity(prev => prev + 1); };
  const handleDecrement = (e: React.MouseEvent) => { e.stopPropagation(); setQuantity(prev => (prev > 1 ? prev - 1 : 1)); };
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, quantity);
    setQuantity(1);
  };

  return (
    <div onClick={() => onCardClick(product)} className={styles.productCard}>
      <div className={styles.cardImage}>
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <Image src="/Imagines/arroz.jpeg" alt={product.nombre} fill style={{ objectFit: 'contain', padding: '10px' }} />
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
          <button onClick={handleAddToCart} className={styles.addButton}>Agregar</button>
        </div>
      </div>
    </div>
  );
};

const ProductShelf = ({ id, title, products, forwardRef, onProductClick, onAddToCart }: ProductShelfProps) => (
  // Añadimos el ID a la sección para que el observador sepa cuál es
  <section id={id} ref={forwardRef} className={styles.productShelf}>
    <h2 className={styles.shelfTitle}>{title}</h2>
    <div className={styles.productGrid}>
      {products.map((producto) => (
        <ProductCard key={producto.id} product={producto} onCardClick={onProductClick} onAddToCart={onAddToCart} />
      ))}
    </div>
  </section>
);

const ProductModal = ({ product, onClose, onAddToCart }: ProductModalProps) => {
  if (!product) return null;
  const [quantityModal, setQuantityModal] = useState(1);
  const handleIncrementModal = (e: React.MouseEvent) => { e.stopPropagation(); setQuantityModal(prev => prev + 1); };
  const handleDecrementModal = (e: React.MouseEvent) => { e.stopPropagation(); setQuantityModal(prev => (prev > 1 ? prev - 1 : 1)); };
  const handleAddToCartModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, quantityModal);
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
               <Image src="/Imagines/arroz.jpeg" alt={product.nombre} fill style={{ objectFit: 'contain' }} />
             </div>
          </div>
          <div className={styles.modalInfo}>
            <h1 className={styles.modalTitle}>{product.nombre}</h1>
            <p className={styles.modalDescription}>{product.description}</p>
            <h2 className={styles.modalPrice}>{product.precio}</h2>
            <div className={styles.modalButtonsContainer}>
              <div className={styles.qtySelectorModal}>
                <button onClick={handleDecrementModal} className={styles.qtyBtnModal}>-</button>
                <span className={styles.qtyValueModal}>{quantityModal}</span>
                <button onClick={handleIncrementModal} className={styles.qtyBtnModal}>+</button>
              </div>
              <button onClick={handleAddToCartModal} className={styles.modalButton}>🛒 Añadir al Carrito</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- 6. Componente Principal ---
export default function HomePage() {
  const router = useRouter(); 
  
  // Refs para cada sección
  const categoryRefs = {
    abarrotes: useRef<HTMLElement | null>(null),
    bebidas: useRef<HTMLElement | null>(null),
    carnes: useRef<HTMLElement | null>(null),
    frutas: useRef<HTMLElement | null>(null),
    verduras: useRef<HTMLElement | null>(null),
    lacteos: useRef<HTMLElement | null>(null),
    panaderia: useRef<HTMLElement | null>(null),
    limpieza: useRef<HTMLElement | null>(null),
    personal: useRef<HTMLElement | null>(null),
    cereales: useRef<HTMLElement | null>(null),
  };

  const [activeCategory, setActiveCategory] = useState<string>('abarrotes');
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-150px 0px -70% 0px', // Ajuste para detectar cuando la sección está arriba
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Cuando una sección entra en la zona visible, actualizamos el estado
          setActiveCategory(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observamos todas las secciones
    Object.values(categoryRefs).forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);


  const handleScrollTo = (key: string) => {
    const ref = categoryRefs[key as keyof typeof categoryRefs];
    if (ref && ref.current) {
      
      const y = ref.current.getBoundingClientRect().top + window.pageYOffset - 140;
      window.scrollTo({ top: y, behavior: 'smooth' });
     
    }
  };

  // Cargar carrito
  useEffect(() => {
    const cartJson = localStorage.getItem('mklite_cart');
    if (cartJson) {
      const cart = JSON.parse(cartJson);
      // @ts-ignore
      const totalQty = cart.reduce((acc, item) => acc + item.quantity, 0);
      setCartCount(totalQty);
    }
  }, []);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailOpen(true);
  };

  const handleAddToCart = (product: Product, qty: number) => {
    const cartJson = localStorage.getItem('mklite_cart');
    let cart = cartJson ? JSON.parse(cartJson) : [];
    const priceNum = parseFloat(product.precio.replace('Bs. ', ''));
    // @ts-ignore
    const existingItemIndex = cart.findIndex((item) => item.id === product.id);

    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += qty;
    } else {
      cart.push({ ...product, quantity: qty, priceNumeric: priceNum });
    }
    localStorage.setItem('mklite_cart', JSON.stringify(cart));

    setCartCount(prev => prev + qty); 
    setIsConfirmationOpen(true); 
  };

  const handleKeepShopping = () => setIsConfirmationOpen(false);
  const handleGoToCart = () => { setIsConfirmationOpen(false); router.push('/carrito'); };

  // Datos de ejemplo
  const productData: { [key: string]: Product[] } = {
    abarrotes: [ { id: 101, nombre: 'Arroz Grano de Oro 1Kg', precio: 'Bs. 7.00', description: 'Arroz de primera calidad.', image: '/imagines/arroz.jpeg' }, { id: 102, nombre: 'Fideo Lazzaroni 1Kg', precio: 'Bs. 6.00', description: 'Fideo para sopas y guisos.', image: '/images/fideo.png' }, ],
    bebidas: [ { id: 201, nombre: 'Coca Cola 2L', precio: 'Bs. 10.00', description: 'Refresco sabor cola.', image: '/images/coca.png' }, { id: 202, nombre: 'Agua Vital 2L', precio: 'Bs. 5.00', description: 'Agua sin gas.', image: '/images/agua.png' }, ],
    carnes: [ { id: 301, nombre: 'Pollo Sofía (Kg)', precio: 'Bs. 15.00', description: 'Pollo fresco entero.', image: '/images/pollo.png' }, { id: 302, nombre: 'Carne Molida Especial', precio: 'Bs. 30.00', description: 'Carne de res seleccionada.', image: '/images/carne.png' }, ],
    frutas: [ { id: 401, nombre: 'Manzana Fuji (Kg)', precio: 'Bs. 12.00', description: 'Manzanas rojas importadas.', image: '/images/manzana.png' }, { id: 402, nombre: 'Banana (Kg)', precio: 'Bs. 5.00', description: 'Banana chapare.', image: '/images/banana.png' }, { id: 403, nombre: 'Naranja (Kg)', precio: 'Bs. 8.00', description: 'Naranja para jugo.', image: '/images/naranja.png' }, { id: 404, nombre: 'Uva Verde (Kg)', precio: 'Bs. 14.00', description: 'Uva sin semilla.', image: '/images/uva.png' }, { id: 405, nombre: 'Piña (Und)', precio: 'Bs. 10.00', description: 'Piña dulce.', image: '/images/pina.png' } ],
    verduras: [ { id: 501, nombre: 'Tomate (Kg)', precio: 'Bs. 7.00', description: 'Tomate perita.', image: '/images/tomate.png' }, { id: 502, nombre: 'Lechuga Crespa', precio: 'Bs. 3.00', description: 'Lechuga hidropónica.', image: '/images/lechuga.png' }, ],
    lacteos: [ { id: 601, nombre: 'Leche PIL 1L', precio: 'Bs. 6.00', description: 'Leche entera pasteurizada.', image: '/images/leche.png' }, { id: 602, nombre: 'Yogurt Bebible 1L', precio: 'Bs. 12.00', description: 'Yogurt sabor frutilla.', image: '/images/yogurt.png' }, ],
    panaderia: [ { id: 701, nombre: 'Pan Molde Blanco', precio: 'Bs. 10.00', description: 'Pan suave para sandwich.', image: '/images/pan.png' }, { id: 702, nombre: 'Pan Integral', precio: 'Bs. 12.00', description: 'Alto en fibra.', image: '/images/pan_integral.png' }, ],
    limpieza: [ { id: 801, nombre: 'Lavandina 1L', precio: 'Bs. 5.00', description: 'Desinfectante potente.', image: '/images/lavandina.png' }, { id: 802, nombre: 'Detergente OMO', precio: 'Bs. 15.00', description: 'Detergente en polvo.', image: '/images/detergente.png' }, ],
    personal: [ { id: 901, nombre: 'Shampoo Sedal', precio: 'Bs. 22.00', description: 'Para cabello liso.', image: '/images/shampoo.png' }, { id: 902, nombre: 'Jabón Lux (Pack 3)', precio: 'Bs. 10.00', description: 'Jabón de tocador.', image: '/images/jabon.png' }, ],
    cereales: [ { id: 1001, nombre: 'Galletas Mabel', precio: 'Bs. 4.00', description: 'Galletas de agua.', image: '/images/galletas.png' }, { id: 1002, nombre: 'Cereal Chocapic', precio: 'Bs. 25.00', description: 'Cereal de chocolate.', image: '/images/cereal.png' }, ],
  };

  // Lista de categorías
  const categoriesList = [
    { key: 'abarrotes', label: 'Abarrotes' },
    { key: 'bebidas', label: 'Bebidas' },
    { key: 'carnes', label: 'Carnes' },
    { key: 'frutas', label: 'Frutas' },
    { key: 'verduras', label: 'Verduras' },
    { key: 'lacteos', label: 'Lácteos' },
    { key: 'panaderia', label: 'Panadería' },
    { key: 'limpieza', label: 'Limpieza' },
    { key: 'personal', label: 'Personal' },
    { key: 'cereales', label: 'Cereales' },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>MERCADO LITE</div>
          <input type="text" placeholder="¿Qué estás buscando?" className={styles.searchBar} />
          <div className={styles.userNav}>
            <span>Cuenta</span>
            <div className={styles.cartContainer} onClick={handleGoToCart}>
              <span className={styles.cartIcon}>🛒</span>
              {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
              <span style={{ marginLeft: '8px' }}>Carrito</span>
            </div>
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
          {categoriesList.map((cat) => (
            <span 
              key={cat.key}
              onClick={() => handleScrollTo(cat.key)} 
              // Comparamos la categoría activa con la clave de la lista
              className={`${styles.categoryLink} ${activeCategory === cat.key ? styles.categoryLinkActive : ''}`}
            >
              {cat.label}
            </span>
          ))}
        </div>

        <div className={styles.shelfContainer}>
          {categoriesList.map((cat) => (
              <ProductShelf 
                key={cat.key}
                id={cat.key} 
                title={cat.label} 
                products={productData[cat.key] || []} 
                forwardRef={categoryRefs[cat.key as keyof typeof categoryRefs]} 
                onProductClick={handleProductClick}
                onAddToCart={handleAddToCart} 
              />
          ))}
        </div>
      </section>

      {isDetailOpen && <ProductModal product={selectedProduct} onClose={() => setIsDetailOpen(false)} onAddToCart={handleAddToCart} />}
      <ConfirmationModal isOpen={isConfirmationOpen} onKeepShopping={handleKeepShopping} onGoToCart={handleGoToCart} />
    </div>
  );
}