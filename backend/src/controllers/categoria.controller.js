const db = require("../config/db");

exports.getCategorias = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM categoria_inversion");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo categorías" });
  }
};