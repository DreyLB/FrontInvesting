import { apiFetch } from "./ApiService";

export const dashBoardService = {
   async listarValorTotalCarteira(carteiraId) {
      return await apiFetch(`/carteiras/${carteiraId}/valorTotal`);
   },

   async listarEvolucaoCarteira(carteiraId) {
      return await apiFetch(`/carteiras/${carteiraId}/evolucao`);
   },
};
