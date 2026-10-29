const express = require("express");
const router = express.Router();

const {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
} = require("../controllers/productoController");

router.get("/", getProductos);
router.get("/:id", getProductoById);
router.post("/", createProducto);
router.put("/:id", updateProducto);
router.delete("/:id", deleteProducto);

module.exports = router;
