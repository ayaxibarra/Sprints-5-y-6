import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../services/productService";

function formatPrice(price) {
  return `$${Number(price).toLocaleString("es-AR")}`;
}

// Ya no recibimos 'id' ni 'onVolver' por props; solo la función del carrito.
export default function ProductDetail({ onAgregarAlCarrito }) {
  // 1. Extraemos el ID dinámico directamente desde la URL (ej: /productos/123)
  const { id } = useParams();
  
  // 2. Instanciamos el hook para manejar las redirecciones programáticas
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    // El ID capturado de la URL se inyecta directamente en la petición
    getProductById(id)
      .then((data) => {
        if (!cancelled) setProduct(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setProduct(null);
          setError(err);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, attempt]);

  const retry = () => setAttempt((n) => n + 1);

  // 3. Reemplazamos la ejecución de la prop onVolver por la ruta estática '/productos'
  const backButton = (
    <button type="button" className="btn-secondary" onClick={() => navigate('/productos')}>
      Volver al catálogo
    </button>
  );

  if (loading) {
    return (
      <div className="contenedor-producto" role="status" aria-live="polite">
        <span className="loader" aria-hidden="true" />
        <p>Cargando producto...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="contenedor-producto estado-error" role="alert">
        <h1>Oops!</h1>
        <p>{error.message}</p>
        {!(error.status >= 400 && error.status < 500) && (
          <button type="button" className="btn-primary" onClick={retry}>
            Reintentar
          </button>
        )}
        {backButton}
      </div>
    );
  }

  const specs = Object.entries(product.specs || {}).filter(
    ([, valor]) => valor !== undefined && valor !== null && valor !== ""
  );

  return (
    <article className="contenedor-producto">
      <section className="seccion-imagen">
        <img
          src={`${import.meta.env.BASE_URL}${product.img}`}
          alt={product.name}
          className="product-image"
        />
      </section>

      <section className="seccion-informacion">
        {backButton}
        <h1 className="titulo-producto">{product.name}</h1>
        <p className="descripcion-producto">
          {product.desc || "Producto artesanal de Hermanos Jota."}
        </p>

        {specs.length > 0 && (
          <ul className="detalles-producto">
            {specs.map(([etiqueta, valor]) => (
              <li key={etiqueta}>
                <span className="detalle-titulo">{etiqueta}</span>
                <span className="detalle-valor">{valor}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="contenedor-precio">
          <span className="precio-producto">{formatPrice(product.price)}</span>
        </div>

        {onAgregarAlCarrito && (
          <button
            type="button"
            className="btn-agregar-carrito"
            onClick={() => onAgregarAlCarrito(product)}
          >
            Añadir al Carrito
          </button>
        )}
      </section>
    </article>
  );
}