const API_URL = `${import.meta.env.VITE_API_URL ?? ""}/api/productos`;
const UPLOAD_URL = `${import.meta.env.VITE_API_URL ?? ""}/api/upload`;

/**
 * Intenta leer el mensaje de error que devuelve el backend
 * (validaciones de Mongoose, etc.). Si no hay, devuelve null.
 */
async function leerMensajeBackend(response) {
  try {
    const data = await response.json();
    if (Array.isArray(data.errors)) {
      return data.errors.map((e) => e.message || e.msg || e).join(" ");
    }
    return data.message || data.error || data.mensaje || null;
  } catch {
    return null; // respuesta sin JSON
  }
}

async function request(url, mensajeError, options = {}) {
  let response;

  try {
    response = await fetch(url, options);
  } catch (networkError) {
    // fetch solo rechaza ante fallas de red (servidor caído, sin conexión).
    const error = new Error(
      "No se pudo conectar con el servidor. Revisá tu conexión e intentá de nuevo."
    );
    error.cause = networkError;
    throw error;
  }

  if (!response.ok) {
    // 400 (ID inválido) y 404 (no existe) significan lo mismo para el usuario,
    // salvo al crear/actualizar, donde un 400 suele ser un error de validación.
    const esEscritura = options.method === "POST" || options.method === "PUT";
    const noExiste =
      response.status === 404 || (response.status === 400 && !esEscritura);

    let mensaje = mensajeError;
    if (noExiste) {
      mensaje = "El producto no existe o fue removido.";
    } else if (esEscritura && response.status === 400) {
      mensaje = (await leerMensajeBackend(response)) || mensajeError;
    }

    const error = new Error(mensaje);
    error.status = response.status;
    throw error;
  }

  // DELETE puede responder 204 o un cuerpo que no es JSON
  if (response.status === 204) return null;
  if (options.method === "DELETE") return response.json().catch(() => null);

  try {
    return await response.json();
  } catch (parseError) {
    // Pasa cuando la URL no apunta a tu API (ej: falta VITE_API_URL y el
    // servidor de Vite devuelve el index.html en lugar de JSON).
    const error = new Error(
      "El servidor no devolvió datos válidos. Revisá que VITE_API_URL apunte a tu API."
    );
    error.cause = parseError;
    throw error;
  }
}

const JSON_HEADERS = { "Content-Type": "application/json" };

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

/** POST /api/products → crea un producto y lo devuelve. */
export function createProduct(product) {
  return request(API_URL, "No se pudo crear el producto.", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(product),
  });
}

/** PUT /api/products/:id → actualiza un producto y lo devuelve. */
export function updateProduct(id, product) {
  return request(
    `${API_URL}/${encodeURIComponent(id)}`,
    "No se pudo actualizar el producto.",
    {
      method: "PUT",
      headers: JSON_HEADERS,
      body: JSON.stringify(product),
    }
  );
}

/** DELETE /api/products/:id → elimina un producto. */
export function deleteProduct(id) {
  return request(
    `${API_URL}/${encodeURIComponent(id)}`,
    "No se pudo eliminar el producto.",
    { method: "DELETE" }
  );
}