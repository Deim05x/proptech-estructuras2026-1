import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

import LoginPage from "../pages/LoginPage";
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
import RotacionAsesoresPage from "../pages/RotacionAsesoresPage";
import InicioClientePage from "../pages/InicioClientePage";
import MisVisitasPage from "../pages/MisVisitasPage";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute rolesPermitidos={["ADMIN"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/clientes"
        element={
          <ProtectedRoute rolesPermitidos={["ADMIN"]}>
            <ClientesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/asesores"
        element={
          <ProtectedRoute rolesPermitidos={["ADMIN"]}>
            <AsesoresPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/rotacion-asesores"
        element={
          <ProtectedRoute rolesPermitidos={["ADMIN"]}>
            <RotacionAsesoresPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/operaciones"
        element={
          <ProtectedRoute rolesPermitidos={["ADMIN"]}>
            <OperacionesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/alertas"
        element={
          <ProtectedRoute rolesPermitidos={["ADMIN"]}>
            <AlertasPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/inmuebles"
        element={
          <ProtectedRoute rolesPermitidos={["ADMIN", "CLIENTE"]}>
            <InmueblesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/visitas"
        element={
          <ProtectedRoute rolesPermitidos={["ADMIN"]}>
            <VisitasPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/favoritos"
        element={
          <ProtectedRoute rolesPermitidos={["ADMIN", "CLIENTE"]}>
            <FavoritosPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/historial"
        element={
          <ProtectedRoute rolesPermitidos={["ADMIN", "CLIENTE"]}>
            <HistorialPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/carrusel-inmuebles"
        element={
          <ProtectedRoute rolesPermitidos={["ADMIN", "CLIENTE"]}>
            <CarruselInmueblesPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/inicio-cliente"
        element={
          <ProtectedRoute rolesPermitidos={["CLIENTE"]}>
            <InicioClientePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/mis-visitas"
        element={
          <ProtectedRoute rolesPermitidos={["CLIENTE"]}>
            <MisVisitasPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRouter;