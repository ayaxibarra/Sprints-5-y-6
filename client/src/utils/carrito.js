export function agregarProducto(items, producto) {
  const existe = items.some(item => item.id === producto.id)
  return existe
    ? items.map(item => item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item)
    : [...items, { id: producto.id, name: producto.name, price: producto.price, cantidad: 1 }]
}

export function quitarProducto(items, id) {
  return items.filter(item => item.id !== id)
}

export function contarUnidades(items) {
  return items.reduce((total, item) => total + item.cantidad, 0)
}

export function calcularTotal(items) {
  return items.reduce((total, item) => total + item.price * item.cantidad, 0)
}

// Moneda ilustrativa acordada para esta versión educativa.
export const formatoPrecio = valor => new Intl.NumberFormat('es-AR', {
  style: 'currency', currency: 'ARS', currencyDisplay: 'code',
}).format(valor)