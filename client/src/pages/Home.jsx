import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { getProducts } from '../services/productService.js';
import { aVistaPublica } from '../utils/producto.js';

export function Home() {
    const [productosDestacados, setProductosDestacados] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        let activo = true;
        getProducts()
            .then(data => {
                if (!activo) return;
                setProductosDestacados(data.slice(0, 4).map(aVistaPublica));
                setCargando(false);
            })
            .catch(err => {
                if (!activo) return;
                setError(err.message);
                setCargando(false);
            });
        return () => { activo = false; };
    }, []);

    return (
        <>
            <section className="hero" aria-labelledby="hero-title">
                <div className="hero-content">
                    <p className="hero-eyebrow">Mueblería artesanal</p>
                    <h1 id="hero-title">HERMANOS JOTA</h1>
                    <p className="hero-description">Tradición que perdura. Diseño que trasciende.</p>
                    <p className="hero-text">
                        Cada pieza cuenta una historia de artesanía que honra el pasado mientras abraza el futuro.
                    </p>
                    <button onClick={() => navigate('/productos')} className="btn-primary">Nuestros Productos</button>
                </div>
                <div className="hero-image-container">
                    <img src="/img/Aparador Uspallata.png" alt="Aparador artesanal Hermanos Jota" className="hero-img" />
                </div>
            </section>

            <section className="destacados-container" aria-labelledby="destacados-title">
                <div className="destacados-header">
                    <p className="section-eyebrow">Nuestra selección</p>
                    <h2 id="destacados-title" className="seccion-titulo">PRODUCTOS DESTACADOS</h2>
                    <p className="section-description">
                        Descubrí nuestra selección de piezas favoritas, seleccionadas para formar parte de tu hogar.
                    </p>
                </div>
                
                <div aria-live="polite">
                    {cargando && <p style={{ textAlign: 'center', gridColumn: '1 / -1' }}>Cargando productos destacados...</p>}
                    {error && <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: '#c0392b' }}>{error}</p>}
                    {!cargando && !error && productosDestacados.length === 0 && <p>No hay productos disponibles.</p>}
                    {!cargando && !error && (
                        <ul id="productos-destacados" className="productos-grid">
                            {productosDestacados.map((producto) => (
                                <li key={producto._id}>
                                    <ProductCard
                                        product={producto}
                                        onSelect={() => navigate(`/productos/${producto.id}`)}
                                        onAddToCart={() => console.log("Se configurará luego")}
                                        headingLevel={3}
                                    />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="destacados-action">
                    <button onClick={() => navigate('/productos')} className="btn-secondary">Ver catálogo completo</button>
                </div>
            </section>

            <section className="beneficios-container" aria-labelledby="beneficios-title">
                <div className="destacados-header">
                    <p className="section-eyebrow">Compromiso de Longevidad</p>
                    <h2 id="beneficios-title" className="seccion-titulo">PROGRAMA "HERENCIA VIVA"</h2>
                </div>
                <div className="beneficios-grid">
                    <article className="beneficio-card">
                        <h3>Garantía extendida</h3>
                        <p>10 años en estructura, 5 años en acabados.</p>
                    </article>
                    <article className="beneficio-card">
                        <h3>Servicio de restauración</h3>
                        <p>Recuperamos y renovamos piezas antiguas.</p>
                    </article>
                    <article className="beneficio-card">
                        <h3>Taller de cuidados</h3>
                        <p>Capacitación gratuita para clientes.</p>
                    </article>
                    <article className="beneficio-card">
                        <h3>Recompra garantizada</h3>
                        <p>Hasta 40% del valor en piezas bien cuidadas.</p>
                    </article>
                    <article className="beneficio-card">
                        <h3>Certificado de trazabilidad</h3>
                        <p>Origen de cada material utilizado.</p>
                    </article>
                </div>
            </section>

            <section className="testimonios-container" aria-labelledby="testimonios-title">
                <div className="destacados-header">
                    <p className="section-eyebrow">Sus Valoraciones</p>
                    <h2 id="testimonios-title" className="seccion-titulo">OPINIONES DE NUESTROS CLIENTES</h2>
                </div>
                <div className="testimonios-grid">
                    <article className="testimonio-card">
                        <p className="testimonio-texto">"El aparador que compramos superó nuestras expectativas. La atención al detalle en la madera es notable."</p>
                        <p className="testimonio-nombre">María F.</p>
                    </article>
                    <article className="testimonio-card">
                        <p className="testimonio-texto">"Muebles con historia y calidad real. Se nota que hay generaciones de oficio detrás de cada pieza."</p>
                        <p className="testimonio-nombre">Esteban A.</p>
                    </article>
                    <article className="testimonio-card">
                        <p className="testimonio-texto">"El servicio de restauración le dio una segunda vida a un mueble familiar. Excelente trabajo."</p>
                        <p className="testimonio-nombre">Lucía G.</p>
                    </article>
                </div>
                <div className="destacados-action">
                    <button onClick={() => navigate('/contacto')} className="btn-primary">Contacta con Nosotros</button>
                </div>
            </section>
        </>
    );
}