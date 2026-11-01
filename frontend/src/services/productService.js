// Servicio único de comunicación con la API REST de Express (/api/productos).
// Devuelve los documentos tal como los entrega la API (_id, nombre, descripcion, precio,
// stock, imagenUrl). Las pantallas de administración trabajan con esos nombres; las
// pantallas públicas (catálogo, detalle, inicio, carrito) los traducen con aVistaPublica
// (utils/producto.js), que aplican los hooks useProducts y useProduct.

const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");
const API_URL = `${API_BASE}/api/productos`;

const OBJECT_ID = /^[0-9a-fA-F]{24}$/;
const JSON_HEADERS = { "Content-Type": "application/json" };
 
const MSG_NO_EXISTE = "El producto no existe o fue removido.";
const MSG_RED =
  "No se pudo conectar con el servidor. Revisá tu conexión e intentá de nuevo.";
const MSG_INESPERADA =
  "El servidor no devolvió datos válidos. Revisá que VITE_API_URL apunte a tu API.";

/**
 * Error normalizado:
 *  - status: código HTTP real (undefined si no hubo respuesta).
 *  - reintentable: true si tiene sentido ofrecer "Reintentar".
 */
function crearError(message, { status, reintentable = false, cause } = {}) {
  const error = new Error(message);
  error.status = status;
  error.reintentable = reintentable;
  if (cause) error.cause = cause;
  return error;
}
    
  const esAbort = (error) => error.name === "AbortError";

    /** Extrae el mensaje que devuelve el backend */
function mensajeDelBackend(datos) {
  if (!datos || typeof datos !== "object") return null;
  if (Array.isArray(datos.errors)) {
      return datos.errors.map((e) => e.message || e.msg || e).join(" ");
  }

  const mensaje = datos.mensaje ?? datos.message ?? datos.error ?? null;
  return typeof mensaje === "string"
    ? mensaje.replace(/^Product validation failed:\s*/i, "")
    : null;
}



function errorHttp(status, datos, { method, mensajeError, noExiste }) {
  if (status === 404) {
    return crearError(noExiste ?? mensajeError, { status});
  }

  // Alta y edición: un 400 es una validación; se muestra el motivo del backend.
  if (status === 400 && (method === "POST" || method === "PUT")) {
    return crearError(mensajeDelBackend(datos) || mensajeError, { status });
  }

  // El backend actual responde 400 también ante fallos internos. En lecturas con un id
  // ya validado, un 400 no puede ser culpa del usuario, así que se permite reintentar.
  const reintentable = status >= 500 || (status === 400 && method === "GET");
  return crearError(mensajeError, { status, reintentable });

}

async function request(path, { method = "GET", body, signal, mensajeError, noExiste } = {}) {
  const tieneBody = body !== undefined;
  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: tieneBody ? JSON_HEADERS : undefined,
      body: tieneBody ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (networkError) {
    if (esAbort(networkError)) throw networkError;
    throw crearError(MSG_RED, { reintentable: true, cause: networkError });
  }

  let texto;
  try {
    texto = await response.text();
  } catch (lecturaError) {
    if (esAbort(lecturaError)) throw lecturaError;
    throw crearError(mensajeError, {
      status: response.status,
      reintentable: true,
      cause: lecturaError,
    });
  }

  let datos;
  if (texto) {
    try {
      datos = JSON.parse(texto);
    } catch {
      datos = undefined; // el cuerpo no es JSON (por ejemplo, HTML)
    }
  }

  if (!response.ok) {
    throw errorHttp(response.status, datos, { method, mensajeError, noExiste });
  }


   if (texto && datos === undefined) {
    throw crearError(MSG_INESPERADA, {status: response.status});
  
  }

    return datos ?? null; // null si no hay contenido (p. ej. 204)
  }  

  // Evita pedir a la API un id con formato inválido (ObjectId de MongoDB, 24 hex).
function validarId(id) {
  if (typeof id !== "string" || !OBJECT_ID.test(id)) {
    throw crearError(MSG_NO_EXISTE, { status: 404 });

  }
}

const desempaquetar = (datos) => datos?.producto ?? datos ?? null;

/** GET /api/productos → array con todos los productos. */
export async function getProducts({ signal } = {}) {
  const datos = await request("", {
    signal,
    mensajeError: "No se pudieron cargar los productos.",
  });
  if (!Array.isArray(datos)) throw crearError(MSG_INESPERADA);
  return datos;
}

/** GET /api/productos/:id → un producto (404 si no existe). */
export async function getProductById(id, {signal} = {}) {
  validarId(id);
  const datos = await request(`/${encodeURIComponent(id)}`, {
    signal,
    mensajeError: "No se pudo cargar el producto.",
    noExiste: MSG_NO_EXISTE,
  });
  if (!datos || typeof datos !== "object" || !datos._id) {
    throw crearError(MSG_INESPERADA);
  }
  return datos;

}

/** POST /api/productos → Recibe { nombre, descripcion, precio, stock, imagenUrl }; devuelve el producto creado. */
export async function createProduct(product, { signal } = {}) {
  const datos = await request("", {
    method: "POST",

    body: product,
    signal,
    mensajeError: "No se pudo crear el producto.",
  });
  
  return desempaquetar(datos);
}

/** PUT /api/products/:id → actualiza un producto y lo devuelve. */
export async function updateProduct(id, product, { signal } = {}) {
  validarId(id);
  const datos = await request(`/${encodeURIComponent(id)}`,{
    
      method: "PUT",
      signal,
      body: product,
      mensajeError: "No se pudo actualizar el producto.",
      noExiste: MSG_NO_EXISTE,
    });
    return desempaquetar(datos);
}

/** DELETE /api/products/:id → elimina un producto. */
export async function deleteProduct(id, { signal } = {}) {
  validarId(id);
  const datos = await request(`/${encodeURIComponent(id)}`, {
    method: "DELETE",
    signal,
    mensajeError: "No se pudo eliminar el producto.",
    noExiste: MSG_NO_EXISTE,
  });
  return desempaquetar(datos);
}