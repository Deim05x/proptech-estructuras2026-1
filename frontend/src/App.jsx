import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AppRouter from "./router/AppRouter";

function App() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f6fa" }}>
      <Navbar />

      <div style={{ display: "flex" }}>
        <Sidebar />

        <main
          style={{
            flex: 1,
            padding: "20px",
            marginLeft: "220px",
            marginTop: "70px",
          }}
        >
          <AppRouter />
        </main>
      </div>
    </div>
  );
}

export default App;