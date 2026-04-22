import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import "../styles/dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [filters, setFilters] = useState({
    categoria_id: "",
    min: "",
    max: ""
  });

  // =========================
  // CARGAR DATOS CON FILTROS
  // =========================
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get("/inversionistas", {
          params: filters
        });

        if (Array.isArray(res.data)) {
          setData(res.data);
        } else {
          setData(res.data.data || []);
        }

      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, [filters]);

  // =========================
  // CARGAR CATEGORÍAS
  // =========================
  useEffect(() => {
    async function fetchCategorias() {
      try {
        const res = await api.get("/categorias");
        setCategorias(res.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchCategorias();
  }, []);

  // =========================
  // CAMBIAR ESTADO
  // =========================
  async function cambiarEstado(item) {
    try {
      const nuevoEstado =
        item.estado === "activo" ? "inactivo" : "activo";

      const confirmacion = window.confirm(
        "¿Cambiar estado a " + nuevoEstado + "?"
      );

      if (!confirmacion) return;

      await api.put("/inversionistas/" + item.id, {
        estado: nuevoEstado
      });

      setData(function (prev) {
        return prev.map(function (i) {
          if (i.id === item.id) {
            return {
              ...i,
              estado: nuevoEstado
            };
          }
          return i;
        });
      });

    } catch (error) {
      console.error(error);
      alert("Error al cambiar estado");
    }
  }

  return (
    <div className="layout">

      <div className="sidebar">
        <h1>Inversiones</h1>
        <a href="#">Dashboard</a>
      </div>

      <div className="main">

        <div className="topbar">
          <h2>Dashboard de Inversionistas</h2>

          <button
            className="btn btn-primary"
            onClick={() => navigate("/crear")}
          >
            Nuevo
          </button>
        </div>

        <div className="card">

          <div className="filters">

            <select
              value={filters.categoria_id}
              onChange={(e) => {
                setFilters({
                  ...filters,
                  categoria_id: e.target.value
                });
              }}
            >
              <option value="">Todas</option>
              {categorias.map(function (c) {
                return (
                  <option key={c.id} value={c.id}>
                    {c.nombre}
                  </option>
                );
              })}
            </select>

            <input
              placeholder="Min"
              value={filters.min}
              onChange={(e) => {
                setFilters({
                  ...filters,
                  min: e.target.value
                });
              }}
            />

            <input
              placeholder="Max"
              value={filters.max}
              onChange={(e) => {
                setFilters({
                  ...filters,
                  max: e.target.value
                });
              }}
            />

          </div>

          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Inversión</th>
                <th>Categoría</th>
                <th>Nivel</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {data.map(function (i) {
                return (
                  <tr key={i.id}>
                    <td>{i.nombre} {i.apellido}</td>
                    <td>{i.email}</td>
                    <td>Q {i.inversion}</td>
                    <td>{i.categoria_nombre}</td>

                    <td>
  <span className={"nivel-badge " + (i.nivel || "").toLowerCase()}>
    {i.nivel}
  </span>
</td>
                    <td>
                      <span className={"badge " + i.estado}>
                        {i.estado}
                      </span>
                    </td>

                    <td style={{ display: "flex", gap: "6px" }}>
                      <button
                        className="btn btn-primary"
                        onClick={() => navigate("/editar/" + i.id)}
                      >
                        Editar
                      </button>

                      <button
                        className="btn btn-danger"
                        onClick={() => cambiarEstado(i)}
                      >
                        Cambiar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

        </div>
      </div>
    </div>
  );
}