import { apiFetch } from "./ApiService";

export const carteiraService = {
   async listar() {
      const data = await apiFetch("/carteiras");

      return data;
   },
};
