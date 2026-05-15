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
import RegistroClientePage from "../pages/RegistroClientePage";
import GestionInmobiliariaPage from "../pages/GestionInmobiliariaPage.jsx";
import PersonasPage from "../pages/PersonasPage";
import MonitoreoPage from "../pages/MonitoreoPage";
import AnaliticaPage from "../pages/AnaliticaPage";
import ComercialPage from "../pages/ComercialPage";
import CatalogoClientePage from "../pages/CatalogoClientePage";
import ContratosPage from "../pages/ContratosPage";
import SolicitudesPage from "../pages/SolicitudesPage";
import MisSolicitudesPage from "../pages/MisSolicitudesPage";
import RangoPrecioPage from "../pages/RangoPrecioPage";
import BusquedaHashPage from "../pages/BusquedaHashPage";
import MotorAlertasPage from "../pages/MotorAlertasPage";
import ValidacionesPage from "../pages/ValidacionesPage";
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
        path="/comercial"
        element={
          <ProtectedRoute rolesPermitidos={["ADMIN"]}>
            <ComercialPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/catalogo-cliente"
        element={
          <ProtectedRoute rolesPermitidos={["CLIENTE"]}>
            <CatalogoClientePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/rangos-precio"
        element={
          <ProtectedRoute rolesPermitidos={["ADMIN", "CLIENTE"]}>
            <RangoPrecioPage />
          </ProtectedRoute>
        }
      />

     <Route path="/validaciones" 
      element={
        <ProtectedRoute rolesPermitidos={["ADMIN"]}>
          <ValidacionesPage />
        </ProtectedRoute>
      }
       />

<Route 
path="/Busqueda-Hash" 
element={
<ProtectedRoute rolesPermitidos={["ADMIN"]}>
  <BusquedaHashPage />
</ProtectedRoute>
}
/>
<Route
path="/busqueda-hash"
element={
<ProtectedRoute rolesPermitidos={["ADMIN"]}>
  <BusquedaHashPage />
</ProtectedRoute>
}
/>
<Route path="/motor-alertas" element={
  <ProtectedRoute rolesPermitidos={["ADMIN"]}>
    <MotorAlertasPage />
  </ProtectedRoute>
} />

     <Route
        path="/clientes"
        element={
          <ProtectedRoute rolesPermitidos={["ADMIN"]}>
            <ClientesPage />
          </ProtectedRoute>

        } 
      />
<Route
  path="/mis-solicitudes"
  element={
    <ProtectedRoute rolesPermitidos={["CLIENTE"]}>
      <MisSolicitudesPage />
    </ProtectedRoute>
  }
/>

<Route
  path="/solicitudes"
  element={
    <ProtectedRoute rolesPermitidos={["ADMIN"]}>
      <SolicitudesPage />
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
        element={<DescubrirInmueblesPage />}
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
        path="/inmuebles-admin"
        element={
          <ProtectedRoute rolesPermitidos={["ADMIN"]}>
            <GestionInmobiliariaPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/personas"
        element={
          <ProtectedRoute rolesPermitidos={["ADMIN"]}>
            <PersonasPage />
          </ProtectedRoute>
        }
      />
      <Route path="/contratos"
        element={
          <ProtectedRoute rolesPermitidos={["ADMIN"]}>
            <ContratosPage />
          </ProtectedRoute>
        } />
      <Route
        path="/monitoreo"
        element={
          <ProtectedRoute rolesPermitidos={["ADMIN"]}>
            <MonitoreoPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/analitica"
        element={
          <ProtectedRoute rolesPermitidos={["ADMIN"]}>
            <AnaliticaPage />
          </ProtectedRoute>
        }
      />

      <Route path="/registro-cliente" element={<RegistroClientePage />} />

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
