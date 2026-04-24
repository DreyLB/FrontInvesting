import { apiFetch } from "./ApiService";

export const transacaoService = {
   async comprar(carteiraId, dados) {
      return await apiFetch(`/carteiras/${carteiraId}/comprar`, {
         method: "POST",
         body: JSON.stringify(dados),
      });
   },

   async vender(carteiraId, dados) {
      return await apiFetch(`/carteiras/${carteiraId}/vender`, {
         method: "POST",
         body: JSON.stringify(dados),
      });
   },

   async listarPorCarteira(carteiraId) {
      return await apiFetch(`/carteiras/${carteiraId}/transacoes`);
   },
};
