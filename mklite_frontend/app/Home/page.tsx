'use client'; 

import React, { useState, useRef, useEffect } from 'react'; 
import Image from 'next/image'; 
import { useRouter } from 'next/navigation'; 
import styles from './HomePage.module.css'; 

// --- Tipos ---
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
  onAddToCart: (product: Product, qty: number) => void; // Recibe cantidad
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

// --- BANNERS ---
const BANNERS = [
  {
    id: 1,
    title: "OFERTAS BLACK WEEK",
    description: "Descuentos increíbles en productos seleccionados para tu hogar.",
    buttonText: "Ver Abarrotes",
    targetCategory: "abarrotes", 
    accentColor: "#E60012"
  },
  {
    id: 2,
    title: "FRESCOS DEL DÍA",
    description: "Frutas y verduras recién llegadas del campo a tu mesa.",
    buttonText: "Ver Frutas",
    targetCategory: "frutas",
    accentColor: "#4caf50"
  },
  {
    id: 3,
    title: "LIMPIEZA TOTAL",
    description: "Todo lo necesario para dejar tu casa reluciente.",
    buttonText: "Ver Limpieza",
    targetCategory: "limpieza",
    accentColor: "#29b6f6"
  }
];

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

// --- TARJETA CON CANTIDAD FUNCIONAL ---
const ProductCard = ({ product, onCardClick, onAddToCart }: ProductCardProps) => {
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = (e: React.MouseEvent) => { 
    e.stopPropagation(); 
    setQuantity(prev => prev + 1); 
  };
  const handleDecrement = (e: React.MouseEvent) => { 
    e.stopPropagation(); 
    setQuantity(prev => (prev > 1 ? prev - 1 : 1)); 
  };
  
  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, quantity);
    setQuantity(1);
  };

  return (
    <div onClick={() => onCardClick(product)} className={styles.productCard}>
      <div className={styles.cardImage}>
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <Image src={product.image} alt={product.nombre} fill style={{ objectFit: 'contain', padding: '5px' }} />
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
          <button onClick={handleAddClick} className={styles.addButton}>Añadir</button>
        </div>
      </div>
    </div>
  );
};

const ProductShelf = ({ id, title, products, forwardRef, onProductClick, onAddToCart }: ProductShelfProps) => {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (trackRef.current) {
      const { scrollLeft, clientWidth } = trackRef.current;
      const scrollAmount = clientWidth * 0.8; 
      const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      trackRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section id={id} ref={forwardRef} className={styles.productShelf}>
      <h2 className={styles.shelfTitle}>{title}</h2>
      
      <div className={styles.carouselContainer}>
        <button className={`${styles.sliderBtn} ${styles.sliderBtnLeft}`} onClick={() => scroll('left')}>❮</button>
        <div className={styles.productTrack} ref={trackRef}>
          {products.map((producto) => (
            <ProductCard key={producto.id} product={producto} onCardClick={onProductClick} onAddToCart={onAddToCart} />
          ))}
        </div>
        <button className={`${styles.sliderBtn} ${styles.sliderBtnRight}`} onClick={() => scroll('right')}>❯</button>
      </div>
    </section>
  );
};

