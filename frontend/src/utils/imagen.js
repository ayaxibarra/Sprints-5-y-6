// Devuelve la URL lista para usar en <img src>.
// - URLs absolutas (http/https, // o data:) se utilizan tal cual.
// - Rutas relativas: se antepone BASE_URL sin duplicar barras.
// - Si no hay una imagen válida, devuelve null.
export function resolveImageSrc(img) {
  if (typeof img !== "string") return null;

  const valor = img.trim();

  if (!valor) return null;

  if (/^(https?:)?\/\//i.test(valor) || valor.startsWith("data:")) {
    return valor;
  }

  return `${import.meta.env.BASE_URL}${valor.replace(/^\/+/, "")}`;
}

// Compatibilidad con los componentes que utilizan el nombre resolverImagen.
export function resolverImagen(ruta) {
  return resolveImageSrc(ruta) ?? "";
}