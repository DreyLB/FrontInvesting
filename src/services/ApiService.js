import { tokenStore } from "../services/tokenStore.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export async function apiFetch(path, options = {}) {
   const token = tokenStore.get();

   const res = await fetch(`${API_URL}${path}`, {
      ...options,
      credentials: "include", // necessário para enviar/receber cookie httpOnly
      headers: {
         "Content-Type": "application/json",
         ...(token ? { Authorization: `Bearer ${token}` } : {}),
         ...options.headers,
      },
   });

   if (!res.ok) {
      if (res.status === 401) {
         tokenStore.clear();
      }

      const body = await res.json().catch(() => null);
      throw new Error(body?.message || `API error: ${res.status}`);
   }

   return res.json();
}
