'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './Comprapage.module.css';

interface CartItem {
    id: number;
    nombre: string;
    precio: string;
    image: string;
    quantity: number;
    priceNumeric: number;
}

export default function CompraPage() { 
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState({ street: 'Calle Falsa', number: '123', apartment: '', recipient: 'Fabio Arze' });
  const [deliveryDetails, setDeliveryDetails] = useState({ date: '19/11/2025', time: '13:00-15:00' }); 
  
  // ESTADO PARA EL DESCUENTO
  const [discountAmount, setDiscountAmount] = useState(0);
  
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

  useEffect(() => {
    const storedCart = localStorage.getItem('mklite_cart');
    if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        setCartItems(parsedCart);

        // 1. Calculamos el subtotal temporalmente
        const tempSubtotal = parsedCart.reduce((acc: number, item: CartItem) => acc + item.priceNumeric * item.quantity, 0);
        
        // 2. VERIFICAMOS SI VIENE CON DESCUENTO DESDE EL CARRITO
        const discountApplied = localStorage.getItem('mklite_discount_applied'); 
        
        if (discountApplied === 'true') {
            setDiscountAmount(tempSubtotal * 0.10); // Aplicamos el 10%
        }
    } else {
        router.push('/carrito');
    }
  }, [router]);

  // Cálculos finales
  const subtotal = cartItems.reduce((acc, item) => acc + item.priceNumeric * item.quantity, 0);
  const deliveryCost = deliveryMethod === 'delivery' ? 10.00 : 0; 
  const total = subtotal - discountAmount + deliveryCost;

  const handleNextStep = () => {
    if (activeTab < 1) setActiveTab(prev => prev + 1);
    else {
      alert('Simulando pago y completando compra...');
      // Limpiamos todo al terminar
      localStorage.removeItem('mklite_cart');
      localStorage.removeItem('mklite_discount_applied');
      router.push('/Home'); // Redirige al Home o a una pagina de confirmación
    }
  };

  const handlePrevStep = () => {
    if (activeTab > 0) setActiveTab(prev => prev - 1);
    else router.push('/carrito');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent} onClick={() => router.push('/Home')}>
          MERCADO LITE
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.checkoutForms}>
          {/* TABS */}
          <nav className={styles.tabsNav}>
            <span className={`${styles.tabItem} ${activeTab === 0 ? styles.tabItemActive : ''}`} onClick={() => setActiveTab(0)}>MÉTODO DE ENTREGA</span>
            <span className={`${styles.tabItem} ${activeTab === 1 ? styles.tabItemActive : ''}`} onClick={() => setActiveTab(1)}>MÉTODO DE PAGO</span>
          </nav>

          {/* TAB 1: ENTREGA */}
          {activeTab === 0 && (
            <div className={styles.formSection}>
              {/* Título sin emoji */}
              <h2 className={styles.sectionTitle}>Método de entrega</h2>
              
              <div className={styles.radioOptionContainer}>
                <div className={styles.radioOption} onClick={() => setDeliveryMethod('delivery')}>
                  <input type="radio" checked={deliveryMethod === 'delivery'} onChange={() => setDeliveryMethod('delivery')} />
                  <label>Envío a Domicilio</label>
                  <span className={styles.priceInfo}>Tarifa sujeta a distancia</span>
                </div>
              </div>
              <div className={styles.radioOptionContainer}>
                <div className={styles.radioOption} onClick={() => setDeliveryMethod('pickup')}>
                  <input type="radio" checked={deliveryMethod === 'pickup'} onChange={() => setDeliveryMethod('pickup')} />
                  <label>Retiro en Tienda</label>
                  <span className={`${styles.priceInfo} ${styles.gratis}`}>Gratis</span>
                </div>
              </div>

              {deliveryMethod === 'delivery' && (
                <>
                  <h3 className={styles.sectionTitle} style={{fontSize: '20px', marginTop: '30px'}}>Día y Hora</h3>
                  <div className={styles.formGroup}>
                      <label>Día</label>
                      <input type="text" value={deliveryDetails.date} className={styles.datePickerInput} onChange={(e) => setDeliveryDetails({...deliveryDetails, date: e.target.value})} />
                  </div>
                   <div className={styles.formGroup}>
                        <label>Hora</label>
                        <select value={deliveryDetails.time} onChange={(e) => setDeliveryDetails({...deliveryDetails, time: e.target.value})} className={styles.datePickerInput}>
                            <option value="09:00-11:00">09:00 - 11:00</option>
                            <option value="11:00-13:00">11:00 - 13:00</option>
                        </select>
                   </div>
                 
                  <h3 className={styles.sectionTitle} style={{fontSize: '20px', marginTop: '30px'}}>Ubicación</h3>
                  <div className={styles.mapThumbnailContainer} onClick={() => setIsMapModalOpen(true)}>
                    <div className={styles.mapThumbnail}>
                        <div className={styles.mapOverlay}><span>Seleccionar Ubicación</span></div>
                    </div>
                  </div>
                  
                  <div className={styles.inputGrid} style={{marginTop: '20px'}}>
                    <div className={styles.formGroup}>
                      <label>Calle</label>
                      <input type="text" value={address.street} onChange={(e) => setAddress({...address, street: e.target.value})} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Número</label>
                      <input type="text" value={address.number} onChange={(e) => setAddress({...address, number: e.target.value})} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Dpto/Piso</label>
                      <input type="text" value={address.apartment} onChange={(e) => setAddress({...address, apartment: e.target.value})} placeholder="Opcional" />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Destinatario</label>
                    <input type="text" value={address.recipient} onChange={(e) => setAddress({...address, recipient: e.target.value})} />
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 2: PAGO */}
          {activeTab === 1 && (
            <div className={styles.formSection}>
              {/* Título sin emoji */}
              <h2 className={styles.sectionTitle}>Método de pago</h2>
              <div className={styles.radioOptionContainer}>
                <div className={styles.radioOption}>
                  <input type="radio" checked={true} readOnly />
                  <label>Pagar en Efectivo</label>
                </div>
              </div>
              <p style={{marginTop: '20px', color: '#666'}}>* Pago contra entrega.</p>
            </div>
          )}

          <div className={styles.navigationButtons}>
            <button className={`${styles.navigationButton} ${styles.backButton}`} onClick={handlePrevStep}>
              {activeTab === 0 ? 'VOLVER AL CARRITO' : 'ANTERIOR'}
            </button>
            <button className={`${styles.navigationButton} ${styles.nextButton}`} onClick={handleNextStep}>
              {activeTab === 1 ? 'FINALIZAR COMPRA' : 'SIGUIENTE'}
            </button>
          </div>
        </div>

        {/* SIDEBAR RESUMEN */}
        <div className={styles.summarySidebar}>
          <h3 className={styles.summaryTitle}>Resumen de la compra</h3>
          <div className={styles.summaryProducts}>
            {cartItems.map(item => (
                <div key={item.id} className={styles.summaryItem}>
                  <div className={styles.summaryItemImage}>
                    <Image src={item.image} alt={item.nombre} width={40} height={40} style={{objectFit: 'contain'}} />
                  </div>
                  <div className={styles.summaryItemDetails}>
                    <h4>{item.nombre}</h4>
                    <p>Cantidad: {item.quantity}</p>
                  </div>
                  <span className={styles.summaryItemPrice}>Bs. {item.priceNumeric.toFixed(2)}</span>
                </div>
            ))}
          </div>

          <div className={styles.summaryTotals}>
            <div className={styles.summaryTotalRow}>
              <span>Subtotal:</span>
              <strong>Bs. {subtotal.toFixed(2)}</strong>
            </div>
            <div className={styles.summaryTotalRow}>
              <span>Costo de envío:</span>
              <span className={deliveryMethod === 'delivery' ? styles.priceInfo : styles.priceInfo + ' ' + styles.gratis}>
                {deliveryMethod === 'delivery' ? 'Tarifa sujeta a distancia' : 'Gratis'}
              </span>
            </div>
            {deliveryMethod === 'delivery' && (
                <div className={styles.summaryTotalRow}>
                    <span>Costo estimado:</span>
                    <strong>Bs. {deliveryCost.toFixed(2)}</strong>
                </div>
            )}

            {/* AQUÍ SE MUESTRA EL DESCUENTO SI EXISTE */}
            {discountAmount > 0 && (
                <div className={styles.summaryTotalRow}>
                    <span style={{color: '#E60012', fontWeight: 'bold'}}>Descuento (LITE10):</span>
                    <strong style={{color: '#E60012', fontWeight: 'bold'}}>- Bs. {discountAmount.toFixed(2)}</strong>
                </div>
            )}
            
            <div className={styles.summaryTotalFinal}>
              <span>TOTAL</span>
              <span>Bs. {total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL DE MAPA */}
      {isMapModalOpen && (
        <div className={styles.mapModalBackdrop} onClick={() => setIsMapModalOpen(false)}>
          <div className={styles.mapModalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.mapModalCloseButton} onClick={() => setIsMapModalOpen(false)}>X</button>
            <h3>Selecciona tu Ubicación</h3>
            <div className={styles.interactiveMapPlaceholder}>Mapa Interactivo (Placeholder)</div>
            <button className={styles.mapModalConfirmButton} onClick={() => setIsMapModalOpen(false)}>Confirmar</button>
          </div>
        </div>
      )}
    </div>
  );
}