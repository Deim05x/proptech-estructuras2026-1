export const generarSiguienteCodigo = (items, prefijo, obtenerId) => {
  const patron = new RegExp(`^${prefijo}-(\\d+)$`, "i");

  const mayor = (items || []).reduce((maximo, item) => {
    const valor = String(obtenerId(item) || "").trim();
    const coincidencia = valor.match(patron);

    if (!coincidencia) return maximo;

    const numero = Number(coincidencia[1]);
    return Number.isFinite(numero) ? Math.max(maximo, numero) : maximo;
  }, 0);

  return `${prefijo}-${String(mayor + 1).padStart(3, "0")}`;
};
