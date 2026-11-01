import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getProducts, deleteProduct } from "../services/productService.js";
import { resolverImagen } from "../utils/imagen.js";

const formatoPrecio = (n) =>
  Number.isFinite(Number(n))
    ? new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(n)
    : "—";

export default function AdminProductos() {
  const location = useLocation();

  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorGeneral, setErrorGeneral] = useState("");
  const [mensajeExito, setMensajeExito] = useState(location.state?.mensaje ?? "");
  const [busqueda, setBusqueda] = useState("");
  const [confirmarId, setConfirmarId] = useState(null);

  useEffect(() => {
    getProducts()
      .then((data) => {
        // Acepta un array directo o { data: [...] } / { productos: [...] }
        const lista = Array.isArray(data) ? data : data?.data ?? data?.productos;
        setProductos(Array.isArray(lista) ? lista : []);
      })
      .catch((err) => setErrorGeneral(err.message))
      .finally(() => setCargando(false));
  }, []);

  // Limpia el mensaje que vino de crear/editar para que no reaparezca al recargar
  useEffect(() => {
    if (location.state?.mensaje) window.history.replaceState({}, "");
  }, [location.state]);

  // Oculta el mensaje de éxito a los 4 segundos
  useEffect(() => {
    if (!mensajeExito) return;
    const t = setTimeout(() => setMensajeExito(""), 4000);
    return () => clearTimeout(t);
  }, [mensajeExito]);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return productos;
    return productos.filter((p) => p.nombre?.toLowerCase().includes(q));
  }, [productos, busqueda]);

  const handleEliminar = async (id) => {
    setErrorGeneral("");
    try {
      await deleteProduct(id);
      setProductos((prev) => prev.filter((p) => p._id !== id));
      setMensajeExito("Producto eliminado correctamente.");
    } catch (err) {
      setErrorGeneral(err.message);
    } finally {
      setConfirmarId(null);
    }
  };

  return (
    <section className="admin-productos">
      <h1 className="seccion-titulo">Administrar productos</h1>
      <p className="admin-intro">
        Creá, modificá y eliminá los productos que se muestran en la tienda.
      </p>

      {mensajeExito && (
        <div className="mensaje-exito" role="status">
          <h3>¡Listo!</h3>
          <p>{mensajeExito}</p>
        </div>
      )}

      {errorGeneral && (
        <div className="admin-error" role="alert">
          {errorGeneral}
        </div>
      )}

      <div className="admin-listado">
        <div className="admin-listado-header">
          <h2 className="admin-form-titulo">Productos ({filtrados.length})</h2>
          <div className="admin-herramientas">
            <div className="search-box">
              <input
                type="search"
                placeholder="Buscar por nombre"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                aria-label="Buscar productos por nombre"
              />
            </div>
            <Link to="/admin/crear-producto" className="btn-primary admin-btn-nuevo">
              Nuevo producto
            </Link>
          </div>
        </div>

        {cargando ? (
          <p className="admin-vacio">Cargando productos...</p>
        ) : filtrados.length === 0 ? (
          <p className="admin-vacio">
            {productos.length === 0
              ? "Todavía no hay productos. Creá el primero con “Nuevo producto”."
              : "Ningún producto coincide con la búsqueda."}
          </p>
        ) : (
          <div className="admin-tabla-wrapper">
            <table className="admin-tabla">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((p) => (
                  <tr key={p._id}>
                    <td data-label="Imagen">
                      {p.imagenUrl ? (
                        <img className="admin-miniatura" src={resolverImagen(p.imagenUrl)} alt={p.nombre} />
                      ) : (
                        <span className="admin-sin-imagen">Sin imagen</span>
                      )}
                    </td>
                    <td data-label="Nombre">{p.nombre}</td>
                    <td data-label="Precio">{formatoPrecio(p.precio)}</td>
                    <td data-label="Stock">
                      <span className={!p.stock ? "admin-stock-agotado" : ""}>
                        {!p.stock ? "Agotado" : p.stock}
                      </span>
                    </td>
                    <td data-label="Acciones">
                      {confirmarId === p._id ? (
                        <div className="admin-acciones">
                          <span className="admin-confirmar">¿Eliminar?</span>
                          <button
                            className="admin-btn-peligro"
                            onClick={() => handleEliminar(p._id)}
                          >
                            Sí, eliminar
                          </button>
                          <button
                            className="admin-btn-mini"
                            onClick={() => setConfirmarId(null)}
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <div className="admin-acciones">
                          <Link
                            to={`/admin/${p._id}/editar`}
                            className="admin-btn-mini"
                          >
                            Editar
                          </Link>
                          <button
                            className="admin-btn-mini admin-btn-borrar"
                            onClick={() => setConfirmarId(p._id)}
                          >
                            Eliminar
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
