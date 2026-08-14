import { apiFetch } from "./ApiService";

export const indicadorMercadoService = {
   async listar() {
      return await apiFetch("/indicadores-mercado");
   },
};
