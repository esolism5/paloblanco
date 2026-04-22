// aquí hice el modelo correcto para obtener categorías
const db = require("../config/db");

exports.getAll = (callback) => {
  const query = "SELECT * FROM categoria_inversion";

  db.query(query, callback);
};