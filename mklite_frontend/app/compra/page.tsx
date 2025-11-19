'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './Comprapage.module.css';

// Nota: Hemos eliminado los imports de react-icons para evitar errores de dependencia.

// Definimos los tipos para los productos del carrito
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
  const [activeTab, setActiveTab] = useState(0); // 0: Entrega, 1: Pago
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState({ street: 'Calle Falsa', number: '123', apartment: '', recipient: 'Fabio Arze' });
  const [deliveryDetails, setDeliveryDetails] = useState({ date: '19/11/2025', time: '13:00-15:00' }); 
  
  const [isMapModalOpen, setIsMapModalOpen] = useState(false); // Nuevo estado para el modal del mapa

  // Datos simulados del usuario (si fueran necesarios)
  const userData = {
    email: 'fabioarceiranola@gmail.com',
    name: 'fabio arze',
    phone: '799 62735'
  };

  // Cargar productos del carrito al iniciar
  useEffect(() => {
    const storedCart = localStorage.getItem('mklite_cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    } else {
        router.push('/carrito');
    }
  }, [router]);

  // Cálculo de totales
  const subtotal = cartItems.reduce((acc, item) => acc + item.priceNumeric * item.quantity, 0);
  const deliveryCost = deliveryMethod === 'delivery' ? 10.00 : 0; 
  const total = subtotal + deliveryCost;

  // Manejadores de navegación 
  const handleNextStep = () => {
    if (activeTab < 1) setActiveTab(prev => prev + 1);
    else {
      alert('Simulando pago y completando compra...');
      router.push('/compra/confirmacion');
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
          {/* --- Tabs de Navegación --- */}
          <nav className={styles.tabsNav}>
            <span 
                className={`${styles.tabItem} ${activeTab === 0 ? styles.tabItemActive : ''}`}
                onClick={() => setActiveTab(0)}
            >
                MÉTODO DE ENTREGA
            </span>
            <span 
                className={`${styles.tabItem} ${activeTab === 1 ? styles.tabItemActive : ''}`}
                onClick={() => setActiveTab(1)}
            >
                MÉTODO DE PAGO
            </span>
          </nav>

          {/* 1. MÉTODO DE ENTREGA */}
          {activeTab === 0 && (
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>🚚 Método de entrega</h2>
              
              {/* Opciones de Delivery/Recojo */}
              <div className={styles.radioOptionContainer}> {/* Contenedor para que se parezca al de pago */}
                <div className={styles.radioOption} onClick={() => setDeliveryMethod('delivery')}>
                  <input 
                    type="radio" 
                    name="deliveryMethod" 
                    value="delivery" 
                    checked={deliveryMethod === 'delivery'} 
                    onChange={() => setDeliveryMethod('delivery')} 
                  />
                  <label>Envío a Domicilio</label>
                  <span className={styles.priceInfo}>Tarifa sujeta a distancia</span>
                </div>
              </div>

              <div className={styles.radioOptionContainer}> {/* Contenedor para que se parezca al de pago */}
                <div className={styles.radioOption} onClick={() => setDeliveryMethod('pickup')}>
                  <input 
                    type="radio" 
                    name="deliveryMethod" 
                    value="pickup" 
                    checked={deliveryMethod === 'pickup'} 
                    onChange={() => setDeliveryMethod('pickup')} 
                  />
                  <label>Retiro en Tienda</label>
                  <span className={`${styles.priceInfo} ${styles.gratis}`}>Gratis</span>
                </div>
              </div>

              {/* Contenido adicional para Delivery */}
              {deliveryMethod === 'delivery' && (
                <>
                  <h3 className={styles.sectionTitle} style={{fontSize: '20px', marginTop: '30px'}}>
                    Día y Hora de entrega
                  </h3>
                  
                  {/* Selector de Fecha y Hora (Simulados) */}
                  <div className={styles.sectionCard}>
                      <div className={styles.formGroup}>
                          <label>Día de Entrega</label>
                          <input type="text" value={deliveryDetails.date} className={styles.datePickerInput} onChange={(e) => setDeliveryDetails({...deliveryDetails, date: e.target.value})} />
                          <p style={{marginTop: '5px', fontSize: '12px', color: '#888'}}>* En una versión final, aquí se usaría un calendario interactivo.</p>
                      </div>
                       <div className={styles.formGroup}>
                            <label>Rango Horario</label>
                            <select 
                                value={deliveryDetails.time} 
                                onChange={(e) => setDeliveryDetails({...deliveryDetails, time: e.target.value})}
                                className={styles.datePickerInput}
                            >
                                <option value="09:00-11:00">09:00 - 11:00</option>
                                <option value="11:00-13:00">11:00 - 13:00</option>
                            </select>
                       </div>
                  </div>
                 
                  <h3 className={styles.sectionTitle} style={{fontSize: '20px', marginTop: '30px'}}>
                    Ubicación de entrega
                  </h3>
                  <div className={styles.sectionCard}>
                      <div className={styles.formGroup}>
                          <label>Ciudad</label>
                          <input type="text" value="Cochabamba" readOnly disabled className={styles.datePickerInput} />
                      </div>
                      
                      {/* MINIATURA DEL MAPA */}
                      <div className={styles.mapThumbnailContainer} onClick={() => setIsMapModalOpen(true)}>
                        <div className={styles.mapThumbnail}>
                            <Image src="/images/mapa_placeholder.png" alt="Mapa de Ubicación" fill style={{ objectFit: 'cover', borderRadius: '8px' }} />
                            <div className={styles.mapOverlay}>
                                <span>Ver y Seleccionar Ubicación</span>
                            </div>
                        </div>
                      </div>
                      <p className={styles.mapClickInfo}>Haz clic en el mapa para seleccionar tu dirección exacta.</p>

                      {/* Inputs de Dirección */}
                      <div className={styles.inputGrid}>
                        <div className={styles.formGroup}>
                          <label htmlFor="street">Calle *</label>
                          <input type="text" id="street" value={address.street} onChange={(e) => setAddress({...address, street: e.target.value})} placeholder="Av. América" required />
                        </div>
                        <div className={styles.formGroup}>
                          <label htmlFor="number">Número *</label>
                          <input type="text" id="number" value={address.number} onChange={(e) => setAddress({...address, number: e.target.value})} placeholder="123" required />
                        </div>
                        <div className={styles.formGroup}>
                          <label htmlFor="apartment">Piso o Dpto. (Ej.: 2A)</label>
                          <input type="text" id="apartment" value={address.apartment} onChange={(e) => setAddress({...address, apartment: e.target.value})} placeholder="Opcional" />
                        </div>
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="recipient">Destinatario</label>
                        <input type="text" id="recipient" value={address.recipient} onChange={(e) => setAddress({...address, recipient: e.target.value})} placeholder="fabio arze" />
                      </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* 2. MÉTODO DE PAGO */}
          {activeTab === 1 && (
            <div className={styles.formSection}>
              <h2 className={styles.sectionTitle}>💳 Método de pago</h2>
              
              <div className={styles.radioOptionContainer}> {/* Contenedor para que se parezca al de entrega */}
                <div className={styles.radioOption}>
                  <input type="radio" name="paymentMethod" value="cash" checked={true} onChange={() => {}} />
                  <label>Pagar en Efectivo</label>
                </div>
              </div>
              
              <p style={{marginTop: '20px', fontSize: '15px', color: '#666'}}>
                * Actualmente, solo aceptamos pagos en efectivo al momento de la entrega o al recoger en tienda.
              </p>
            </div>
          )}

          {/* --- Botones de Navegación --- */}
          <div className={styles.navigationButtons}>
            <button className={`${styles.navigationButton} ${styles.backButton}`} onClick={handlePrevStep}>
              {activeTab === 0 ? 'VOLVER AL CARRITO' : 'ANTERIOR'}
            </button>
            <button className={`${styles.navigationButton} ${styles.nextButton}`} onClick={handleNextStep}>
              {activeTab === 1 ? 'FINALIZAR COMPRA' : 'SIGUIENTE'}
            </button>
          </div>
        </div>

        {/* --- Resumen de la Compra (Sidebar) --- */}
        <div className={styles.summarySidebar}>
          <h3 className={styles.summaryTitle}>Resumen de la compra</h3>
          <div className={styles.summaryProducts}>
            {cartItems.length === 0 ? (
              <p style={{color: '#777'}}>Tu carrito está vacío.</p>
            ) : (
              cartItems.map(item => (
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
              ))
            )}
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
                    <span>Costo estimado de delivery:</span>
                    <strong>Bs. {deliveryCost.toFixed(2)}</strong>
                </div>
            )}
            
            <div className={styles.summaryTotalFinal}>
              <span>TOTAL</span>
              <span>Bs. {total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <span>© ic norte 2023. todos los derechos reservados.</span>
        <a href="/politica-de-privacidad">Política de Privacidad</a>
        <a href="/terminos-y-condiciones">Términos y Condiciones</a>
      </footer>

      {/* MODAL DEL MAPA */}
      {isMapModalOpen && (
        <div className={styles.mapModalBackdrop} onClick={() => setIsMapModalOpen(false)}>
          <div className={styles.mapModalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.mapModalCloseButton} onClick={() => setIsMapModalOpen(false)}>X</button>
            <h3 className={styles.mapModalTitle}>Selecciona tu Ubicación Exacta</h3>
            <div className={styles.interactiveMapPlaceholder}>
                (Aquí iría el mapa interactivo de Google Maps/OpenStreetMap)
            </div>
            <p className={styles.mapModalInfo}>Arrastra el marcador para ajustar tu ubicación de entrega.</p>
            <button className={styles.mapModalConfirmButton} onClick={() => setIsMapModalOpen(false)}>
              Confirmar Ubicación
            </button>
          </div>
        </div>
      )}
    </div>
  );
}