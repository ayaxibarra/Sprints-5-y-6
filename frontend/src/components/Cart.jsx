import { calcularTotal, formatoPrecio } from '../utils/carrito.js'

export default function Cart({ items, onQuitar, onVolver }) {
  return (
    <section aria-labelledby="titulo-carrito">
      <h1 id="titulo-carrito">Tu carrito</h1>
      {items.length === 0 ? <p>Tu carrito está vacío.</p> : <>
        <ul className="cart-list">
          {items.map(item => <li key={item.id} className="cart-item">
            <div>
              <h2>{item.name}</h2>
              <p>Cantidad: {item.cantidad}</p>
              <p>Precio unitario: {formatoPrecio(item.price)}</p>
              <p>Subtotal: {formatoPrecio(item.price * item.cantidad)}</p>
            </div>
            <button className="btn-secondary" type="button" onClick={() => onQuitar(item.id)} aria-label={`Quitar ${item.name} del carrito`}>Quitar</button>
          </li>)}
        </ul>
        <p className="cart-total">Total: {formatoPrecio(calcularTotal(items))}</p>
      </>}
      <button className="btn-primary" type="button" onClick={onVolver}>Seguir explorando</button>
      <p>Precios ilustrativos en ARS. No se realizan compras reales.</p>
    </section>
  )
}