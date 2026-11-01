
import { useState } from "react";
import { createProduct } from "../services/productService.js";

export default function CreateProduct() {
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setMensaje("");
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    const producto = {
      name: formData.get("name").trim(),
      desc: formData.get("desc").trim(),
      price: Number(formData.get("price")),
      stock: Number(formData.get("stock")),
      img: formData.get("img").trim(),
    };

    try {
      await createProduct(producto);

      setMensaje("Producto creado correctamente.");
      form.reset();
    } catch (err) {
      setError(err.message || "No se pudo crear el producto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      style={{
        maxWidth: "700px",
        margin: "0 auto",
        padding: "3rem 1.25rem",
      }}
    >
      <h1 className="seccion-titulo">Alta de Producto</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <label>
          Nombre del producto
          <input
            type="text"
            name="name"
            required
            minLength={2}
            maxLength={100}
            placeholder="Ej: Mesa de comedor"
          />
        </label>

        <label>
          Descripción
          <textarea
            name="desc"
            maxLength={1000}
            placeholder="Descripción del producto"
            rows={4}
          />
        </label>

        <label>
          Precio
          <input
            type="number"
            name="price"
            required
            min="0"
            step="0.01"
            placeholder="Ej: 150000"
          />
        </label>

        <label>
          Stock disponible
          <input
            type="number"
            name="stock"
            min="0"
            step="1"
            defaultValue="0"
            required
          />
        </label>
        {/* Acepta una URL (p. ej. enlace directo de ImgBB) o una ruta de public/img. */}
        <label>
          Imagen (URL de la imagen
          <input
            type="url"
            name="img"
            placeholder="https://i.ibb.co/4gDsR3Zy/Escritorio-Costa.png  o  img/Escritorio Costa.png"
            aria-describedby="ayuda-imagen"
          />
          <small id="ayuda-imagen">
            Opcional. Usá el enlace directo de la imagen (https://...) o la ruta de un
            archivo de public/img, sin barra inicial (por ejemplo: img/Mesa.png).
          </small>
        </label>

        {mensaje && (
          <p role="status" style={{ color: "green" }}>
            {mensaje}
          </p>
        )}

        {error && (
          <p role="alert" style={{ color: "red" }}>
            {error}
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Creando producto..." : "Crear producto"}
        </button>
      </form>
    </section>
  );
}
