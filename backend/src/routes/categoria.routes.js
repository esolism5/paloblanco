const express = require("express");
const router = express.Router();

const { getCategorias } = require("../controllers/categoria.controller");

router.get("/categorias", getCategorias);

module.exports = router;