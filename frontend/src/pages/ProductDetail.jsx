import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "../hooks/useProduct.js";
import { resolveImageSrc } from "../utils/imagen.js";

function formatPrice(price) {
  return `$${Number(price).toLocaleString("es-AR")}`;
}


export default function ProductDetail({ onAgregarAlCarrito }) {

  const { id } = useParams();
  const navigate = useNavigate();
  const {product, loading, error, retry } = useProduct(id);

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

  if (error|| !product) {
    // "Reintentar" solo cuando tiene sentido (red caída, error del servidor).
    // No aparece para producto inexistente o id inválido.
    const reintentable = error ? error.reintentable !== false : false;
    
    return (
      <div className="contenedor-producto estado-error" role="alert">
        <h1>Oops!</h1>
        <p>{error? error.message : "El producto no existe o fue removido."}</p>
        {reintentable && (
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
  const imagen = resolveImageSrc(product.img);
  
  return (
    <article className="contenedor-producto">
      <section className="seccion-imagen">
        <img
          src={imagen}
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