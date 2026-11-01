import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProductForm from "../components/ProductForm.jsx";
import { getProductById, updateProduct } from "../services/productService.js";

export default function EditProduct() {
  const { id } = useParams(); // /admin/productos/:id/editar
  const navigate = useNavigate();

  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelado = false;
    setCargando(true);
    setError("");

    getProductById(id)
      .then((data) => {
        if (!cancelado) setProducto(data);
      })
      .catch((err) => {
        if (!cancelado) setError(err.message);
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [id]);

  async function handleUpdate(payload) {
    await updateProduct(id, payload);
    navigate("/admin", {
      state: { mensaje: "Producto actualizado correctamente." },
    });
  }

  return (
    <section className="admin-productos">
      <h1 className="seccion-titulo">Editar producto</h1>

      {cargando && <p className="admin-vacio">Cargando producto...</p>}

      {!cargando && error && (
        <>
          <div className="admin-error" role="alert">{error}</div>
          <p className="admin-vacio">
            <Link to="/admin" className="btn-secondary">
              Volver al listado
            </Link>
          </p>
        </>
      )}

      {!cargando && producto && (
        <>
          <p className="admin-intro">
            Editando <strong>{producto.nombre}</strong>.{" "}
            <Link to={`/productos/${id}`}>Ver detalle público</Link>
          </p>
          <ProductForm
            initialValues={producto}
            onSubmit={handleUpdate}
            submitLabel="Guardar cambios"
          />
        </>
      )}
    </section>
  );
}
