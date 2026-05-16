import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import asistenteVirtualService from "../services/asistenteVirtualService";
import authService from "../services/authService";

const MENSAJE_INICIAL = {
  role: "assistant",
  content:
    "Hola, soy el asesor virtual de HogarXpress. Puedo ayudarte a buscar inmuebles por zona, presupuesto, tipo o finalidad.",
};

function AsistenteVirtualChat() {
  const navigate = useNavigate();
  const [abierto, setAbierto] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([MENSAJE_INICIAL]);
  const [cargando, setCargando] = useState(false);
  const [requiereRegistro, setRequiereRegistro] = useState(false);
  const autenticado = authService.estaAutenticado();

  const historialApi = useMemo(
    () =>
      mensajes.slice(-8).map((item) => ({
        role: item.role,
        content: item.content,
      })),
    [mensajes]
  );

  const enviarMensaje = async (event) => {
    event.preventDefault();
    const texto = mensaje.trim();

    if (!texto || cargando) {
      return;
    }

    const mensajeUsuario = { role: "user", content: texto };
    setMensajes((actuales) => [...actuales, mensajeUsuario]);
    setMensaje("");
    setCargando(true);
    setRequiereRegistro(false);

    try {
      const respuesta = await asistenteVirtualService.conversar({
        mensaje: texto,
        historial: [...historialApi, mensajeUsuario],
      });

      setMensajes((actuales) => [
        ...actuales,
        {
          role: "assistant",
          content:
            respuesta?.respuesta ||
            "No pude generar una respuesta en este momento.",
          generatedWithAi: respuesta?.generadoConIa,
          codes: respuesta?.codigosSugeridos || [],
        },
      ]);
      setRequiereRegistro(Boolean(respuesta?.requiereRegistro));
    } catch (error) {
      console.error("Error en asesor virtual:", error);
      setMensajes((actuales) => [
        ...actuales,
        {
          role: "assistant",
          content:
            "No pude conectarme con el asesor virtual. Revisa que el backend este encendido e intenta de nuevo.",
        },
      ]);
    } finally {
      setCargando(false);
    }
  };

  const irARegistro = () => {
    setAbierto(false);
    navigate("/registro-cliente");
  };

  const irALogin = () => {
    setAbierto(false);
    navigate("/login");
  };

  const irACatalogo = () => {
    setAbierto(false);
    navigate("/descubrir-inmuebles");
  };

  return (
    <>
      <style>{chatStyles}</style>

      <div className="ai-chat-root">
        {abierto && (
          <section className="ai-chat-panel" aria-label="Asesor virtual">
            <header className="ai-chat-header">
              <div className="ai-chat-brand">
                <span className="ai-chat-mark">IA</span>
                <div>
                  <h2>Asesor virtual</h2>
                  <p>HogarXpress</p>
                </div>
              </div>
              <button
                className="ai-chat-icon-button"
                type="button"
                onClick={() => setAbierto(false)}
                aria-label="Cerrar asesor virtual"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </header>

            <div className="ai-chat-messages">
              {mensajes.map((item, index) => (
                <article
                  key={`${item.role}-${index}`}
                  className={`ai-chat-message ${
                    item.role === "user" ? "is-user" : "is-assistant"
                  }`}
                >
                  <p>{item.content}</p>
                  {item.codes?.length > 0 && (
                    <div className="ai-chat-codes">
                      {item.codes.map((codigo) => (
                        <button
                          key={codigo}
                          type="button"
                          onClick={irACatalogo}
                        >
                          {codigo}
                        </button>
                      ))}
                    </div>
                  )}
                  {item.generatedWithAi && (
                    <span className="ai-chat-source">Respuesta IA</span>
                  )}
                </article>
              ))}

              {cargando && (
                <article className="ai-chat-message is-assistant">
                  <div className="ai-chat-typing" aria-label="Pensando">
                    <span />
                    <span />
                    <span />
                  </div>
                </article>
              )}
            </div>

            {requiereRegistro && !autenticado && (
              <div className="ai-chat-actions">
                <button type="button" onClick={irARegistro}>
                  Registrarme
                </button>
                <button type="button" onClick={irALogin}>
                  Iniciar sesion
                </button>
              </div>
            )}

            <form className="ai-chat-form" onSubmit={enviarMensaje}>
              <input
                value={mensaje}
                onChange={(event) => setMensaje(event.target.value)}
                placeholder="Pregunta por zona, precio o tipo..."
                aria-label="Mensaje para el asesor virtual"
              />
              <button type="submit" disabled={cargando || !mensaje.trim()}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </form>
          </section>
        )}

        <button
          className="ai-chat-launcher"
          type="button"
          onClick={() => setAbierto((actual) => !actual)}
          aria-label="Abrir asesor virtual"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 5.5A3.5 3.5 0 017.5 2h9A3.5 3.5 0 0120 5.5v7a3.5 3.5 0 01-3.5 3.5H11l-5 4v-4.2A3.5 3.5 0 014 12.5v-7z" />
            <path d="M8 8h8M8 12h5" />
          </svg>
          <span>Asesor IA</span>
        </button>
      </div>
    </>
  );
}

