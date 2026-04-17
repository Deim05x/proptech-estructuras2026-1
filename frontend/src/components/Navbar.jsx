function Navbar() {
  return (
    <header
      style={{
        height: "70px",
        backgroundColor: "#1e3a8a",
        color: "white",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ margin: 0 }}>PropTech Manager</h2>
    </header>
  );
}

export default Navbar;