import { apiFetch } from "./ApiService.js";
import { tokenStore } from "./tokenStore.js";

export const authService = {
   async login(email, password) {
      const data = await apiFetch("/login", {
         method: "POST",
         body: JSON.stringify({ email, password }),
      });

      tokenStore.set(data.token.token);
      return data.token.user;
   },

   async logout() {
      try {
         await apiFetch("/logout", { method: "POST" });
      } finally {
         tokenStore.clear();
      }
   },

   async register(name, email, password) {
      await apiFetch("/register", {
         method: "POST",
         body: JSON.stringify({ name, email, password }),
      });
   },

   async refresh() {
      const data = await apiFetch("/refresh", { method: "POST" });
      tokenStore.set(data.token);
      return data.user;
   },

   async me() {
      const data = await apiFetch("/me");
      return data.user;
   },
};
