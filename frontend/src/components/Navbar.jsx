import authService from "../services/authService";

function Navbar() {
  const username = authService.getUsername();
  const rol = authService.getRol();

  return (
    <header
      style={{
        height: "70px",
        background: "rgba(255, 255, 255, 0.86)",
        backdropFilter: "blur(18px)",
        color: "#1e1a1e",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        borderBottom: "1px solid #e8e0e5",
        boxShadow: "0 10px 30px rgba(67, 33, 77, 0.08)",
      }}
    >
      <div>
        <h2
          style={{
            margin: 0,
            fontFamily: "Manrope, Inter, sans-serif",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "#43214d",
          }}
        >
          Prop<span style={{ color: "#7f4d7c", fontWeight: 500 }}>Tech</span>
        </h2>
        <small style={{ color: "#7e747d" }}>
          Sistema inmobiliario · Estructuras de datos
        </small>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div style={{ textAlign: "right" }}>
          <strong style={{ display: "block", color: "#1e1a1e" }}>
            {username || "Usuario"}
          </strong>
          <small style={{ color: "#7e747d" }}>{rol || "Sin rol"}</small>
        </div>

        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #5b3765, #fdbef4)",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
          }}
        >
          {(username || "U").charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}

export default Navbar;