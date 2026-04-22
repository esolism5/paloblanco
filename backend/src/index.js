const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// RUTAS
const inversionistaRoutes = require("./routes/inversionista.routes");
const categoriaRoutes = require("./routes/categoria.routes");

// ✅ CORREGIDO
app.use("/api/inversionistas", inversionistaRoutes);
app.use("/api/categorias", categoriaRoutes);

// TEST
app.get("/", (req, res) => {
  res.send("API funcionando");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor corriendo en puerto", process.env.PORT || 3000);
});