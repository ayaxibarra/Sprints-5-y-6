import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../hooks/useProducts.js";
import ProductCard from '../components/ProductCard.jsx';

// Minúsculas y sin tildes: "sillon" encuentra "Sillón Copacabana".
function normalizar(texto) {
  return String(texto)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Props (contrato definido por App.jsx):
//   onAgregarAlCarrito(producto) → App agrega al carrito (opcional).
// El detalle se abre navegando a /productos/:id (React Router), sin prop intermedia.
export default function ProductList({ onAgregarAlCarrito }) {
  const navigate = useNavigate();
  const { products, loading, error, retry } = useProducts();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");



  // Búsqueda por nombre + orden, calculados sobre la lista ya cargada
  // (no se hace otra consulta a la API).
  const visibleProducts = useMemo(() => {
    const termino = normalizar(search.trim());

    const filtrados = products.filter((p) =>
      normalizar(p.name).includes(termino)
    );

    if (sort === "price-low") return [...filtrados].sort((a, b) => a.price - b.price);
    if (sort === "price-high") return [...filtrados].sort((a, b) => b.price - a.price);
    if (sort === "newest") return [...filtrados].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return filtrados;
  }, [products, search, sort]);

  // Todos los estados comparten el <h1> de la vista.
  const envolver = (contenido) => (
    <section aria-labelledby="titulo-catalogo">
      <h1 id="titulo-catalogo" className="seccion-titulo">Catálogo</h1>
      {contenido}
    </section>
  );

  if (loading) {
    return envolver(
      <div className="estado-catalogo" role="status" aria-live="polite">
        <span className="loader" aria-hidden="true" />
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return envolver(
      <div className="estado-catalogo estado-error" role="alert">
        <p>{error.message}</p>
        <button type="button" className="btn-primary" onClick={retry}>
          Reintentar
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return envolver(
      <p className="estado-catalogo">Todavía no hay productos disponibles.</p>
    );
  }

  return envolver(
    <>
      <div className="filter-bar">
        <div className="sort-box">
          <label htmlFor="sort">Ordenar por:</label>
          <div className="select-wrapper">
            <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="">Destacados</option>
              <option value="price-low">Precio: Menor a Mayor</option>
              <option value="price-high">Precio: Mayor a Menor</option>
              <option value="newest">Más recientes</option>

            </select>
          </div>
        </div>

        {/* Filtra mientras se escribe; Enter y la lupa no recargan la página. */}
        <form
          className="search-box"
          role="search"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="search"
            placeholder="Buscar productos..."
            aria-label="Buscar productos"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" aria-label="Buscar">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </form>
      </div>

      {visibleProducts.length === 0 ? (
        <div className="estado-catalogo" role="status">
          <p>No encontramos productos para “{search.trim()}”.</p>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setSearch("")}
          >
            Limpiar búsqueda
          </button>
        </div>
      ) : (
        <ul className="productos-grid">
          {visibleProducts.map((product) => (
            <li key={product.id}>
              <ProductCard
                product={product}
                headingLevel={2}
                onSelect={(id) => navigate(`/productos/${id}`)}
                onAddToCart={onAgregarAlCarrito}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}