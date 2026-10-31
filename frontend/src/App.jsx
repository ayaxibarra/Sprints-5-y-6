import { useState, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { agregarProducto, quitarProducto, contarUnidades } from './utils/carrito.js';

// Componentes estáticos
import { Navbar } from './components/Navbar.jsx';
import { Footer } from './components/Footer.jsx';
import Cart from './components/Cart.jsx';

// Páginas (Vistas completas)
import { Home } from './pages/Home.jsx';
import ProductList from './pages/ProductList.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import ContactForm from './pages/Contact.jsx';
import CreateProduct from './pages/CreateProduct.jsx';
import './App.css';

export default function App() {
  const [carrito, setCarrito] = useState([]);
  const [aviso, setAviso] = useState('');
  const principal = useRef(null);

  function agregar(producto) {
    setCarrito(actual => agregarProducto(actual, producto));
    setAviso(`${producto.name} agregado al carrito.`);
  }

  function quitar(id) {
    setCarrito(actual => quitarProducto(actual, id));
    setAviso('Producto quitado del carrito.');
  }

  return (
    <BrowserRouter>
      <a href="#contenido" className="skip-link">Saltar al contenido</a>
      <Navbar cantidadCarrito={contarUnidades(carrito)} />
      
      <main id="contenido" ref={principal} tabIndex={-1}>
        <p role="status" aria-live="polite" aria-atomic="true" style={{ textAlign: 'center', color: '#87A96B', fontWeight: 'bold' }}>
          {aviso}
        </p>
        
        <Routes>
          <Route path="/" element={<Home onAgregarAlCarrito={agregar} />} />
          <Route path="/productos" element={<ProductList onAgregarAlCarrito={agregar} />} />
          <Route path="/productos/:id" element={<ProductDetail onAgregarAlCarrito={agregar} />} />
          <Route path="/carrito" element={<Cart items={carrito} onQuitar={quitar} />} />
          <Route path="/contacto" element={<ContactForm />} />
          <Route path="/admin/crear-producto" element={<CreateProduct />} />
        </Routes>
      </main>
      
      <Footer />
    </BrowserRouter>
  );
}