const mongoose = require("mongoose");

const connectDB = async () => {
  const { MONGODB_URI } = process.env;

  if (!MONGODB_URI) {
    throw new Error(
      "Falta la variable de entorno MONGODB_URI."
    );
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log(
      `MongoDB conectado correctamente: ${mongoose.connection.name}`
    );
  } catch (error) {
    console.error(
      "Error al conectar con MongoDB:",
      error.message
    );

    throw error;
  }
};

module.exports = connectDB;