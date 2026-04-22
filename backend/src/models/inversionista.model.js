// aquí mejoré las consultas para soportar filtros, ordenamiento y estructura más completa
const db = require("../config/db");

// obtener todos con filtros
exports.getAll = (filters, callback) => {
  let query = `
    SELECT i.*, c.nombre as categoria
    FROM inversionista i
    LEFT JOIN categoria_inversion c ON c.id = i.categoria_id
    WHERE 1=1
  `;

  const params = [];

  // filtro por categoría
  if (filters.categoria_id) {
    query += " AND i.categoria_id = ?";
    params.push(filters.categoria_id);
  }

  // filtro mínimo
  if (filters.min) {
    query += " AND i.inversion >= ?";
    params.push(filters.min);
  }

  // filtro máximo
  if (filters.max) {
    query += " AND i.inversion <= ?";
    params.push(filters.max);
  }

  // ordenamiento
  if (filters.order && (filters.order === "ASC" || filters.order === "DESC")) {
    query += ` ORDER BY i.inversion ${filters.order}`;
  }

  db.query(query, params, callback);
};

// obtener por ID
exports.getById = (id, callback) => {
  db.query(
    `
    SELECT i.*, c.nombre as categoria
    FROM inversionista i
    LEFT JOIN categoria_inversion c ON c.id = i.categoria_id
    WHERE i.id = ?
    `,
    [id],
    callback
  );
};

// crear inversionista
exports.create = (data, callback) => {
  const query = `
    INSERT INTO inversionista 
    (nombre, apellido, email, inversion, categoria_id, estado)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      data.nombre,
      data.apellido,
      data.email,
      data.inversion,
      data.categoria_id,
      data.estado || "activo"
    ],
    callback
  );
};

// actualizar inversionista
exports.update = (id, data, callback) => {
  const query = `
    UPDATE inversionista 
    SET nombre = ?, apellido = ?, email = ?, inversion = ?, categoria_id = ?
    WHERE id = ?
  `;

  db.query(
    query,
    [
      data.nombre,
      data.apellido,
      data.email,
      data.inversion,
      data.categoria_id,
      id
    ],
    callback
  );
};

// cambiar estado (extra para sumar puntos)
exports.changeStatus = (id, estado, callback) => {
  db.query(
    "UPDATE inversionista SET estado = ? WHERE id = ?",
    [estado, id],
    callback
  );
};