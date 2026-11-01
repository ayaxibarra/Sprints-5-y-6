// Devuelve la URL lista para usar en <img src>, o null si el producto no tiene imagen.
//  - URL absoluta (http/https, "//" o data:) → se usa tal cual (p. ej. enlaces de ImgBB).
//  - Ruta relativa ("img/x.png" o "/img/x.png") → se antepone BASE_URL sin duplicar la barra
//    (archivos de public/img).
export function resolveImageSrc(img) {
  if (typeof img !== "string") return null;
  const valor = img.trim();
  if (!valor) return null;
  if (/^(https?:)?\/\//i.test(valor) || valor.startsWith("data:")) return valor;
  return `${import.meta.env.BASE_URL}${valor.replace(/^\/+/, "")}`;
}
 