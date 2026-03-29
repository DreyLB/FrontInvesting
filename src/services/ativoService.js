import { apiFetch } from "./ApiService";

export const ativoService = {
   async listarPorCarteira(carteiraId) {
      return await apiFetch(`/carteira/${carteiraId}/ativos`);
   },
};
