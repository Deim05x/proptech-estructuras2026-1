import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AppRouter from "./router/AppRouter";
import authService from "./services/authService";

function App() {
  const location = useLocation();

  const esPaginaAutenticacion = ["/login", "/registro-cliente"].includes(
    location.pathname
  );

  const autenticado = authService.estaAutenticado();

  if (esPaginaAutenticacion) {
    return <AppRouter />;
  }

  return (
    <div style={appContainerStyle}>
      {autenticado && <Navbar />}

      <div style={layoutStyle}>
        {autenticado && <Sidebar />}

        <main
          style={{
            ...mainContentStyle,
            marginLeft: autenticado ? "250px" : "0",
            paddingTop: autenticado ? "102px" : "24px",
            paddingLeft: autenticado ? "28px" : "24px",
            paddingRight: "28px",
            paddingBottom: "28px",
          }}
        >
          <AppRouter />
        </main>
      </div>
    </div>
  );
}

const appContainerStyle = {
  minHeight: "100vh",
  width: "100%",
  background:
    "radial-gradient(circle at 0% 0%, rgba(124, 58, 237, 0.14), transparent 34%), radial-gradient(circle at 100% 100%, rgba(124, 58, 237, 0.10), transparent 34%), #15121b",
  color: "#e8dfee",
};

const layoutStyle = {
  minHeight: "100vh",
  width: "100%",
  display: "flex",
  background:
    "radial-gradient(circle at 0% 0%, rgba(124, 58, 237, 0.14), transparent 34%), radial-gradient(circle at 100% 100%, rgba(124, 58, 237, 0.10), transparent 34%), #15121b",
};

const mainContentStyle = {
  flex: 1,
  minHeight: "100vh",
  width: "100%",
  background:
    "radial-gradient(circle at 0% 0%, rgba(124, 58, 237, 0.10), transparent 32%), radial-gradient(circle at 100% 100%, rgba(124, 58, 237, 0.08), transparent 32%), #15121b",
  color: "#e8dfee",
  transition: "0.25s ease",
};

export default App;