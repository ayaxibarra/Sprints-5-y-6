import { useState } from "react";
import { Link } from "react-router-dom";
import { resolverImagen } from "../utils/imagen.js";

const FORM_VACIO = {
  nombre: "",
  descripcion: "",
  precio: "",
  stock: "0",
  imagenUrl: "",
};

// Convierte un producto de la API en valores de formulario (todo string)
function aFormulario(producto) {
  if (!producto) return FORM_VACIO;
  return {
    nombre: producto.nombre ?? "",
    descripcion: producto.descripcion ?? "",
    precio: String(producto.precio ?? ""),
    stock: String(producto.stock ?? 0),
    imagenUrl: producto.imagenUrl ?? "",
  };
}

// Mismas reglas que el schema de Mongoose
function validar(form) {
  const errores = {};
  const nombre = form.nombre.trim();

  if (!nombre) errores.nombre = "El nombre del producto es obligatorio.";
  else if (nombre.length < 2)
    errores.nombre = "El nombre debe tener al menos 2 caracteres.";
  else if (nombre.length > 100)
    errores.nombre = "El nombre no puede superar 100 caracteres.";

  if (form.descripcion.trim().length > 1000)
    errores.descripcion = "La descripción no puede superar 1000 caracteres.";

  const precio = Number(form.precio);
  if (form.precio === "") errores.precio = "El precio del producto es obligatorio.";
  else if (!Number.isFinite(precio))
    errores.precio = "El precio debe ser un número finito.";
  else if (precio < 0) errores.precio = "El precio no puede ser negativo.";

  const stock = Number(form.stock === "" ? 0 : form.stock);
  if (!Number.isInteger(stock)) errores.stock = "El stock debe ser un número entero.";
  else if (stock < 0) errores.stock = "El stock no puede ser negativo.";

  return errores;
}

/**
 * Formulario reutilizable para crear y editar.
 * - initialValues: producto existente (edición) o undefined (creación)
 * - onSubmit(payload): función async; si lanza un error, se muestra en el formulario
 */
export default function ProductForm({ initialValues, onSubmit, submitLabel }) {
  const [form, setForm] = useState(() => aFormulario(initialValues));
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState("");
  const [guardando, setGuardando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errores[name]) setErrores((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const erroresForm = validar(form);
    setErrores(erroresForm);
    if (Object.keys(erroresForm).length > 0) return;

    setGuardando(true);
    setErrorGeneral("");
    try {
      await onSubmit({
        nombre: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        precio: Number(form.precio),
        stock: Number(form.stock === "" ? 0 : form.stock),
        imagenUrl: form.imagenUrl.trim(),
      });
    } catch (err) {
      setErrorGeneral(err.message);
      setGuardando(false);
    }
  };

  const campo = (name) => (errores[name] ? "error-input" : "");

  return (
    <form className="admin-form" onSubmit={handleSubmit} noValidate>
      {errorGeneral && (
        <div className="admin-error" role="alert">
          {errorGeneral}
        </div>
      )}

      <div className="grupo-campo">
        <label htmlFor="nombre">Nombre *</label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          value={form.nombre}
          onChange={handleChange}
          className={campo("nombre")}
          maxLength={100}
        />
        {errores.nombre && <span className="error-mensaje">{errores.nombre}</span>}
      </div>

      <div className="grupo-campo">
        <label htmlFor="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          name="descripcion"
          rows={4}
          value={form.descripcion}
          onChange={handleChange}
          className={campo("descripcion")}
          maxLength={1000}
        />
        <small className="admin-contador">{form.descripcion.length}/1000</small>
        {errores.descripcion && (
          <span className="error-mensaje">{errores.descripcion}</span>
        )}
      </div>

      <div className="admin-fila">
        <div className="grupo-campo">
          <label htmlFor="precio">Precio *</label>
          <input
            id="precio"
            name="precio"
            type="number"
            min="0"
            step="0.01"
            value={form.precio}
            onChange={handleChange}
            className={campo("precio")}
          />
          {errores.precio && <span className="error-mensaje">{errores.precio}</span>}
        </div>

        <div className="grupo-campo">
          <label htmlFor="stock">Stock</label>
          <input
            id="stock"
            name="stock"
            type="number"
            min="0"
            step="1"
            value={form.stock}
            onChange={handleChange}
            className={campo("stock")}
          />
          {errores.stock && <span className="error-mensaje">{errores.stock}</span>}
        </div>
      </div>

      <div className="grupo-campo">
        <label htmlFor="imagenUrl">Imagen (ruta o URL)</label>
        <input
          id="imagenUrl"
          name="imagenUrl"
          type="text"
          placeholder="https://... o img/Nombre.png"
          value={form.imagenUrl}
          onChange={handleChange}
        />
        {form.imagenUrl.trim() && (
          <img
            className="admin-preview"
            src={resolverImagen(form.imagenUrl.trim())}
            alt="Vista previa"
            onError={(e) => (e.currentTarget.style.display = "none")}
            onLoad={(e) => (e.currentTarget.style.display = "block")}
          />
        )}
      </div>

      <div className="admin-form-acciones">
        <button type="submit" className="btn-primary" disabled={guardando}>
          {guardando ? "Guardando..." : submitLabel}
        </button>
        <Link to="/admin" className="btn-secondary">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
