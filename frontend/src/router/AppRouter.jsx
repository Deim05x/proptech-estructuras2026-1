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
import RecomendacionesPage from "../pages/RecomendacionesPage";
import ReportesPage from "../pages/ReportesPage";
import DescubrirInmueblesPage from "../pages/DescubrirInmueblesPage";
import MiActividadPage from "../pages/MiActividadPage";
import AsesoresModuloPage from "../pages/AsesoresModuloPage";
import AnalisisRelacionesPage from "../pages/AnalisisRelacionesPage";
import EventosInusualesPage from "../pages/EventosInusualesPage";
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
  path="/mi-actividad"
  element={
    <ProtectedRoute rolesPermitidos={["CLIENTE"]}>
      <MiActividadPage />
    </ProtectedRoute>
  }
/>

      <Route
  path="/asesores"
  element={
    <ProtectedRoute rolesPermitidos={["ADMIN"]}>
      <AsesoresModuloPage />
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
      <Route
        path="/recomendaciones"
        element={
          <ProtectedRoute rolesPermitidos={["CLIENTE", "ADMIN"]}>
            <RecomendacionesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reportes"
        element={
          <ProtectedRoute rolesPermitidos={["ADMIN"]}>
            <ReportesPage />
          </ProtectedRoute>
        }
      />
<Route
  path="/descubrir-inmuebles"
  element={
    <ProtectedRoute rolesPermitidos={["ADMIN", "CLIENTE"]}>
      <DescubrirInmueblesPage />
    </ProtectedRoute>
  }
/> 

<Route
  path="/analisis-relaciones"
  element={
    <ProtectedRoute rolesPermitidos={["ADMIN"]}>
      <AnalisisRelacionesPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/eventos-inusuales"
  element={
    <ProtectedRoute rolesPermitidos={["ADMIN"]}>
      <EventosInusualesPage />
    </ProtectedRoute>
  }
/>
    </Routes>



  );
}

export default AppRouter;