const chatStyles = `
.ai-chat-root {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 1200;
  font-family: "Space Grotesk", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.ai-chat-launcher,
.ai-chat-icon-button,
.ai-chat-form button,
.ai-chat-actions button,
.ai-chat-codes button {
  border: 0;
  font-family: inherit;
}

.ai-chat-launcher {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 54px;
  padding: 0 18px;
  color: #ffffff;
  background: linear-gradient(135deg, #7c3aed, #5b21b6);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 999px;
  box-shadow: 0 18px 42px rgba(65, 24, 128, 0.48);
  cursor: pointer;
  transition: transform 0.22s ease, box-shadow 0.22s ease;
}

.ai-chat-launcher:hover {
  transform: translateY(-2px);
  box-shadow: 0 22px 52px rgba(65, 24, 128, 0.58);
}

.ai-chat-launcher svg {
  width: 23px;
  height: 23px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.ai-chat-launcher span {
  font-size: 14px;
  font-weight: 800;
}

.ai-chat-panel {
  width: min(390px, calc(100vw - 32px));
  height: min(620px, calc(100vh - 104px));
  margin-bottom: 14px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: #f8f4ff;
  background:
    radial-gradient(circle at 20% 0%, rgba(124, 58, 237, 0.28), transparent 35%),
    rgba(21, 18, 27, 0.96);
  border: 1px solid rgba(196, 168, 255, 0.22);
  border-radius: 24px;
  box-shadow: 0 28px 70px rgba(0, 0, 0, 0.48);
  backdrop-filter: blur(18px);
  animation: aiChatIn 0.28s ease both;
}

.ai-chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.ai-chat-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ai-chat-mark {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  color: #ffffff;
  background: #7c3aed;
  font-size: 13px;
  font-weight: 900;
  box-shadow: 0 12px 28px rgba(124, 58, 237, 0.34);
}

.ai-chat-brand h2 {
  margin: 0;
  font-size: 17px;
  line-height: 1.2;
}

.ai-chat-brand p {
  margin: 3px 0 0;
  color: #bfb2ce;
  font-size: 12px;
  font-weight: 700;
}

.ai-chat-icon-button {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  color: #d9cff0;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.10);
  border-radius: 12px;
  cursor: pointer;
}

.ai-chat-icon-button svg,
.ai-chat-form button svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.ai-chat-messages {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px;
  overflow-y: auto;
}

.ai-chat-message {
  max-width: 88%;
  padding: 12px 14px;
  border-radius: 16px;
  animation: aiMessageIn 0.22s ease both;
}

.ai-chat-message p {
  margin: 0;
  font-size: 13.5px;
  line-height: 1.5;
}

.ai-chat-message.is-assistant {
  align-self: flex-start;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.ai-chat-message.is-user {
  align-self: flex-end;
  background: linear-gradient(135deg, #7c3aed, #5b21b6);
  color: #ffffff;
}

.ai-chat-source {
  display: inline-block;
  margin-top: 8px;
  color: #c4a8ff;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.ai-chat-codes {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}

.ai-chat-codes button {
  padding: 6px 9px;
  color: #f8f4ff;
  background: rgba(124, 58, 237, 0.26);
  border: 1px solid rgba(196, 168, 255, 0.24);
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
  cursor: pointer;
}

.ai-chat-actions {
  display: flex;
  gap: 8px;
  padding: 0 18px 12px;
}

.ai-chat-actions button {
  flex: 1;
  min-height: 38px;
  color: #ffffff;
  background: rgba(124, 58, 237, 0.25);
  border: 1px solid rgba(196, 168, 255, 0.28);
  border-radius: 12px;
  font-weight: 800;
  cursor: pointer;
}

.ai-chat-actions button:first-child {
  background: #7c3aed;
}

.ai-chat-form {
  display: flex;
  gap: 10px;
  padding: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.ai-chat-form input {
  min-width: 0;
  flex: 1;
  height: 44px;
  padding: 0 14px;
  color: #ffffff;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.10);
  border-radius: 14px;
  outline: none;
}

.ai-chat-form input:focus {
  border-color: rgba(196, 168, 255, 0.72);
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.18);
}

.ai-chat-form input::placeholder {
  color: rgba(232, 223, 238, 0.58);
}

.ai-chat-form button {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  color: #ffffff;
  background: #7c3aed;
  border-radius: 14px;
  cursor: pointer;
}

.ai-chat-form button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.ai-chat-typing {
  display: inline-flex;
  gap: 5px;
  align-items: center;
  min-height: 20px;
}

.ai-chat-typing span {
  width: 7px;
  height: 7px;
  background: #c4a8ff;
  border-radius: 50%;
  animation: aiTyping 0.9s ease-in-out infinite;
}

.ai-chat-typing span:nth-child(2) {
  animation-delay: 0.12s;
}

.ai-chat-typing span:nth-child(3) {
  animation-delay: 0.24s;
}

@keyframes aiChatIn {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes aiMessageIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes aiTyping {
  0%, 100% {
    transform: translateY(0);
    opacity: 0.45;
  }
  50% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

@media (max-width: 620px) {
  .ai-chat-root {
    right: 16px;
    bottom: 16px;
  }

  .ai-chat-launcher span {
    display: none;
  }

  .ai-chat-launcher {
    width: 56px;
    min-height: 56px;
    justify-content: center;
    padding: 0;
  }

  .ai-chat-panel {
    width: calc(100vw - 32px);
    height: min(620px, calc(100vh - 96px));
  }
}

@media (prefers-reduced-motion: reduce) {
  .ai-chat-panel,
  .ai-chat-message,
  .ai-chat-typing span,
  .ai-chat-launcher {
    animation: none;
    transition: none;
  }
}
`;

export default AsistenteVirtualChat;
