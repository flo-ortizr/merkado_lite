'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './CartPage.module.css';

type CartItem = {
  id: number;
  nombre: string;
  precio: string;
  image: string;
  quantity: number;
  priceNumeric: number;
};

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  // --- ESTADOS PARA EL CUPÓN ---
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState<{ text: string, type: 'success' | 'error' | '' }>({ text: '', type: '' });

  useEffect(() => {
    setIsClient(true);
    const storedCart = localStorage.getItem('mklite_cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Calcular Subtotal
  const subtotal = cartItems.reduce((sum, item) => sum + (item.priceNumeric * item.quantity), 0);
  
  // Calcular Total Final (Subtotal - Descuento)
  const total = subtotal - discount;

  // Función para aplicar cupón
  const handleApplyCoupon = () => {
    if (!couponCode) return;

    // Lógica del cupón "LITE10"
    if (couponCode.toUpperCase() === 'LITE10') {
      const calcDiscount = subtotal * 0.10; // 10% de descuento
      setDiscount(calcDiscount);
      setCouponMsg({ text: '¡Cupón del 10% aplicado!', type: 'success' });
    } else {
      setDiscount(0);
      setCouponMsg({ text: 'Cupón no válido', type: 'error' });
    }
  };

  // Actualizar cantidad
  const updateQuantity = (id: number, delta: number) => {
    const newCart = cartItems.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCartItems(newCart);
    localStorage.setItem('mklite_cart', JSON.stringify(newCart));
    
    // Si cambian las cantidades, reiniciamos el cupón para evitar cálculos incorrectos
    if (discount > 0) {
       setDiscount(0);
       setCouponMsg({ text: 'El carrito cambió, vuelve a aplicar tu cupón', type: 'error' });
       setCouponCode('');
    }
  };

  // Eliminar item
  const removeItem = (id: number) => {
    const newCart = cartItems.filter(item => item.id !== id);
    setCartItems(newCart);
    localStorage.setItem('mklite_cart', JSON.stringify(newCart));
    setDiscount(0); // Reset descuento
    setCouponMsg({ text: '', type: '' });
  };

  // Vaciar carrito
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('mklite_cart');
    setDiscount(0);
  };

  if (!isClient) return null;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo} onClick={() => router.push('/Home')}>
            MERCADO LITE
          </div>
        </div>
      </header>

      <main className={styles.main}>
        
        {/* Sección Izquierda: Lista de Productos */}
        <div className={styles.cartSection}>
          <div className={styles.headerRow}>
             <h1 className={styles.sectionTitle}>Tu Carrito ({cartItems.length})</h1>
             {cartItems.length > 0 && (
                <button onClick={clearCart} className={styles.clearBtn}>Vaciar Carrito</button>
             )}
          </div>
          
          {cartItems.length === 0 ? (
            <div className={styles.emptyMessage}>
               <p className={styles.emptyText}>Tu carrito está vacío.</p>
               <button className={styles.backButton} onClick={() => router.push('/Home')}>
                  Ir a comprar
               </button>
            </div>
          ) : (
            <div>
              {cartItems.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.itemInfo}>
                    <div className={styles.imageContainer}>
                       <Image src={item.image} alt={item.nombre} fill style={{ objectFit: 'contain', padding: '5px' }} />
                    </div>
                    <div className={styles.itemDetails}>
                      <h3>{item.nombre}</h3>
                      <div className={styles.qtySelector}>
                        <button onClick={() => updateQuantity(item.id, -1)} className={styles.qtyBtn}>-</button>
                        <span className={styles.qtyValue}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className={styles.qtyBtn}>+</button>
                      </div>
                    </div>
                  </div>
                  
                  <div className={styles.itemActions}>
                    <div className={styles.itemPrice}>
                      Bs. {(item.priceNumeric * item.quantity).toFixed(2)}
                    </div>
                    <button onClick={() => removeItem(item.id)} className={styles.deleteBtn}>
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
              
              <button className={styles.backButton} onClick={() => router.push('/Home')}>
                ← Seguir Comprando
              </button>
            </div>
          )}
        </div>

        {/* Sección Derecha: Resumen */}
        {cartItems.length > 0 && (
          <div className={styles.summarySection}>
            <h2 className={styles.sectionTitle}>Resumen</h2>
            
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>Bs. {subtotal.toFixed(2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Envío</span>
              <span>Gratis</span>
            </div>

            {/* --- NUEVA SECCIÓN: CUPÓN DE DESCUENTO --- */}
            <div className={styles.couponContainer}>
              <span className={styles.couponLabel}>¿Tienes un cupón de descuento?</span>
              <div className={styles.couponInputGroup}>
                <input 
                  type="text" 
                  placeholder="Código (Ej: LITE10)" 
                  className={styles.couponInput}
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button onClick={handleApplyCoupon} className={styles.applyBtn}>Aplicar</button>
              </div>
              {/* Mensaje de feedback */}
              {couponMsg.text && (
                <div className={`${styles.couponMessage} ${couponMsg.type === 'success' ? styles.msgSuccess : styles.msgError}`}>
                  {couponMsg.text}
                </div>
              )}
            </div>

            {/* Fila de Descuento (Solo si hay descuento) */}
            {discount > 0 && (
              <div className={styles.discountRow}>
                <span>Descuento</span>
                <span>- Bs. {discount.toFixed(2)}</span>
              </div>
            )}
            
            <div className={styles.totalRow}>
              <span>Total</span>
              <span>Bs. {total.toFixed(2)}</span>
            </div>

            <button 
              className={styles.checkoutButton} 
              onClick={() => router.push('/compra')}
            >
              Continuar
            </button>
          </div>
        )}

      </main>
    </div>
  );
}