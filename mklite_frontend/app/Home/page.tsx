'use client'; 

import React, { useState, useRef, useEffect } from 'react'; 
import Image from 'next/image'; 
import { useRouter } from 'next/navigation'; 
import styles from './HomePage.module.css'; 
import { Product } from '../models/Product';
import { fetchProducts } from '../../services/productService';
import { getAllCategories } from '@/services/categoryService';
import { Category } from '../models/Category';

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
const imageUrl = product.image_url ? product.image_url.replace(/^['"]|['"]$/g, '') : '/Imagines/arroz.jpeg';

  return (
    <div onClick={() => onCardClick(product)} className={styles.productCard}>
      <div className={styles.cardImage}>
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
         <Image
  src={imageUrl}
  alt={product.name}
  fill
  style={{ objectFit: 'contain', padding: '10px' }}
/>


        </div>
      </div>
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{product.name}</h3>
        <span className={styles.cardPrice}>{product.price}</span>
        
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
            <ProductCard key={producto.id_product} product={producto} onCardClick={onProductClick} onAddToCart={onAddToCart} />
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
const imageUrl = product.image_url ? product.image_url.replace(/^['"]|['"]$/g, '') : '/Imagines/arroz.jpeg';

  return (
    <div onClick={onClose} className={styles.modalBackdrop}>
      <div onClick={(e) => e.stopPropagation()} className={styles.modalWindow}>
        <button onClick={onClose} className={styles.modalCloseButton}>×</button>
        <div className={styles.modalContent}>
          <div className={styles.modalImage}>
             <div style={{ position: 'relative', width: '100%', height: '100%' }}>
             <Image
  src={imageUrl}
  alt={product.name}
  fill
  style={{ objectFit: 'contain', padding: '10px' }}
/>

             </div>
          </div>
          <div className={styles.modalInfo}>
            <h1 className={styles.modalTitle}>{product.name}</h1>
            <p className={styles.modalDescription}>{product.description}</p>
            <div className={styles.modalCategory}>Categoría: General</div>
            <h2 className={styles.modalPrice}>{product.price}</h2>
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
   const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const categoryRefs = useRef<{ [key: string]: React.RefObject<HTMLElement | null> }>({});
const [searchTerm, setSearchTerm] = useState('');


  const [activeCategory, setActiveCategory] = useState<string>('abarrotes');
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [currentBanner, setCurrentBanner] = useState(0);
 const [productsByCategory, setProductsByCategory] = useState<{ [key: string]: Product[] }>({});

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await getAllCategories();
        setCategoriesList(categories);

        // Crear refs dinámicamente según las categorías
        const refs: { [key: string]: React.RefObject<HTMLElement | null> } = {};
        categories.forEach(cat => {
          const key = cat.name.toLowerCase();
          refs[key] = React.createRef<HTMLElement>();
        });
        categoryRefs.current = refs;
      } catch (err) {
        console.error('Error cargando categorías:', err);
      }
    };

    loadCategories();
  }, []);
  
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await fetchProducts();
        const grouped: { [key: string]: Product[] } = {};
        products.forEach(prod => {
          const catKey = prod.category?.name.toLowerCase() || 'otros';
          if (!grouped[catKey]) grouped[catKey] = [];
          grouped[catKey].push(prod);
        });
        setProductsByCategory(grouped);
      } catch (err) {
        console.error('Error cargando productos:', err);
      }
    };
    loadProducts();
  }, []);
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

    Object.values(categoryRefs.current).forEach((ref) => {
  if (ref.current) observer.observe(ref.current);
});

    return () => observer.disconnect();
  }, []);

  const handleScrollTo = (key: string) => {
    const ref = categoryRefs.current[key];
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
    const priceNum = parseFloat(product.price.replace('Bs. ', ''));
    
    // @ts-ignore
   const existingItemIndex = cart.findIndex(
  (item: any) => item.id_product === product.id_product
);


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
const filteredProductsByCategory = Object.fromEntries(
  Object.entries(productsByCategory).map(([category, products]) => [
    category,
    products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  ])
);


  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>MERKADO LITE</div>
          
          <input
  type="text"
  placeholder="¿Qué estás buscando?"
  className={styles.searchBar}
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>

          
          <div className={styles.userNav}>
           
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
  {categoriesList.map((cat) => {
    const key = cat.name.toLowerCase();
    return (
      <span 
        key={cat.id_category}
        onClick={() => handleScrollTo(key)}
        className={`${styles.categoryLink} ${activeCategory === key ? styles.categoryLinkActive : ''}`}
      >
        {cat.name}
      </span>
    );
  })}
</div>



       <div className={styles.shelfContainer}>
  {categoriesList.map((cat) => {
    const key = cat.name.toLowerCase();
    return (
      <ProductShelf
  key={cat.id_category}
  id={key}
  title={cat.name}
  products={filteredProductsByCategory[key] || []}
  forwardRef={categoryRefs.current[key]}
  onProductClick={handleProductClick}
  onAddToCart={handleAddToCart}
/>

    );
  })}
</div>
      </section>

      {isDetailOpen && <ProductModal product={selectedProduct} onClose={() => setIsDetailOpen(false)} onAddToCart={handleAddToCart} />}
      <ConfirmationModal isOpen={isConfirmationOpen} onKeepShopping={handleKeepShopping} onGoToCart={handleGoToCart} />
    </div>
  );
}