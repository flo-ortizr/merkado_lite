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

  // Cargar carrito al inicio
  useEffect(() => {
    setIsClient(true);
    const storedCart = localStorage.getItem('mklite_cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  // Calcular total dinámicamente
  const total = cartItems.reduce((sum, item) => sum + (item.priceNumeric * item.quantity), 0);

  // Función para actualizar cantidad (+ o -)
  const updateQuantity = (id: number, delta: number) => {
    const newCart = cartItems.map(item => {
      if (item.id === id) {
        // Calculamos nueva cantidad (mínimo 1)
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });

    setCartItems(newCart);
    localStorage.setItem('mklite_cart', JSON.stringify(newCart));
  };

  // Eliminar un producto completo
  const removeItem = (id: number) => {
    const newCart = cartItems.filter(item => item.id !== id);
    setCartItems(newCart);
    localStorage.setItem('mklite_cart', JSON.stringify(newCart));
  };

  // Vaciar todo
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('mklite_cart');
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
                      
                      {/* Selector de Cantidad - ¡AQUÍ ESTÁ LA LÓGICA! */}
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
              <span>Bs. {total.toFixed(2)}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Envío</span>
              <span>Gratis</span>
            </div>
            
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