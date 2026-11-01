export function resolverImagen(ruta) {
  if (!ruta) return "";
  if (/^(https?:|data:|\/)/.test(ruta)) return ruta;
  return `/${ruta}`;
}