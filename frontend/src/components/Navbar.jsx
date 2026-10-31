import { Link } from 'react-router-dom';

export function Navbar({ cantidadCarrito }) {
    return (
        <header className="site-header">
            <div className="header-container">
                <div className="logo">
                    <Link to="/" aria-label="Mueblería Hermanos Jota - Inicio">
                        <img src="/img/logo.svg" alt="Logo Mueblería Hermanos Jota" className="logo-img" />
                    </Link>
                </div>
                <nav className="main-nav" aria-label="Menú de navegación principal">
                    <ul className="nav-list">
                        <li><Link to="/">Inicio</Link></li>
                        <li><Link to="/productos">Catálogo</Link></li>
                        <li><Link to="/contacto">Contacto</Link></li>
                    </ul>
                </nav>
                <div className="cart-widget">
                    <Link to="/carrito" id="cart-link" aria-label="Ver carrito de compras">
                        <span className="cart-icon" aria-hidden="true">🛒</span>
                        <span id="cart-counter" aria-live="polite">{cantidadCarrito || 0}</span>
                    </Link>
                </div>
            </div>
        </header>
    );
}