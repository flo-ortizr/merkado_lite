'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './CartPage.module.css';

type CartItem = {
  id_product: number;
  name: string;
  price: string;
  image_url: string;
  quantity: number;
  priceNumeric: number;
};

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState<{ text: string; type: 'success' | 'error' | '' }>({
    text: '',
    type: '',
  });

  useEffect(() => {
    setIsClient(true);
    const storedCart = localStorage.getItem('mklite_cart');
    localStorage.removeItem('mklite_discount_applied');

    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.priceNumeric * item.quantity,
    0
  );

  const total = subtotal - discount;

  const handleApplyCoupon = () => {
    if (!couponCode) return;

    if (couponCode.toUpperCase() === 'LITE10') {
      const calcDiscount = subtotal * 0.1;
      setDiscount(calcDiscount);
      setCouponMsg({ text: '¡Cupón del 10% aplicado!', type: 'success' });
      localStorage.setItem('mklite_discount_applied', 'true');
    } else {
      setDiscount(0);
      setCouponMsg({ text: 'Cupón no válido', type: 'error' });
      localStorage.removeItem('mklite_discount_applied');
    }
  };

  const updateQuantity = (id: number, delta: number) => {
    const newCart = cartItems.map(item => {
      if (item.id_product === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    });

    setCartItems(newCart);
    localStorage.setItem('mklite_cart', JSON.stringify(newCart));

    if (discount > 0) {
      setDiscount(0);
      setCouponMsg({
        text: 'El carrito cambió, vuelve a aplicar tu cupón',
        type: 'error',
      });
      setCouponCode('');
      localStorage.removeItem('mklite_discount_applied');
    }
  };

  const removeItem = (id: number) => {
    const newCart = cartItems.filter(item => item.id_product !== id);
    setCartItems(newCart);
    localStorage.setItem('mklite_cart', JSON.stringify(newCart));
    setDiscount(0);
    setCouponMsg({ text: '', type: '' });
    localStorage.removeItem('mklite_discount_applied');
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('mklite_cart');
    setDiscount(0);
    localStorage.removeItem('mklite_discount_applied');
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
        <div className={styles.cartSection}>
          <div className={styles.headerRow}>
            <h1 className={styles.sectionTitle}>Tu Carrito ({cartItems.length})</h1>
            {cartItems.length > 0 && (
              <button onClick={clearCart} className={styles.clearBtn}>
                Vaciar Carrito
              </button>
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
              {cartItems.map(item => (
                <div key={item.id_product} className={styles.cartItem}>
                  <div className={styles.itemInfo}>
                    <div className={styles.imageContainer}>
                      <Image
                        src={item.image_url}
                        alt={item.name}
                        fill
                        style={{ objectFit: 'contain', padding: '5px' }}
                      />
                    </div>
                    <div className={styles.itemDetails}>
                      <h3>{item.name}</h3>
                      <div className={styles.qtySelector}>
                        <button onClick={() => updateQuantity(item.id_product, -1)} className={styles.qtyBtn}>-</button>
                        <span className={styles.qtyValue}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id_product, 1)} className={styles.qtyBtn}>+</button>
                      </div>
                    </div>
                  </div>

                  <div className={styles.itemActions}>
                    <div className={styles.itemPrice}>
                      Bs. {(item.priceNumeric * item.quantity).toFixed(2)}
                    </div>
                    <button onClick={() => removeItem(item.id_product)} className={styles.deleteBtn}>
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

            <div className={styles.couponContainer}>
              <span className={styles.couponLabel}>¿Tienes un cupón de descuento?</span>
              <div className={styles.couponInputGroup}>
                <input
                  type="text"
                  placeholder="Código (Ej: LITE10)"
                  className={styles.couponInput}
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                />
                <button onClick={handleApplyCoupon} className={styles.applyBtn}>
                  Aplicar
                </button>
              </div>

              {couponMsg.text && (
                <div
                  className={`${styles.couponMessage} ${
                    couponMsg.type === 'success' ? styles.msgSuccess : styles.msgError
                  }`}
                >
                  {couponMsg.text}
                </div>
              )}
            </div>

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

            <button className={styles.checkoutButton} onClick={() => router.push('/compra')}>
              Continuar
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
