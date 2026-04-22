import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../services/api";
import "../styles/dashboard.css";

export default function Formulario() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [categorias, setCategorias] = useState([]);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    inversion: "",
    categoria_id: ""
  });

  // =========================
  // CARGAR CATEGORÍAS
  // =========================
  useEffect(() => {
    api.get("/categorias")
      .then(res => setCategorias(res.data))
      .catch(err => console.error(err));
  }, []);

  // =========================
  // PRECARGAR DATOS (EDITAR)
  // =========================
  useEffect(() => {
    if (id) {
      api.get(`/inversionistas/${id}`)
        .then(res => {
          setForm({
            nombre: res.data.nombre || "",
            apellido: res.data.apellido || "",
            email: res.data.email || "",
            inversion: res.data.inversion || "",
            categoria_id: res.data.categoria_id || ""
          });
        })
        .catch(err => console.error(err));
    }
  }, [id]);

  // =========================
  // VALIDACIÓN
  // =========================
  const validate = () => {
    let err = {};

    if (!form.nombre) err.nombre = "Nombre requerido";
    if (!form.apellido) err.apellido = "Apellido requerido";

    if (!form.email) {
      err.email = "Email requerido";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      err.email = "Email inválido";
    }

    if (!form.inversion || form.inversion <= 0) {
      err.inversion = "Debe ser mayor a 0";
    }

    if (!form.categoria_id) {
      err.categoria_id = "Seleccione una categoría";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  // =========================
  // GUARDAR
  // =========================
  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      console.log("DATA ENVIADA:", form);

      if (id) {
        await api.put(`/inversionistas/${id}`, form);
      } else {
        await api.post("/inversionistas", form);
      }

      alert("Guardado correctamente");
      navigate("/");

    } catch (error) {
  console.log("ERROR COMPLETO:", error);
  console.log("ERROR BACKEND:", error.response?.data);
  console.log("STATUS:", error.response?.status);

  alert("Error al guardar");
}
  };

  return (
    <div className="main">

      <button
        className="btn btn-secondary back-btn"
        onClick={() => navigate("/")}
      >
        ← Volver al Dashboard
      </button>

      <div className="form-container">

        <div className="form-card">
          <h2>{id ? "Editar" : "Crear"} Inversionista</h2>

          {/* NOMBRE */}
          <input
            placeholder="Nombre"
            value={form.nombre}
            onChange={e =>
              setForm({ ...form, nombre: e.target.value })
            }
          />
          <small style={{ color: "red" }}>{errors.nombre}</small>

          {/* APELLIDO */}
          <input
            placeholder="Apellido"
            value={form.apellido}
            onChange={e =>
              setForm({ ...form, apellido: e.target.value })
            }
          />
          <small style={{ color: "red" }}>{errors.apellido}</small>

          {/* EMAIL */}
          <input
            placeholder="Email"
            value={form.email}
            onChange={e =>
              setForm({ ...form, email: e.target.value })
            }
          />
          <small style={{ color: "red" }}>{errors.email}</small>

          {/* INVERSIÓN */}
          <input
            type="number"
            placeholder="Inversión"
            value={form.inversion}
            onChange={e =>
              setForm({ ...form, inversion: e.target.value })
            }
          />
          <small style={{ color: "red" }}>{errors.inversion}</small>

          {/* CATEGORÍA */}
          <select
            value={form.categoria_id}
            onChange={e =>
              setForm({
                ...form,
                categoria_id: parseInt(e.target.value)
              })
            }
          >
            <option value="">Seleccione categoría</option>
            {categorias.map(c => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
          <small style={{ color: "red" }}>{errors.categoria_id}</small>

          <button onClick={handleSubmit}>
            {id ? "Actualizar" : "Guardar"}
          </button>

        </div>
      </div>
    </div>
  );
}