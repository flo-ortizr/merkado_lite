'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchProducts, createProduct } from '@/services/productService'; 
import { getAllCategories } from '@/services/categoryService';
import { Product } from '@/app/models/Product';
import { Category } from '@/app/models/Category';
const MENU_OPTIONS = [
  
  { 
    label: 'Alertas', 
    path: '/almacen/alertas', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
      </svg>
    ) 
  },
  { 
    label: 'Inventario', 
    path: '/almacen/inventario', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10m-4-6h8m-4 0v-4"></path>
      </svg>
    ) 
  },
  { 
    label: 'Reposición Stock', 
    path: '/almacen/reposicion-stock', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 0020 8h-2.22l-.123-.382a8.04 8.04 0 00-15.658 0L4.22 8H20v2m-6-10v5m-6-5v5m-4 2l4 4m6-4l-4 4"></path>
      </svg>
    ) 
  },
  { 
    label: 'Vencidos', 
    path: '/almacen/vencidos', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
      </svg>
    ) 
  },
  { 
    label: 'Órdenes de Compra', 
    path: '/almacen/ordenes-compra', 
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path>
      </svg>
    ) 
  },
];


const SidebarMenu = ({ menuOptions, activePath }) => {
  const router = useRouter(); 
  return (
    <nav className="flex flex-col space-y-2">
      {menuOptions.map((item) => (
        <a
          key={item.path}
          href={item.path}
          className={`
            flex items-center px-4 py-3 rounded-lg transition-colors duration-200 text-sm font-medium
            ${item.path === activePath || item.isActive
              ? 'bg-red-600 text-white shadow-lg hover:bg-red-700'
              : 'text-gray-300 hover:bg-gray-700 hover:text-red-400'
            }
          `}
        >
          <span className="mr-3">{item.icon}</span>
          {item.label}
        </a>
      ))}
    </nav>
  );
};

// =================================================================
// COMPONENTE PRINCIPAL
// =================================================================
const GestionProductos = () => {
  const router = useRouter();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('active');
  const [categoryId, setCategoryId] = useState<number | null>(null);

const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState('');
  const [activePath, setActivePath] = useState('/almacen/productos');
const [imageFile, setImageFile] = useState<File | null>(null);


  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (error: any) {
      setMessage(error.message);
    }
  };

 const loadCategories = async () => {
  try {
    const data = await getAllCategories();
    // Validamos que 'id' exista antes de convertir a número
    const formatted = data.map(c => ({
      id_category: Number(c.id || c.id_category), 
      name: c.name
    }));
    setCategories(formatted);
  } catch (error: any) {
    console.error('Error cargando categorías', error);
  }
};




  const uploadImage = async (): Promise<string | null> => {
  if (!imageFile) return null;

  const formData = new FormData();
  formData.append('image', imageFile);

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  return data.imageUrl;
};


 const handleCreateProduct = async () => {
  

  if (!name || !price || !description || categoryId === null) {
    setMessage('ERROR: Complete todos los campos.');
    
    return;
  }

  let imageUrl: string | undefined = undefined;

  if (imageFile) {
    try {
      const uploadedUrl = await uploadImage();
      
      if (!uploadedUrl) {
        setMessage('ERROR al subir imagen');
        
        return;
      }
      imageUrl = uploadedUrl;
    } catch (error) {
      setMessage('ERROR al subir imagen');
      
      return;
    }
  }

  const dto: Product = {
    id_product: 0,
    name,
    price,
    description,
    status,
    image_url: imageUrl, // opcional
    category: { id_category: categoryId, name: '' },
  };

  try {
    await createProduct(dto);
    console.log('Producto creado exitosamente');

    setMessage('Producto creado correctamente!');
    setName('');
    setPrice('');
    setDescription('');
    setCategoryId(null);
    setImageFile(null);

    await loadProducts();
  } catch (error: any) {
    setMessage(error.message);
    console.log('Error al crear producto en backend:', error);
  }
};




  const handleLogout = () => router.push('/');
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  setImageFile(file);
};



