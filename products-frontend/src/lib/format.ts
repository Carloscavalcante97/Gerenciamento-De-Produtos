export const brl = (n?: number | null) =>
  typeof n === "number"
    ? n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    : "—";

export const dateTime = (iso?: string | null) =>
  iso ? new Date(iso).toLocaleString("pt-BR") : "—";

export const parseBRL = (value: string): number => {
  const cleaned = value.replace(/[^\d,.-]/g, "");
  const normalized = cleaned.replace(",", ".");
  return parseFloat(normalized) || 0;
};
