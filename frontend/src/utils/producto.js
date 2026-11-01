// Traduce un producto del schema en español (nombre, precio, imagenUrl...)
// a la forma que usan los componentes públicos (name, price, img, id...),
// para no tener que reescribir el carrito, ProductDetail, etc.
// La ruta de la imagen se deja tal cual: ProductCard decide cómo resolverla.
export function aVistaPublica(p) {
  if (!p) return p;
  return {
    ...p,
    id: p._id,
    name: p.nombre,
    desc: p.descripcion,
    price: p.precio,
    img: p.imagenUrl ?? "",
    specs: p.specs ?? {},
  };
}
