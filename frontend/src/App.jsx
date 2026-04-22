import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Formulario from "./pages/Formulario";
import Detalle from "./pages/Detalle";

<Route path="/detalle/:id" element={<Detalle />} />
// aquí configuré navegación entre vistas
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/crear" element={<Formulario />} />
        <Route path="/editar/:id" element={<Formulario />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;