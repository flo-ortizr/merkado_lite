import React from 'react';

// Componente HomePage con las categorías y el diseño en escala de grises
export default function HomePage() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f0f0' }}>

      {/* Header - Fondo negro (#1a1a1a) */}
      <header style={{ backgroundColor: '#1a1a1a', color: '#fff', padding: '10px' }}>
        {/* Logo y barra de búsqueda */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '0 20px' }}>
          {/* Logo */}
          <div style={{ fontWeight: 'bold', fontSize: '24px', color: '#fff' }}>
            MERCADO LITE
          </div>

          {/* Barra de búsqueda */}
          <input
            type="text"
            placeholder="Buscar productos por nombre..."
            style={{
              padding: '10px',
              width: '400px',
              borderRadius: '5px',
              border: 'none',
              backgroundColor: '#fff',
              color: '#333',
            }}
          />

          {/* Account y Cart (Placeholders como en la imagen) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ cursor: 'pointer' }}>Account</span>
            <span style={{ cursor: 'pointer' }}>Cart</span>
          </div>
        </div>
      </header>

      {/* Main Section 
          CAMBIO AQUÍ: 'padding' de '20px' a '20px 0' para quitar bordes laterales
      */}
      <section style={{ padding: '20px 0', textAlign: 'center' }}>
        
        {/* Banner Principal - Fondo negro (#1a1a1a) */}
        <div style={{
          backgroundColor: '#1a1a1a', // Fondo negro
          padding: '20px',
          // borderRadius: '15px', // <-- CAMBIO: Esta línea fue eliminada
          marginBottom: '30px',
          height: '700px', // Mantenemos la altura de 900px
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          color: '#fff'
        }}>
          {/* Contenido de texto a la izquierda */}
          <div style={{ textAlign: 'left', maxWidth: '50%', padding: '0 40px' }}> {/* Añadido padding para que el texto no se pegue al borde */}
            <span style={{
              backgroundColor: '#555',
              color: '#fff',
              padding: '5px 10px',
              borderRadius: '5px',
              fontSize: '14px',
              fontWeight: 'bold',
              marginBottom: '10px',
              display: 'inline-block'
            }}>Oferta Flash!</span>
            <h1 style={{ fontSize: '48px', marginBottom: '10px', color: '#fff' }}>Alimentos Frescos Delivery Fast</h1>
            <p style={{ fontSize: '18px', color: '#ccc' }}>Recibe productos frescos, artículos de despensa y todo para tu hogar en la puerta de tu casa en menos de 30 minutos.</p>
            <button style={{
              padding: '10px 20px',
              fontSize: '16px',
              backgroundColor: '#555',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '20px'
            }}>Comprar ahora</button>
          </div>

          {/* Rectángulo gris para la imagen a la derecha */}
          <div style={{
            width: '45%',
            height: '460px', // Ajustado a la altura del banner
            backgroundColor: '#888',
            borderRadius: '10px', // <-- Eliminado también para que sea recto
            marginRight: '40px' // Añadido margen para que no se pegue al borde
          }}>
          </div>
        </div>

        {/* Categories */}
<div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 200px)', columnGap: '300px', rowGap: '40px', justifyContent: 'center' }}>
          
          {/* Categoría 1 */}
          <div style={{
            width: '300px',
            height: '310px',
            backgroundColor: '#bbb',
            borderRadius: '15px',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer'
          }}>
            <div style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              textAlign: 'left',
              color: '#fff'
            }}>
              <h3 style={{ fontSize: '18px', marginBottom: '5px' }}>Frutas frescas</h3>
              <p style={{ fontSize: '14px', color: '#ccc' }}>20 artículos</p>
            </div>
          </div>

          {/* Categoría 2 */}
          <div style={{
            width: '300px',
            height: '310px',
            backgroundColor: '#bbb',
            borderRadius: '15px',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer'
          }}>
            <div style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              textAlign: 'left',
              color: '#fff'
            }}>
              <h3 style={{ fontSize: '18px', marginBottom: '5px' }}>Verduras</h3>
              <p style={{ fontSize: '14px', color: '#ccc' }}>30 artículos</p>
            </div>
          </div>

          {/* Categoría 3 */}
          <div style={{
            width: '300px',
            height: '310px',
            backgroundColor: '#bbb',
            borderRadius: '15px',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer'
          }}>
            <div style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              textAlign: 'left',
              color: '#fff'
            }}>
              <h3 style={{ fontSize: '18px', marginBottom: '5px' }}>Productos lácteos</h3>
              <p style={{ fontSize: '14px', color: '#ccc' }}>100 artículos</p>
            </div>
          </div>

          {/* Categoría 4 */}
          <div style={{
            width: '300px',
            height: '310px',
            backgroundColor: '#bbb',
            borderRadius: '15px',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer'
          }}>
            <div style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              textAlign: 'left',
              color: '#fff'
            }}>
              <h3 style={{ fontSize: '18px', marginBottom: '5px' }}>Carne y aves de corral</h3>
              <p style={{ fontSize: '14px', color: '#ccc' }}>60 artículos</p>
            </div>
          </div>

          {/* Categoría 5 */}
          <div style={{
            width: '300px',
            height: '310px',
            backgroundColor: '#bbb',
            borderRadius: '15px',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer'
          }}>
            <div style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              textAlign: 'left',
              color: '#fff'
            }}>
              <h3 style={{ fontSize: '18px', marginBottom: '5px' }}>Artículos de panadería</h3>
              <p style={{ fontSize: '14px', color: '#ccc' }}>20 artículos</p>
            </div>
          </div>

          {/* Categoría 6 */}
          <div style={{
            width: '300px',
            height: '310px',
            backgroundColor: '#bbb',
            borderRadius: '15px',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer'
          }}>
            <div style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              textAlign: 'left',
              color: '#fff'
            }}>
              <h3 style={{ fontSize: '18px', marginBottom: '5px' }}>Bocadillos</h3>
              <p style={{ fontSize: '14px', color: '#ccc' }}>200 artículos</p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}