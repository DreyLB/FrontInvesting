import { apiFetch } from "./ApiService";

export const transacaoService = {
   async comprar(carteiraId, dados) {
      return await apiFetch(`/carteiras/${carteiraId}/comprar`, {
         method: "POST",
         body: JSON.stringify(dados),
      });
   },

   async vender(carteiraId, ativoId, dados) {
      return await apiFetch(
         `/carteiras/${carteiraId}/ativos/${ativoId}/transacoes`,
         {
            method: "POST",
            body: JSON.stringify({ ...dados, tipo: "venda" }),
         },
      );
   },

   async listarPorCarteira(carteiraId) {
      return await apiFetch(`/carteiras/${carteiraId}/transacoes`);
   },
};
