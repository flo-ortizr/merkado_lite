import React from 'react';

// Componente HomePage con las categorías y el diseño en escala de grises
export default function HomePage() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f0f0' }}>

      {/* Header */}
      <header style={{ backgroundColor: '#333', color: '#fff', padding: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
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
        </div>
      </header>

      {/* Main Section */}
      <section style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ backgroundColor: '#777', padding: '20px', borderRadius: '15px', marginBottom: '30px', height: '300px' }}>
          <h1 style={{ fontSize: '24px', marginBottom: '10px', color: '#fff' }}>Alimentos Frescos Entrega Rápida</h1>
          <p style={{ fontSize: '18px', color: '#fff' }}>Recibe productos frescos, artículos de despensa y todo para tu hogar en la puerta de tu casa en menos de 30 minutos.</p>
          <button style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#555',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}>Comprar ahora</button>
        </div>
        
        {/* Categories */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', justifyItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '200px',
              height: '200px',
              backgroundColor: '#bbb',
              borderRadius: '15px',
              marginBottom: '10px',
            }}></div>
            <h3 style={{ fontSize: '18px', marginBottom: '5px' }}>Frutas frescas</h3>
            <p style={{ fontSize: '14px', color: '#555' }}>20 artículos</p>
            <button style={{
              padding: '10px 20px',
              backgroundColor: '#888',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}>Frutas frescas</button>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '200px',
              height: '200px',
              backgroundColor: '#bbb',
              borderRadius: '15px',
              marginBottom: '10px',
            }}></div>
            <h3 style={{ fontSize: '18px', marginBottom: '5px' }}>Verduras</h3>
            <p style={{ fontSize: '14px', color: '#555' }}>30 artículos</p>
            <button style={{
              padding: '10px 20px',
              backgroundColor: '#888',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}>Verduras</button>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '200px',
              height: '200px',
              backgroundColor: '#bbb',
              borderRadius: '15px',
              marginBottom: '10px',
            }}></div>
            <h3 style={{ fontSize: '18px', marginBottom: '5px' }}>Productos lácteos</h3>
            <p style={{ fontSize: '14px', color: '#555' }}>100 artículos</p>
            <button style={{
              padding: '10px 20px',
              backgroundColor: '#888',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}>Productos lácteos</button>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '200px',
              height: '200px',
              backgroundColor: '#bbb',
              borderRadius: '15px',
              marginBottom: '10px',
            }}></div>
            <h3 style={{ fontSize: '18px', marginBottom: '5px' }}>Carne y aves de corral</h3>
            <p style={{ fontSize: '14px', color: '#555' }}>60 artículos</p>
            <button style={{
              padding: '10px 20px',
              backgroundColor: '#888',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}>Carne y aves de corral</button>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '200px',
              height: '200px',
              backgroundColor: '#bbb',
              borderRadius: '15px',
              marginBottom: '10px',
            }}></div>
            <h3 style={{ fontSize: '18px', marginBottom: '5px' }}>Artículos de panadería</h3>
            <p style={{ fontSize: '14px', color: '#555' }}>20 artículos</p>
            <button style={{
              padding: '10px 20px',
              backgroundColor: '#888',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}>Artículos de panadería</button>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '200px',
              height: '200px',
              backgroundColor: '#bbb',
              borderRadius: '15px',
              marginBottom: '10px',
            }}></div>
            <h3 style={{ fontSize: '18px', marginBottom: '5px' }}>Bocadillos</h3>
            <p style={{ fontSize: '14px', color: '#555' }}>200 artículos</p>
            <button style={{
              padding: '10px 20px',
              backgroundColor: '#888',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}>Bocadillos</button>
          </div>
        </div>
      </section>
    </div>
  );
}


