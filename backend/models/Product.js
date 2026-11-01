const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre del producto es obligatorio."],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres."],
      maxlength: [100, "El nombre no puede superar 100 caracteres."],
    },

    descripcion: {
      type: String,
      trim: true,
      default: "",
      maxlength: [
        1000,
        "La descripción no puede superar 1000 caracteres.",
      ],
    },

    precio: {
      type: Number,
      required: [true, "El precio del producto es obligatorio."],
      min: [0, "El precio no puede ser negativo."],
      validate: {
        validator: Number.isFinite,
        message: "El precio debe ser un número finito.",
      },
    },

    stock: {
      type: Number,
      default: 0,
      min: [0, "El stock no puede ser negativo."],
      validate: {
        validator: Number.isInteger,
        message: "El stock debe ser un número entero.",
      },
    },

    imagenUrl: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Product", productSchema);