const ProductModal = ({ product, onClose, onAddToCart }: ProductModalProps) => {
  if (!product) return null;
  const [quantityModal, setQuantityModal] = useState(1);
  const handleIncrementModal = (e: React.MouseEvent) => { e.stopPropagation(); setQuantityModal(prev => prev + 1); };
  const handleDecrementModal = (e: React.MouseEvent) => { e.stopPropagation(); setQuantityModal(prev => (prev > 1 ? prev - 1 : 1)); };
  const handleAddToCartModal = (e: React.MouseEvent) => { e.stopPropagation(); onAddToCart(product, quantityModal); setQuantityModal(1); onClose(); };

  return (
    <div onClick={onClose} className={styles.modalBackdrop}>
      <div onClick={(e) => e.stopPropagation()} className={styles.modalWindow}>
        <button onClick={onClose} className={styles.modalCloseButton}>×</button>
        <div className={styles.modalContent}>
          <div className={styles.modalImage}>
             <div style={{ position: 'relative', width: '100%', height: '100%' }}>
               <Image src={product.image} alt={product.nombre} fill style={{ objectFit: 'contain', padding: '20px' }} />
             </div>
          </div>
          <div className={styles.modalInfo}>
            <h1 className={styles.modalTitle}>{product.nombre}</h1>
            <p className={styles.modalDescription}>{product.description}</p>
            <div className={styles.modalCategory}>Categoría: General</div>
            <h2 className={styles.modalPrice}>{product.precio}</h2>
            <span className={styles.statusBadge}>Disponible</span>
            <div className={styles.modalFooter}>
              <div className={styles.qtySelectorModal}>
                <button onClick={handleDecrementModal} className={styles.qtyBtnModal}>-</button>
                <span className={styles.qtyValueModal}>{quantityModal}</span>
                <button onClick={handleIncrementModal} className={styles.qtyBtnModal}>+</button>
              </div>
              <button onClick={handleAddToCartModal} className={styles.btnAddPrimary}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                Añadir al carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function HomePage() {
  const router = useRouter(); 
  
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
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveCategory(entry.target.id);
      });
    }, { rootMargin: '-150px 0px -70% 0px' });

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

  useEffect(() => {
    const cartJson = localStorage.getItem('mklite_cart');
    if (cartJson) setCartCount(JSON.parse(cartJson).length);
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
      setCartCount(prev => prev + 1); 
    }
    localStorage.setItem('mklite_cart', JSON.stringify(cart));
    setIsConfirmationOpen(true); 
  };

  const handleKeepShopping = () => setIsConfirmationOpen(false);
  const handleGoToCart = () => { setIsConfirmationOpen(false); router.push('/carrito'); };

  const productData: { [key: string]: Product[] } = {
    abarrotes: [
      { id: 101, nombre: 'Arroz Grano de Oro 1Kg', precio: 'Bs. 7.00', description: 'Arroz de grano seleccionado.', image: '/Imagines/arrozz.png' },
      { id: 102, nombre: 'Fideo Lazzaroni 1Kg', precio: 'Bs. 6.50', description: 'Fideo ideal para sopas y guisos.', image: '/Imagines/fideo.png' },
      { id: 103, nombre: 'Harina Famosa 1Kg', precio: 'Bs. 6.00', description: 'Harina de trigo fortificada.', image: '/Imagines/harina.png' },
      { id: 104, nombre: 'Aceite Fino 900ml', precio: 'Bs. 11.00', description: 'Aceite vegetal puro y natural.', image: '/Imagines/aceite.png' },
      { id: 105, nombre: 'Azúcar Guabirá 1Kg', precio: 'Bs. 6.00', description: 'Azúcar blanca refinada.', image: '/Imagines/azucar.png' },
      { id: 106, nombre: 'Avena Princesa 400g', precio: 'Bs. 8.50', description: 'Avena instantánea laminada.', image: '/Imagines/Avena.png' },
      { id: 107, nombre: 'Salsa de Tomate Kris', precio: 'Bs. 5.50', description: 'Salsa lista para pastas.', image: '/Imagines/salsadetomate.png' },
      { id: 108, nombre: 'Atún Lidita al Aceite', precio: 'Bs. 9.00', description: 'Lomo de atún en aceite.', image: '/images/atun.png' },
      { id: 109, nombre: 'Sal Yodada 1Kg', precio: 'Bs. 2.00', description: 'Sal de mesa.', image: '/Imagines/sal.png' },
      { id: 110, nombre: 'Lenteja 500g', precio: 'Bs. 8.00', description: 'Lenteja seleccionada.', image: '/Imagines/lenteja.png' }
    ],
    bebidas: [
      { id: 201, nombre: 'Coca Cola 2L', precio: 'Bs. 10.00', description: 'Sabor original refrescante.', image: '/Imagines/cocacola.png' },
      { id: 202, nombre: 'Agua Vital 2L', precio: 'Bs. 5.00', description: 'Agua purificada sin gas.', image: '/Imagines/aguavital.png' },
      { id: 203, nombre: 'Simba Pomelo 2L', precio: 'Bs. 9.00', description: 'Refresco sabor pomelo.', image: '/Imagines/simbapomelo.jpg' },
      { id: 204, nombre: 'Cerveza Paceña 710ml', precio: 'Bs. 14.00', description: 'Cerveza tradicional boliviana.', image: '/Imagines/cervezapaceña.png' },
      { id: 205, nombre: 'Jugo Del Valle Durazno', precio: 'Bs. 12.00', description: 'Néctar de fruta natural.', image: '/Imagines/jugodelvalle.png' },
      { id: 206, nombre: 'Powerade Azul 600ml', precio: 'Bs. 7.00', description: 'Bebida isotónica.', image: '/Imagines/powerade.png' },
      { id: 207, nombre: 'Maltín 500ml', precio: 'Bs. 6.00', description: 'Bebida de malta sin alcohol.', image: '/Imagines/maltin.png' },
      { id: 208, nombre: 'Vino Kohlberg Tinto', precio: 'Bs. 35.00', description: 'Vino de mesa tarijeño.', image: '/Imagines/vino.png' },
      { id: 209, nombre: 'Sprite 2L', precio: 'Bs. 10.00', description: 'Lima limón.', image: '/Imagines/sprite.png' },
      { id: 210, nombre: 'Fanta Naranja 2L', precio: 'Bs. 10.00', description: 'Naranja.', image: '/Imagines/fanta.png' }
    ],
    carnes: [
      { id: 301, nombre: 'Pollo Sofía (Kg)', precio: 'Bs. 15.50', description: 'Pollo fresco grado A.', image: '/Imagines/pollosofia.png' },
      { id: 302, nombre: 'Carne Molida Especial', precio: 'Bs. 32.00', description: 'Carne de res magra.', image: '/Imagines/carnemolida.png' },
      { id: 303, nombre: 'Chuleta de Cerdo (Kg)', precio: 'Bs. 28.00', description: 'Chuleta tierna de cerdo.', image: '/Imagines/chuletacerdo.png' },
      { id: 304, nombre: 'Costilla de Res (Kg)', precio: 'Bs. 25.00', description: 'Ideal para churrasco.', image: '/Imagines/chuletares.png' },
      { id: 305, nombre: 'Chorizo Parrillero', precio: 'Bs. 38.00', description: 'Chorizo ahumado.', image: '/Imagines/chorizo.png' },
      { id: 306, nombre: 'Mortadela San Juan', precio: 'Bs. 12.00', description: 'Fiambre de primera calidad.', image: '/Imagines/mortadela.png' },
      { id: 307, nombre: 'Milanesa de Pollo (Kg)', precio: 'Bs. 35.00', description: 'Pechuga fileteada.', image: '/Imagines/milanesa.png' },
      { id: 308, nombre: 'Nuggets de Pollo (Kg)', precio: 'Bs. 18.00', description: 'Hígado fresco.', image: '/Imagines/nuggets.png' },
      { id: 309, nombre: 'Salchicha Viena', precio: 'Bs. 20.00', description: 'Paquete 500g.', image: '/Imagines/salchicha.png' },
      { id: 310, nombre: 'Alitas de Pollo (Kg)', precio: 'Bs. 18.00', description: 'Alitas frescas.', image: '/Imagines/alitas.jpg' }
    ],
    frutas: [
      { id: 401, nombre: 'Manzana Royal (Kg)', precio: 'Bs. 12.00', description: 'Manzanas rojas dulces.', image: '/Imagines/manzana.png' },
      { id: 402, nombre: 'Banana Chapare (Docena)', precio: 'Bs. 5.00', description: 'Banana dulce nacional.', image: '/Imagines/banana.png' },
      { id: 403, nombre: 'Naranja Valencia (25u)', precio: 'Bs. 15.00', description: 'Naranja para jugo.', image: '/Imagines/naranja.png' },
      { id: 404, nombre: 'Uva Tarijeña (Kg)', precio: 'Bs. 14.00', description: 'Uva dulce de temporada.', image: '/Imagines/uva.png' },
      { id: 405, nombre: 'Piña Chapare (Und)', precio: 'Bs. 10.00', description: 'Piña miel dulce.', image: '/Imagines/piña.png' },
      { id: 406, nombre: 'Papaya (Und)', precio: 'Bs. 8.00', description: 'Papaya madura.', image: '/Imagines/papaya.png' },
      { id: 407, nombre: 'Sandía (Und)', precio: 'Bs. 20.00', description: 'Sandía roja y dulce.', image: '/Imagines/sandia.png' },
      { id: 408, nombre: 'Mandarina (25u)', precio: 'Bs. 12.00', description: 'Mandarina criolla.', image: '/Imagines/mandarina.png' },
      { id: 409, nombre: 'Frutilla (Kg)', precio: 'Bs. 15.00', description: 'Frutilla fresca.', image: '/Imagines/frutilla.png' },
      { id: 410, nombre: 'Durazno (Kg)', precio: 'Bs. 18.00', description: 'Durazno de temporada.', image: '/Imagines/durazno.png' }
    ],
    verduras: [
      { id: 501, nombre: 'Tomate Perita (Kg)', precio: 'Bs. 6.00', description: 'Tomate para ensalada.', image: '/Imagines/tomate.avif' },
      { id: 502, nombre: 'Lechuga Crespa (Und)', precio: 'Bs. 3.00', description: 'Lechuga hidropónica.', image: '/Imagines/lechuga.avif' },
      { id: 503, nombre: 'Zanahoria (Kg)', precio: 'Bs. 4.00', description: 'Zanahoria lavada.', image: '/Imagines/zanahoria.avif' },
      { id: 504, nombre: 'Cebolla Roja (Kg)', precio: 'Bs. 5.00', description: 'Cebolla cabeza grande.', image: '/Imagines/cebolla.avif' },
      { id: 505, nombre: 'Papa Imilla (Arroba)', precio: 'Bs. 45.00', description: 'Papa harinosa.', image: '/Imagines/papa.avif' },
      { id: 506, nombre: 'Pimenton Verde (Kg)', precio: 'Bs. 10.00', description: 'Pimenton verde.', image: '/Imagines/pimenton.avif' },
      { id: 507, nombre: 'Zapallo (Trozo)', precio: 'Bs. 5.00', description: 'Zapallo dulce.', image: '/Imagines/zapallo.avif' },
      { id: 508, nombre: 'Brócoli (Und)', precio: 'Bs. 6.00', description: 'Brócoli fresco.', image: '/Imagines/brocoli.avif' },
      { id: 509, nombre: 'Vainita (Kg)', precio: 'Bs. 8.00', description: 'Vainita verde.', image: '/Imagines/vaina.avif' },
      { id: 510, nombre: 'Espinaca (Amarro)', precio: 'Bs. 4.00', description: 'Espinaca fresca.', image: '/Imagines/espinaca.avif' }
    ],
    lacteos: [
      { id: 601, nombre: 'Leche PIL Entera 1L', precio: 'Bs. 6.00', description: 'Leche fluida pasteurizada.', image: '/Imagines/leche.avif' },
      { id: 602, nombre: 'Yogurt PIL Frutilla 1L', precio: 'Bs. 12.00', description: 'Yogurt bebible.', image: '/Imagines/yogurt.png' },
      { id: 603, nombre: 'Mantequilla Regia 200g', precio: 'Bs. 10.00', description: 'Mantequilla con sal.', image: '/Imagines/mantequilla.png' },
      { id: 604, nombre: 'Queso San Javier (Kg)', precio: 'Bs. 38.00', description: 'Queso fresco.', image: '/Imagines/queso.avif' },
      { id: 605, nombre: 'Leche Chocolatada PIL', precio: 'Bs. 6.50', description: 'Sabor chocolate.', image: '/Imagines/lechechocolatada.avif' },
      { id: 606, nombre: 'Crema de Leche PIL', precio: 'Bs. 15.00', description: 'Ideal para postres.', image: '/Imagines/cremadeleche.avif' },
      { id: 607, nombre: 'Dulce de Leche PIL', precio: 'Bs. 12.00', description: 'Manjar tradicional.', image: '/Imagines/dulcedeleche.avif' },
      { id: 608, nombre: 'Helado Delizia 1L', precio: 'Bs. 25.00', description: 'Sabor Vainilla.', image: '/Imagines/helado.avif' },
      { id: 609, nombre: 'Leche Deslactosada PIL', precio: 'Bs. 7.00', description: 'Leche Light.', image: '/Imagines/lechedeslactosada.png' },
      { id: 610, nombre: 'Kefir Natural', precio: 'Bs. 18.00', description: 'Probiótico natural.', image: '/Imagines/kefir.avif' }
    ],
    panaderia: [
      { id: 701, nombre: 'Pan Molde Blanco', precio: 'Bs. 10.00', description: 'Pan suave para sandwich.', image: '/Imagines/panmolde.png' },
      { id: 702, nombre: 'Pan Integral', precio: 'Bs. 12.00', description: 'Alto en fibra.', image: '/Imagines/panintegral.png' },
      { id: 703, nombre: 'Marraqueta (10u)', precio: 'Bs. 5.00', description: 'Pan de batalla crocante.', image: '/Imagines/marraqueta.png' },
      { id: 704, nombre: 'Cuñapé (Bolsa)', precio: 'Bs. 15.00', description: 'Horneado de queso.', image: '/Imagines/cuñape.avif' },
      { id: 705, nombre: 'Panetón San Antonio', precio: 'Bs. 25.00', description: 'Con chispas de chocolate.', image: '/Imagines/paneton.avif' },
      { id: 706, nombre: 'Galletas Surtidas', precio: 'Bs. 18.00', description: 'Variedad de galletas.', image: '/Imagines/galletassurtidas.avif' },
      { id: 707, nombre: 'Queque de Naranja', precio: 'Bs. 10.00', description: 'Queque casero.', image: '/Imagines/queque.avif' },
      { id: 708, nombre: 'Empanadas de Queso', precio: 'Bs. 4.00', description: 'Empanada para freir.', image: '/Imagines/empanadas.avif' },
      { id: 709, nombre: 'Alfajor de Chocolate', precio: 'Bs. 5.00', description: 'Relleno de dulce de leche.', image: '/Imagines/alfajor.avif' },
      { id: 710, nombre: 'Torta Selva Negra', precio: 'Bs. 80.00', description: 'Torta entera.', image: '/Imagines/torta.avif' }
    ],
    limpieza: [
      { id: 801, nombre: 'Lavandina Sapolio 1L', precio: 'Bs. 5.00', description: 'Desinfectante potente.', image: '/Imagines/lavandina.avif' },
      { id: 802, nombre: 'Detergente OMO 1Kg', precio: 'Bs. 16.00', description: 'Detergente en polvo.', image: '/Imagines/detergente.avif' },
      { id: 803, nombre: 'Jabón Bolívar Barra', precio: 'Bs. 4.00', description: 'Jabón para ropa.', image: '/Imagines/jabon.png' },
      { id: 804, nombre: 'Limpiapisos TodoBrillo', precio: 'Bs. 8.00', description: 'Aroma Lavanda.', image: '/Imagines/limpiapisos.avif' },
      { id: 805, nombre: 'Esponja Scotch Brite', precio: 'Bs. 3.00', description: 'Fibra verde.', image: '/Imagines/esponja.png' },
      { id: 806, nombre: 'Suavizante Ola', precio: 'Bs. 10.00', description: 'Para ropa suave.', image: '/Imagines/suavizante.png' },
      { id: 807, nombre: 'Insecticida Rid', precio: 'Bs. 22.00', description: 'Mata moscas y mosquitos.', image: '/Imagines/insecticida.avif' },
      { id: 808, nombre: 'Papel Higiénico Scott', precio: 'Bs. 15.00', description: 'Paquete de 12 rollos.', image: '/Imagines/papel.avif' },
      { id: 809, nombre: 'Lavavajilla Ola', precio: 'Bs. 12.00', description: 'Arranca grasa.', image: '/Imagines/lavavajilla.avif' },
      { id: 810, nombre: 'Escoba Plástica', precio: 'Bs. 20.00', description: 'Escoba resistente.', image: '/Imagines/escoba.png' }
    ],
    personal: [
      { id: 901, nombre: 'Shampoo Dove 200Ml', precio: 'Bs. 22.00', description: 'Shampoo Dove Reconstrucción.', image: '/Imagines/shampoo.avif' },
      { id: 902, nombre: 'Jabón Lux (Pack 3)', precio: 'Bs. 12.00', description: 'Toque de vainilla.', image: '/Imagines/jabonlux.avif' },
      { id: 903, nombre: 'Pasta Dental Oral B', precio: 'Bs. 10.00', description: 'Protección anticaries.', image: '/Imagines/pastadental.avif' },
      { id: 904, nombre: 'Desodorante Axe Black', precio: 'Bs. 18.00', description: 'Aerosol hombre.', image: '/Imagines/desodorante.avif' },
      { id: 905, nombre: 'Crema Nivea Lata', precio: 'Bs. 15.00', description: 'Hidratante clásico.', image: '/Imagines/crema.avif' },
      { id: 906, nombre: 'Pañales Pampers', precio: 'Bs. 60.00', description: 'Paquete 30 unidades.', image: '/Imagines/pañales.avif' },
      { id: 907, nombre: 'Toallas Húmedas', precio: 'Bs. 15.00', description: 'Para adulto.', image: '/Imagines/toallashumedas.avif' },
      { id: 908, nombre: 'Cepillo Dental Bamboo', precio: 'Bs. 8.00', description: 'Cerdas medias.', image: '/Imagines/cepillo.avif' },
      { id: 909, nombre: 'Afeitadora Gillette', precio: 'Bs. 5.00', description: 'Desechable.', image: '/Imagines/afeitadora.avif' },
      { id: 910, nombre: 'Talco para Pies', precio: 'Bs. 12.00', description: 'Mexsana.', image: '/Imagines/talco.png' }
    ],
    cereales: [
      { id: 1001, nombre: 'Galletas Mabel Wafer', precio: 'Bs. 4.50', description: 'Oblea sabor vainilla.', image: '/Imagines/mabel.avif' },
      { id: 1002, nombre: 'Cereal Chocapic 200g', precio: 'Bs. 25.00', description: 'Cereal de chocolate.', image: '/Imagines/chocapic.avif' },
      { id: 1003, nombre: 'Avena Instantánea', precio: 'Bs. 10.00', description: 'Bolsa 400g.', image: '/Imagines/avenaa.avif' },
      { id: 1004, nombre: 'Granola con Miel El Maná', precio: 'Bs. 20.00', description: 'Bolsa 500g.', image: '/Imagines/granola.avif' },
      { id: 1005, nombre: 'Barra de Cereal Cereal Mix', precio: 'Bs. 3.00', description: 'Sabor frutilla.', image: '/Imagines/barradecereal.avif' },
      { id: 1006, nombre: 'Maíz para Pipoca', precio: 'Bs. 6.00', description: 'Grano seleccionado.', image: '/Imagines/maizpipoca.avif' },
      { id: 1007, nombre: 'Zucaritas Kellogg\'s', precio: 'Bs. 28.00', description: 'Hojuelas azucaradas.', image: '/Imagines/zucaritas.avif' },
      { id: 1008, nombre: 'Corn Flakes', precio: 'Bs. 22.00', description: 'Hojuelas de maíz.', image: '/Imagines/corn.avif' },
      { id: 1009, nombre: 'Quinua Real', precio: 'Bs. 15.00', description: 'Grano de oro.', image: '/Imagines/quinua.avif' },
      { id: 1010, nombre: 'Trigo Pelado', precio: 'Bs. 8.00', description: 'Para sopa.', image: '/Imagines/trigo.png' }
    ],
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
          <div className={styles.logo}>MERKADO LITE</div>
          
          <input type="text" placeholder="¿Qué estás buscando?" className={styles.searchBar} />
          
          <div className={styles.userNav}>
            <span>Cuenta</span>
            <div className={styles.cartContainer} onClick={handleGoToCart}>
              <svg className={styles.headerCartIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
              <span style={{ marginLeft: '8px' }}>Carrito</span>
            </div>
          </div>
        </div>
      </header>

      <section style={{ padding: '0' }}>
        {/* Wrapper para centrar y aplicar margen */}
        <div className={styles.banner}>
          <div className={styles.bannerText}>
            <span 
              className={styles.bannerFlash} 
              style={{color: BANNERS[currentBanner].accentColor}}
            >
              OFERTA FLASH
            </span>
            <h1 className={styles.bannerTitle}>{BANNERS[currentBanner].title}</h1>
            <p className={styles.bannerDescription}>{BANNERS[currentBanner].description}</p>
            
            {/* El botón hace scroll a la categoría específica */}
            <button 
              className={styles.bannerButton}
              style={{backgroundColor: BANNERS[currentBanner].accentColor}}
              onClick={() => handleScrollTo(BANNERS[currentBanner].targetCategory)}
            >
              {BANNERS[currentBanner].buttonText}
            </button>

            {/* Indicadores visuales (puntitos) */}
            <div className={styles.bannerIndicators}>
              {BANNERS.map((_, idx) => (
                <span 
                  key={idx}
                  className={`${styles.indicator} ${idx === currentBanner ? styles.indicatorActive : ''}`}
                  onClick={() => setCurrentBanner(idx)}
                />
              ))}
            </div>
          </div>
          
          {/* Imagen Placeholder Dinámica */}
          <div className={styles.bannerImageContainer}>
             <div 
               className={styles.bannerImagePlaceholder}
               style={{backgroundColor: "#e0e0e0"}} 
             >
                {/* Aquí iría la imagen real <Image ... /> */}
             </div>
          </div>
        </div>

        <div className={styles.categoryBar}>
          {categoriesList.map((cat) => (
            <span 
              key={cat.key}
              onClick={() => handleScrollTo(cat.key)} 
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