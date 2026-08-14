import { apiFetch } from "./ApiService";

export const dashBoardService = {
   async listarValorTotalCarteira(carteiraId) {
      return await apiFetch(`/carteiras/${carteiraId}/valorTotal`);
   },

   async listarEvolucaoCarteira(carteiraId) {
      return await apiFetch(`/carteiras/${carteiraId}/evolucao`);
   },

   async listarComposicaoCarteira(carteiraId) {
      return await apiFetch(`/carteiras/${carteiraId}/composicao`);
   },

   async listarComposicaoAcoes(carteiraId) {
      return await apiFetch(`/carteiras/${carteiraId}/composicao/acoes`);
   },

   async listarComposicaoFiis(carteiraId) {
      return await apiFetch(`/carteiras/${carteiraId}/composicao/fiis`);
   },
};
