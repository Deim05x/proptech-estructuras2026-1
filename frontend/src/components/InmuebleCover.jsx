import { useMemo, useState } from "react";

function InmuebleCover({ inmueble, height = 130 }) {
  const [conError, setConError] = useState(false);

  const imagenUrl = useMemo(() => {
    return (
      inmueble?.imagenUrl ||
      inmueble?.imagen_url ||
      inmueble?.imagen ||
      inmueble?.urlImagen ||
      ""
    );
  }, [inmueble]);

  const codigo = inmueble?.codigo || "inmueble";
  const mostrarImagen = imagenUrl && !conError;

  if (!mostrarImagen) {
    return (
      <div style={{ ...fallbackStyle, height }}>
        <span style={fallbackTextStyle}>INM</span>
      </div>
    );
  }

  return (
    <div style={{ ...coverStyle, height }}>
      <img
        src={imagenUrl}
        alt={`Portada ${codigo}`}
        loading="lazy"
        onError={() => setConError(true)}
        style={imageStyle}
      />
    </div>
  );
}

const coverStyle = {
  width: "100%",
  borderRadius: "20px",
  marginBottom: "16px",
  overflow: "hidden",
  border: "1px solid #6d5f7a",
  background: "#15121b",
  boxShadow: "0 0 22px rgba(124,58,237,0.18)",
};

const imageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
};

const fallbackStyle = {
  ...coverStyle,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #3f2a57, #7c3aed)",
};

const fallbackTextStyle = {
  color: "#ffffff",
  fontSize: "1.25rem",
  fontWeight: "900",
  letterSpacing: "0.08em",
};

export default InmuebleCover;
