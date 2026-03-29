import { apiFetch } from "./ApiService";

export const dividendoService = {
   async registrar(carteiraId, ativoId, dados) {
      return await apiFetch(
         `/carteiras/${carteiraId}/ativos/${ativoId}/dividendos`,
         {
            method: "POST",
            body: JSON.stringify(dados),
         },
      );
   },

   async listarPorCarteira(carteiraId) {
      return await apiFetch(`/carteiras/${carteiraId}/dividendos`);
   },
};
