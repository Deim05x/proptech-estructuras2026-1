import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import InmueblesPage from "../pages/InmueblesPage";
import ClientesPage from "../pages/ClientesPage";
import AsesoresPage from "../pages/AsesoresPage";
import VisitasPage from "../pages/VisitasPage";
import AlertasPage from "../pages/AlertasPage";
import OperacionesPage from "../pages/OperacionesPage";
import FavoritosPage from "../pages/FavoritosPage";
import HistorialPage from "../pages/HistorialPage";
import CarruselInmueblesPage from "../pages/CarruselInmueblesPage";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/inmuebles" element={<InmueblesPage />} />
      <Route path="/clientes" element={<ClientesPage />} />
      <Route path="/asesores" element={<AsesoresPage />} />
      <Route path="/visitas" element={<VisitasPage />} />
      <Route path="/alertas" element={<AlertasPage />} />
      <Route path="/operaciones" element={<OperacionesPage />} />
      <Route path="/favoritos" element={<FavoritosPage />} />
      <Route path="/historial" element={<HistorialPage />} />
      <Route path="/carrusel-inmuebles" element={<CarruselInmueblesPage />} />
    </Routes>
  );
}

export default AppRouter;