// 2º conversa com o HTTP
// os fetch's dependen dele

import axios from "axios";

const api_url = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const api_client = axios.create({
  baseURL: api_url,
  headers: { "Content-Type": "application/json" },
});
