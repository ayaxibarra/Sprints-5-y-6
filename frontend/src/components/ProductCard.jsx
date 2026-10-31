function formatPrice(price) {
  return `$${Number(price).toLocaleString("es-AR")}`;
}

export default function ProductCard({ product, onSelect, onAddToCart, headingLevel = 3 }) {
  const Titulo = `h${headingLevel}`;

  return (
    <article className="card">
      <img
        src={`${import.meta.env.BASE_URL}${product.img}`}
        alt={product.name}
        loading="lazy"
      />

      <div className="card-body">
        <Titulo className="card-title">{product.name}</Titulo>
        <p className="card-description">
          {product.desc || "Producto artesanal de Hermanos Jota."}
        </p>
        <p className="card-price">{formatPrice(product.price)}</p>

        <div className="card-actions">
          {onAddToCart && (
            <button
              type="button"
              className="btn-primary"
              onClick={() => onAddToCart(product)}
            >
              Añadir al Carrito
            </button>
          )}
          {onSelect && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => onSelect(product.id)}
              aria-label={`Ver detalle de ${product.name}`}
            >
              Ver Detalle
            </button>
          )}
        </div>
      </div>
    </article>
  );
}