require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const connectDB = require("./config/db");
const productoRoutes = require("./routes/productoRoutes");

const app = express();
const PORT = process.env.PORT || 3000;
const FRONT = process.env.FRONTEND_URL

app.use(cors());
app.use(cors({ origin: FRONT }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
  });
});

app.use("/api/productos", productoRoutes);

app.use((error, req, res, _next) => {
  const status = error.status || 500;
  res.status(status).json({
    mensaje: error.message || "Error interno del servidor",
  });
});

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("No se pudo iniciar el servidor:", error.message);
  process.exit(1);
});