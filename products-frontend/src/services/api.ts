import axios from "axios";

const base = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api";
export const api = axios.create({
  baseURL: base,
  headers: { "Content-Type": "application/json" },
});
