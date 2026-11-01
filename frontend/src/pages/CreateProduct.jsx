import { useNavigate } from "react-router-dom";
import ProductForm from "../components/ProductForm.jsx";
import { createProduct } from "../services/productService.js";

export default function CreateProduct() {
  const navigate = useNavigate();

  async function handleCreate(payload) {
    await createProduct(payload);
    navigate("/admin", {
      state: { mensaje: "Producto creado correctamente." },
    });
  }

  return (
    <section className="admin-productos">
      <h1 className="seccion-titulo">Nuevo producto</h1>
      <p className="admin-intro">Completá los datos para sumarlo al catálogo.</p>
      <ProductForm onSubmit={handleCreate} submitLabel="Crear producto" />
    </section>
  );
}
