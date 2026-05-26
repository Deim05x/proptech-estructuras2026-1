import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

const LoginPage = lazy(() => import("../pages/LoginPage"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const InmueblesPage = lazy(() => import("../pages/InmueblesPage"));
const ClientesPage = lazy(() => import("../pages/ClientesPage"));
const VisitasPage = lazy(() => import("../pages/VisitasPage"));
const AlertasPage = lazy(() => import("../pages/AlertasPage"));
const OperacionesPage = lazy(() => import("../pages/OperacionesPage"));
const FavoritosPage = lazy(() => import("../pages/FavoritosPage"));
const HistorialPage = lazy(() => import("../pages/HistorialPage"));
const CarruselInmueblesPage = lazy(() => import("../pages/CarruselInmueblesPage"));
const RotacionAsesoresPage = lazy(() => import("../pages/RotacionAsesoresPage"));
const InicioClientePage = lazy(() => import("../pages/InicioClientePage"));
const MisVisitasPage = lazy(() => import("../pages/MisVisitasPage"));
const RecomendacionesPage = lazy(() => import("../pages/RecomendacionesPage"));
const ReportesPage = lazy(() => import("../pages/ReportesPage"));
const DescubrirInmueblesPage = lazy(() => import("../pages/DescubrirInmueblesPage"));
const MiActividadPage = lazy(() => import("../pages/MiActividadPage"));
const AsesoresModuloPage = lazy(() => import("../pages/AsesoresModuloPage"));
const AnalisisRelacionesPage = lazy(() => import("../pages/AnalisisRelacionesPage"));
const EventosInusualesPage = lazy(() => import("../pages/EventosInusualesPage"));
const RegistroClientePage = lazy(() => import("../pages/RegistroClientePage"));
const GestionInmobiliariaPage = lazy(() => import("../pages/GestionInmobiliariaPage.jsx"));
const PersonasPage = lazy(() => import("../pages/PersonasPage"));
const MonitoreoPage = lazy(() => import("../pages/MonitoreoPage"));
const AnaliticaPage = lazy(() => import("../pages/AnaliticaPage"));
const ComercialPage = lazy(() => import("../pages/ComercialPage"));
const CatalogoClientePage = lazy(() => import("../pages/CatalogoClientePage"));
const ContratosPage = lazy(() => import("../pages/ContratosPage"));
const SolicitudesPage = lazy(() => import("../pages/SolicitudesPage"));
const MisSolicitudesPage = lazy(() => import("../pages/MisSolicitudesPage"));
const RangoPrecioPage = lazy(() => import("../pages/RangoPrecioPage"));
const BusquedaHashPage = lazy(() => import("../pages/BusquedaHashPage"));
const MotorAlertasPage = lazy(() => import("../pages/MotorAlertasPage"));
const ValidacionesPage = lazy(() => import("../pages/ValidacionesPage"));
const SimulacionDemandaPage = lazy(() => import("../pages/SimulacionDemandaPage"));

function AppRouter() {
  return (
    <Suspense fallback={<div style={loadingPageStyle}>Cargando...</div>}>
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

      <Route
        path="/simulacion-demanda"
        element={
          <ProtectedRoute rolesPermitidos={["ADMIN"]}>
            <SimulacionDemandaPage />
          </ProtectedRoute>
        }
      />
    </Routes>
    </Suspense>

    



  );
}

const loadingPageStyle = {
  minHeight: "160px",
  display: "grid",
  placeItems: "center",
  color: "#e8dfee",
};

export default AppRouter;
