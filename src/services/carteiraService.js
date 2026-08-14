import { apiFetch } from "./ApiService";

export const carteiraService = {
   async listar() {
      const data = await apiFetch("/carteiras");

      return data;
   },

   async criar({ nome, descricao }) {
      return await apiFetch("/carteiras", {
         method: "POST",
         body: JSON.stringify({ nome, descricao }),
      });
   },
};
