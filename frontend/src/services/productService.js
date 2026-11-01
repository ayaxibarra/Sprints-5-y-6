// Capa única de comunicación entre React y la API REST de Express.
// El resto de la app trabaja con el formato del frontend (id, name, desc, price, stock, img);
// la traducción desde/hacia el esquema de MongoDB (_id, nombre, descripcion, precio, stock,
// imagenUrl) ocurre solo en este archivo.

const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");
const API_URL = `${API_BASE}/api/productos`;

const OBJECT_ID = /^[0-9a-fA-F]{24}$/;
const MSG_NO_EXISTE = "El producto no existe o fue removido.";
const MSG_RED =
  "No se pudo conectar con el servidor. Revisá tu conexión e intentá de nuevo.";
const MSG_INESPERADA =
  "El servidor devolvió una respuesta inesperada. Verificá que VITE_API_URL apunte al backend.";

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

const esAbort = (error) => error?.name === "AbortError";

// ---------- Adaptadores API <-> frontend ----------

function deApi(doc) {
  if (!doc || typeof doc !== "object" || !doc._id) {
    throw crearError(MSG_INESPERADA);
  }
  return {
    id: doc._id,
    name: doc.nombre,
    desc: doc.descripcion ?? "",
    price: doc.precio,
    stock: doc.stock,
    img: doc.imagenUrl ?? "",
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

// Solo envía los campos del contrato. Un stock/precio vacío ("") se omite para que
// el backend aplique su valor por defecto o informe el campo obligatorio.
function aApi(producto = {}) {
  const datos = {};
  if (producto.name !== undefined) datos.nombre = producto.name;
  if (producto.desc !== undefined) datos.descripcion = producto.desc;
  if (producto.price !== undefined && producto.price !== "") {
    datos.precio = Number(producto.price);
  }
  if (producto.stock !== undefined && producto.stock !== "") {
    datos.stock = Number(producto.stock);
  }
  if (producto.img !== undefined) datos.imagenUrl = producto.img;
  return datos;
}

// ---------- Manejo de errores HTTP ----------

function errorHttp(status, datos, { method, mensajeError, noExiste }) {
  const mensajeApi =
    typeof datos?.mensaje === "string"
      ? datos.mensaje.replace(/^Product validation failed:\s*/i, "")
      : null;

  if (status === 404) {
    return crearError(noExiste ?? mensajeError, { status });
  }

  // Altas y ediciones: un 400 es una validación; se muestra el motivo del backend.
  if (status === 400 && method !== "GET") {
    return crearError(mensajeApi ?? mensajeError, { status });
  }

  // El backend actual responde 400 también ante fallos internos. En lecturas con un id
  // ya validado, un 400 no puede ser culpa del usuario, así que se permite reintentar.
  const reintentable = status >= 500 || (status === 400 && method === "GET");
  return crearError(mensajeError, { status, reintentable });
}

// ---------- Petición base ----------

async function request(path, { method = "GET", body, signal, mensajeError, noExiste } = {}) {
  const tieneBody = body !== undefined;
  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: tieneBody
        ? { "Content-Type": "application/json", Accept: "application/json" }
        : { Accept: "application/json" },
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
    throw crearError(MSG_INESPERADA, { status: response.status });
  }

  return datos ?? null; // null cuando la respuesta no trae contenido (p. ej. 204)
}

// Evita pedir a la API un id con formato inválido (ObjectId de MongoDB, 24 hex).
function validarId(id) {
  if (typeof id !== "string" || !OBJECT_ID.test(id)) {
    throw crearError(MSG_NO_EXISTE, { status: 404 });
  }
}

// ---------- Operaciones públicas ----------

/** GET /api/productos → array de productos en formato frontend. */
export async function getProducts({ signal } = {}) {
  const datos = await request("", {
    signal,
    mensajeError: "No se pudieron cargar los productos.",
  });
  if (!Array.isArray(datos)) throw crearError(MSG_INESPERADA);
  return datos.map(deApi);
}

/** GET /api/productos/:id → un producto. */
export async function getProductById(id, { signal } = {}) {
  validarId(id);
  const datos = await request(`/${encodeURIComponent(id)}`, {
    signal,
    mensajeError: "No se pudo cargar el producto.",
    noExiste: MSG_NO_EXISTE,
  });
  return deApi(datos);
}

/** POST /api/productos. Recibe { name, desc, price, stock, img }; devuelve el producto creado. */
export async function createProduct(producto, { signal } = {}) {
  const datos = await request("", {
    method: "POST",
    body: aApi(producto),
    signal,
    mensajeError: "No se pudo crear el producto.",
  });
  return deApi(datos?.producto);
}

/** PUT /api/productos/:id. Acepta campos parciales; devuelve el producto actualizado. */
export async function updateProduct(id, producto, { signal } = {}) {
  validarId(id);
  const datos = await request(`/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: aApi(producto),
    signal,
    mensajeError: "No se pudo actualizar el producto.",
    noExiste: MSG_NO_EXISTE,
  });
  return deApi(datos?.producto);
}

/** DELETE /api/productos/:id. Devuelve el producto eliminado, o null si no hay cuerpo. */
export async function deleteProduct(id, { signal } = {}) {
  validarId(id);
  const datos = await request(`/${encodeURIComponent(id)}`, {
    method: "DELETE",
    signal,
    mensajeError: "No se pudo eliminar el producto.",
    noExiste: MSG_NO_EXISTE,
  });
  return datos?.producto ? deApi(datos.producto) : null;
}