const API_URL = `${import.meta.env.VITE_API_URL ?? ""}/api/products`;

async function request(url, mensajeError) {
  let response;

  try {
    response = await fetch(url);
  } catch (networkError) {
    // fetch solo rechaza ante fallas de red (servidor caído, sin conexión).
    const error = new Error(
      "No se pudo conectar con el servidor. Revisá tu conexión e intentá de nuevo."
    );
    error.cause = networkError;
    throw error;
  }

  if (!response.ok) {
    // 400 (ID inválido) y 404 (no existe) significan lo mismo para el usuario.
    const noExiste = response.status === 400 || response.status === 404;
    const error = new Error(
      noExiste ? "El producto no existe o fue removido." : mensajeError
    );
    error.status = response.status;
    throw error;
  }

  return response.json();
}

/** GET /api/products → array con todos los productos. */
export function getProducts() {
  return request(API_URL, "No se pudieron cargar los productos.");
}

/** GET /api/products/:id → un producto (404 si no existe). */
export function getProductById(id) {
  return request(
    `${API_URL}/${encodeURIComponent(id)}`,
    "No se pudo cargar el producto."
  );
}