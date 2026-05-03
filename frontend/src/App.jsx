import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AppRouter from "./router/AppRouter";
import authService from "./services/authService";

function App() {
  const location = useLocation();

  const esLogin = location.pathname === "/login";
  const autenticado = authService.estaAutenticado();

  if (esLogin) {
    return <AppRouter />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #fff7fb 0%, #f4ecf0 45%, #e8e0e5 100%)",
      }}
    >
      {autenticado && <Navbar />}

      <div style={{ display: "flex" }}>
        {autenticado && <Sidebar />}

        <main
          style={{
            flex: 1,
            padding: "24px",
            marginLeft: autenticado ? "220px" : "0",
            marginTop: autenticado ? "70px" : "0",
          }}
        >
          <AppRouter />
        </main>
      </div>
    </div>
  );
}

export default App;