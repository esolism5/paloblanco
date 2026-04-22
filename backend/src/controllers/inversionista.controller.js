const db = require("../config/db");

// =========================
// GET /api/inversionistas
// Soporta filtros y paginación
// =========================
exports.getInversionistas = async (req, res) => {
  try {
    const {
      categoria_id,
      min,
      max,
      order = "ASC",
      page = 1,
      limit = 5
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    let where = [];
    let params = [];

    if (categoria_id) {
      where.push("i.categoria_id = ?");
      params.push(categoria_id);
    }

    if (min) {
      where.push("i.inversion >= ?");
      params.push(min);
    }

    if (max) {
      where.push("i.inversion <= ?");
      params.push(max);
    }

    const whereSQL = where.length ? `WHERE ${where.join(" AND ")}` : "";

    // 🔥 TOTAL PARA PAGINACIÓN
    const [countRows] = await db.query(
      `SELECT COUNT(*) as total FROM inversionista i ${whereSQL}`,
      params
    );

    const total = countRows[0].total;
    const totalPages = Math.ceil(total / limit);

    // 🔥 QUERY PRINCIPAL
    const [rows] = await db.query(
      `
      SELECT 
        i.*,
        c.nombre as categoria_nombre,
        CASE 
          WHEN i.inversion >= 20000 THEN 'alto'
          WHEN i.inversion >= 10000 THEN 'medio'
          ELSE 'bajo'
        END as nivel
      FROM inversionista i
      LEFT JOIN categoria_inversion c ON c.id = i.categoria_id
      ${whereSQL}
      ORDER BY i.inversion ${order}
      LIMIT ? OFFSET ?
      `,
      [...params, parseInt(limit), offset]
    );

    res.json({
      data: rows,
      totalPages
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo inversionistas" });
  }
};

// =========================
// GET /api/inversionistas/:id
// =========================
exports.getInversionista = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `
      SELECT 
        i.*,
        c.nombre as categoria_nombre,
        CASE 
          WHEN i.inversion >= 20000 THEN 'alto'
          WHEN i.inversion >= 10000 THEN 'medio'
          ELSE 'bajo'
        END as nivel
      FROM inversionista i
      LEFT JOIN categoria_inversion c ON c.id = i.categoria_id
      WHERE i.id = ?
      `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "No encontrado" });
    }

    res.json(rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error" });
  }
};

// =========================
// POST /api/inversionistas
// =========================
exports.createInversionista = async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      email,
      inversion,
      categoria_id
    } = req.body;

    await db.query(
      `
      INSERT INTO inversionista 
      (nombre, apellido, email, inversion, categoria_id, estado)
      VALUES (?, ?, ?, ?, ?, 'activo')
      `,
      [nombre, apellido, email, inversion, categoria_id]
    );

    res.json({ message: "Creado correctamente" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear" });
  }
};

// =========================
// PUT /api/inversionistas/:id
// Permite actualizar TODO o solo estado
// =========================
exports.updateInversionista = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      nombre,
      apellido,
      email,
      inversion,
      categoria_id,
      estado
    } = req.body;

    // 🔥 SOLO CAMBIO DE ESTADO
    if (estado && !nombre) {
      await db.query(
        "UPDATE inversionista SET estado = ? WHERE id = ?",
        [estado, id]
      );

      return res.json({ message: "Estado actualizado" });
    }

    // 🔥 UPDATE COMPLETO
    await db.query(
      `
      UPDATE inversionista 
      SET nombre = ?, apellido = ?, email = ?, inversion = ?, categoria_id = ?, estado = ?
      WHERE id = ?
      `,
      [
        nombre,
        apellido,
        email,
        inversion,
        categoria_id,
        estado || "activo",
        id
      ]
    );

    res.json({ message: "Actualizado correctamente" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar" });
  }
};

// =========================
// DELETE /api/inversionistas/:id
// =========================
exports.deleteInversionista = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      "DELETE FROM inversionista WHERE id = ?",
      [id]
    );

    res.json({ message: "Eliminado correctamente" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar" });
  }
};