return (
  <div className="min-h-screen p-6 bg-gray-900 text-gray-100 font-sans">

    {/* Header Principal */}
    <div className="w-full mb-8 flex justify-between items-center">
      <h1 className="text-3xl font-bold text-red-400">INVENTARIO</h1>
      <button 
        onClick={handleLogout}
        className="text-sm text-gray-400 underline hover:text-red-400"
      >
        Cerrar Sesión
      </button>
    </div>

    {/* Contenedor principal con menu lateral, formulario y tabla */}
    <div className="flex justify-center items-start gap-8">
      
      {/* Menu lateral */}
      <div className="lg:w-1/6 p-4 bg-gray-900 rounded-lg shadow-inner flex flex-col flex-shrink-0">
        <h2 className="text-lg font-semibold mb-5 text-gray-300 border-b border-gray-700 pb-3">Menú</h2>
        <SidebarMenu menuOptions={MENU_OPTIONS} activePath={activePath} />
      </div>

      {/* Formulario */}
      <div className="lg:w-2/5 p-6 bg-gray-800 rounded-xl shadow-2xl flex flex-col gap-4">
        <h2 className="text-xl font-bold text-red-400 mb-4">CREAR NUEVO PRODUCTO</h2>
        <input type="text" placeholder="Nombre del producto" value={name} onChange={e=>setName(e.target.value)}
          className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 text-sm" />
        <input type="text" placeholder="Precio" value={price} onChange={e=>setPrice(e.target.value)}
          className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 text-sm" />
        <textarea placeholder="Descripción" value={description} onChange={e=>setDescription(e.target.value)}
          className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 text-sm" />
       <input
  type="file"
  accept="image/*"
  onChange={handleImageUpload}
  className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 text-sm"
/>

<select
  value={categoryId === null ? "" : categoryId} 
  onChange={e => {
    const val = e.target.value;
    setCategoryId(val === "" ? null : Number(val));
  }}
  className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-red-500 outline-none transition-all"
>
  <option value="">Seleccione una categoría</option>
  {categories.map(c => (
    <option key={c.id_category} value={c.id_category}>
      {c.name}
    </option>
  ))}
</select>


        <button onClick={handleCreateProduct} 
          className="w-full py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all duration-300">
          Crear Producto
        </button>

        {message && (
          <p className={`mt-2 p-2 rounded-lg text-sm ${message.startsWith('ERROR') ? 'bg-red-800 text-red-200' : 'bg-gray-700 text-gray-200'}`}>
            {message}
          </p>
        )}
      </div>

      {/* Tabla de productos */}
      <div className="lg:w-3/5 p-6 bg-gray-800 rounded-xl shadow-2xl flex flex-col">
        <h2 className="text-xl font-bold text-red-400 mb-4">LISTA DE PRODUCTOS</h2>
        <div className="flex-1 overflow-y-auto">
          <table className="min-w-full table-auto text-sm text-gray-200">
            <thead className="text-xs text-gray-400 uppercase bg-gray-700 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Nombre</th>
                <th className="px-4 py-2">Precio</th>
                <th className="px-4 py-2">Descripción</th>
                <th className="px-4 py-2">Estado</th>
                <th className="px-4 py-2">Categoría</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p=>(
                <tr key={p.id_product} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="px-4 py-2">{p.id_product}</td>
                  <td className="px-4 py-2">{p.name}</td>
                  <td className="px-4 py-2">{p.price}</td>
                  <td className="px-4 py-2">{p.description}</td>
                  <td className="px-4 py-2">{p.status}</td>
                  <td className="px-4 py-2">{p.category?.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length===0 && <p className="text-center text-gray-500 italic py-5">No hay productos registrados.</p>}
        </div>
      </div>

    </div>
      </div>
  );
};

export default GestionProductos;
