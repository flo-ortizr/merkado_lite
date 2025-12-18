// services/priceService.ts

// Asegúrate de que esta URL sea donde corre tu backend (normalmente puerto 3000)
const API_URL = 'http://localhost:3000'; 

// 1. Obtener lista de todos los productos (para el selector)
export const getProductsList = async () => {
  try {
    const response = await fetch(`${API_URL}/product`);
    if (!response.ok) throw new Error('Error al cargar productos');
    return await response.json();
  } catch (error) {
    console.error("Error en getProductsList:", error);
    return [];
  }
};

// 2. Obtener el historial de precios de un producto
export const getProductHistory = async (productId: number) => {
  try {
    // Esta ruta asume que tu backend tiene este endpoint.
    // Si tu backend usa otra ruta (ej: /product/history/:id), cámbiala aquí.
    const response = await fetch(`${API_URL}/price-history/product/${productId}`);
    if (!response.ok) return []; // Si no hay historial, devolvemos array vacío
    return await response.json();
  } catch (error) {
    console.error("Error en getProductHistory:", error);
    return [];
  }
};

// 3. Revertir Precio (Guardar nuevo precio)
export const revertProductPrice = async (productId: number, newPrice: number, motive: string) => {
  try {
    const response = await fetch(`${API_URL}/product/${productId}`, {
        method: 'PATCH', // Usamos PATCH o PUT para actualizar
        headers: { 
            'Content-Type': 'application/json',
            // Si necesitas token, aquí iría: 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
            price: newPrice, // Asegúrate que tu backend espera "price" o "precio"
            motive: motive   // Motivo de la reversión
        }) 
    });
    return response.ok;
  } catch (error) {
    console.error("Error en revertProductPrice:", error);
    return false;
  }
};