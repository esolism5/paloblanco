import { useEffect, useState } from "react";
import { api } from "../services/api";
import { useNavigate, useParams } from "react-router-dom";

export default function Detalle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  // =========================
  // CARGAR DATOS
  // =========================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/inversionistas/${id}`);

        // Soporta APIs que devuelven { data: {...} } o directamente {...}
        const payload = res.data?.data ?? res.data;

        // Log para depurar (puedes quitarlo luego)
        console.log("DETALLE:", payload);

        setData(payload);
      } catch (error) {
        console.error("Error cargando detalle", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // =========================
  // CAMBIAR ESTADO
  // =========================
  const cambiarEstado = async () => {
    if (!data) return;

    const confirmacion = window.confirm("¿Seguro que deseas cambiar el estado?");
    if (!confirmacion) return;

    try {
      const nuevoEstado =
        (data.estado || "").toLowerCase() === "activo" ? "inactivo" : "activo";

      await api.put(`/inversionistas/${id}`, {
        estado: nuevoEstado
      });

      // actualizar UI
      setData(prev => ({
        ...prev,
        estado: nuevoEstado
      }));

      alert("Estado actualizado");
    } catch (error) {
      console.error("Error cambiando estado", error);
      alert("No se pudo cambiar el estado");
    }
  };

  // =========================
  // COLOR POR NIVEL
  // =========================
  const getNivelColor = (nivel) => {
    switch ((nivel || "").toLowerCase()) {
      case "alto": return "green";
      case "medio": return "orange";
      case "bajo": return "red";
      default: return "gray";
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Cargando...</p>;
  if (!data) return <p style={{ padding: 20 }}>No encontrado</p>;

  return (
    <div style={{ padding: 20 }}>
      {/* VOLVER */}
      <button onClick={() => navigate("/")} style={{ marginBottom: 10 }}>
        ← Volver
      </button>

      <h2>Detalle del Inversionista</h2>

      <p><b>Nombre:</b> {data.nombre || "-"} {data.apellido || ""}</p>
      <p><b>Email:</b> {data.email || "-"}</p>

      <p>
        <b>Inversión:</b>{" "}
        {data.inversion != null
          ? `Q ${Number(data.inversion).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
          : "-"}
      </p>

      <p><b>Categoría:</b> {data.categoria_nombre || data.categoria_id || "-"}</p>
      <p><b>Estado:</b> {data.estado || "-"}</p>

      <p>
        <b>Nivel:</b>{" "}
        <span
          style={{
            padding: "5px 10px",
            borderRadius: 8,
            backgroundColor: getNivelColor(data.nivel),
            color: "white"
          }}
        >
          {data.nivel || "N/A"}
        </span>
      </p>

      <br />

      {/* BOTÓN CAMBIO ESTADO */}
      <button onClick={cambiarEstado}>
        Cambiar a {(data.estado || "").toLowerCase() === "activo" ? "inactivo" : "activo"}
      </button>

      {/* BOTÓN EDITAR */}
      <button
        onClick={() => navigate(`/editar/${id}`)}
        style={{ marginLeft: 10 }}
      >
        Editar
      </button>
    </div>
  );
}