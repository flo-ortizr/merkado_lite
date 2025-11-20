'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  
  // Estado de dirección
  const [address, setAddress] = useState({ street: '', number: '', apartment: '', recipient: 'Fabio Arze' });
  const [deliveryDetails, setDeliveryDetails] = useState({ date: '19/11/2025', time: '13:00-15:00' }); 
  const [discountAmount, setDiscountAmount] = useState(0);

  // Referencias del Mapa
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<any>(null);

  // 1. Cargar scripts (Leaflet) y carrito al iniciar
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    document.head.appendChild(script);

    const storedCart = localStorage.getItem('mklite_cart');
    if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        setCartItems(parsedCart);
        const tempSubtotal = parsedCart.reduce((acc: number, item: CartItem) => acc + item.priceNumeric * item.quantity, 0);
        
        const discountApplied = localStorage.getItem('mklite_discount_applied'); 
        if (discountApplied === 'true') {
            setDiscountAmount(tempSubtotal * 0.10);
        }
    } else {
        router.push('/carrito');
    }

    return () => {
      if (document.head.contains(link)) document.head.removeChild(link);
      if (document.head.contains(script)) document.head.removeChild(script);
    };
  }, [router]);

  // 2. Inicializar Mapa (ESTILO ESTÉTICO "VOYAGER")
  useEffect(() => {
    if (activeTab === 0 && deliveryMethod === 'delivery') {
      const checkLeaflet = setInterval(() => {
        if ((window as any).L && mapContainerRef.current && !mapRef.current) {
          clearInterval(checkLeaflet);
          const L = (window as any).L;
          
          // Coordenadas Cochabamba
          const initialCoords = [-17.3935, -66.1570];
          const map = L.map(mapContainerRef.current).setView(initialCoords, 15);

          // --- AQUÍ ESTÁ EL CAMBIO PARA QUE SE VEA ESTÉTICO ---
          // Usamos CartoDB Voyager en lugar de OpenStreetMap por defecto
          L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
          }).addTo(map);

          const icon = L.icon({
             iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
             shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
             iconSize: [25, 41],
             iconAnchor: [12, 41],
             popupAnchor: [1, -34],
          });

          // --- Función para obtener nombre de calle (API) ---
          const fetchAddress = async (lat: number, lng: number) => {
            setAddress(prev => ({...prev, street: 'Cargando dirección...'}));
            try {
              const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
              const data = await response.json();
              
              const road = data.address?.road || data.address?.pedestrian || data.address?.suburb || 'Ubicación seleccionada';
              const houseNumber = data.address?.house_number || '';

              setAddress(prev => ({
                ...prev, 
                street: road,
                number: houseNumber || prev.number
              }));
            } catch (error) {
              setAddress(prev => ({...prev, street: 'Ubicación seleccionada'}));
            }
          };

          map.on('click', function(e: any) {
             const { lat, lng } = e.latlng;
             if (markerRef.current) {
                markerRef.current.setLatLng([lat, lng]);
             } else {
                markerRef.current = L.marker([lat, lng], { icon: icon }).addTo(map);
             }
             fetchAddress(lat, lng);
          });

          mapRef.current = map;
        }
      }, 100);

      return () => clearInterval(checkLeaflet);
    } else {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    }
  }, [activeTab, deliveryMethod]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.priceNumeric * item.quantity, 0);
  const deliveryCost = deliveryMethod === 'delivery' ? 10.00 : 0; 
  const total = subtotal - discountAmount + deliveryCost;

  const handleNextStep = () => {
    if (activeTab < 1) setActiveTab(prev => prev + 1);
    else {
      alert('Compra realizada con éxito!');
      localStorage.removeItem('mklite_cart');
      localStorage.removeItem('mklite_discount_applied');
      router.push('/Home');
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
          <nav className={styles.tabsNav}>
            <span className={`${styles.tabItem} ${activeTab === 0 ? styles.tabItemActive : ''}`} onClick={() => setActiveTab(0)}>MÉTODO DE ENTREGA</span>
            <span className={`${styles.tabItem} ${activeTab === 1 ? styles.tabItemActive : ''}`} onClick={() => setActiveTab(1)}>MÉTODO DE PAGO</span>
          </nav>

          {activeTab === 0 && (
            <div className={styles.formSection}>
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
                  <h3 className={styles.sectionTitle} style={{marginTop: '30px'}}>Ubicación de entrega</h3>
                  
                  {/* MAPA INCRUSTADO */}
                  <div id="embedded-map" ref={mapContainerRef} className={styles.embeddedMapContainer}>
                    <div className={styles.loadingMap}>Cargando mapa...</div>
                  </div>
                  <p className={styles.mapInstructions}>Haz clic en el mapa para autocompletar la dirección exacta.</p>
                  
                  <div className={styles.inputGrid}>
                    <div className={styles.formGroup}>
                      <label>Calle</label>
                      <input 
                        type="text" 
                        value={address.street} 
                        onChange={(e) => setAddress({...address, street: e.target.value})} 
                        placeholder="Selecciona en el mapa o escribe aquí" 
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Número</label>
                      <input 
                        type="text" 
                        value={address.number} 
                        onChange={(e) => setAddress({...address, number: e.target.value})} 
                        placeholder="123" 
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Dpto/Piso</label>
                      <input type="text" value={address.apartment} onChange={(e) => setAddress({...address, apartment: e.target.value})} placeholder="Opcional" />
                    </div>
                  </div>

                  <h3 className={styles.sectionTitle} style={{marginTop: '20px'}}>Detalles</h3>
                  <div className={styles.formGroup}>
                    <label>Destinatario</label>
                    <input type="text" value={address.recipient} onChange={(e) => setAddress({...address, recipient: e.target.value})} />
                  </div>
                  <div className={styles.inputGrid}>
                    <div className={styles.formGroup}>
                        <label>Día de Entrega</label>
                        <input type="text" value={deliveryDetails.date} className={styles.datePickerInput} onChange={(e) => setDeliveryDetails({...deliveryDetails, date: e.target.value})} />
                    </div>
                    <div className={styles.formGroup}>
                          <label>Hora</label>
                          <select value={deliveryDetails.time} onChange={(e) => setDeliveryDetails({...deliveryDetails, time: e.target.value})} className={styles.datePickerInput}>
                              <option value="09:00-11:00">09:00 - 11:00</option>
                              <option value="11:00-13:00">11:00 - 13:00</option>
                          </select>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 1 && (
            <div className={styles.formSection}>
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
            {discountAmount > 0 && (
                <div className={styles.summaryTotalRow}>
                    <span className={styles.discountText}>Descuento (LITE10):</span>
                    <strong className={styles.discountText}>- Bs. {discountAmount.toFixed(2)}</strong>
                </div>
            )}
            <div className={styles.summaryTotalFinal}>
              <span>TOTAL</span>
              <span>Bs. {total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <span>© ic norte 2023. todos los derechos reservados.</span>
        <a href="/politica-de-privacidad">Política de Privacidad</a>
        <a href="/terminos-y-condiciones">Términos y Condiciones</a>
      </footer>
    </div>
  );
}