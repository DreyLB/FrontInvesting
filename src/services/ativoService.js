import { apiFetch } from "./ApiService";

export const ativoService = {
   // Catálogo global — para busca na compra
   async listarCatalogo(ticker = "") {
      const query = ticker ? `?ticker=${encodeURIComponent(ticker)}` : "";
      return await apiFetch(`/ativos${query}`);
   },

   async listarPorCarteira(carteiraId) {
      return await apiFetch(`/carteiras/${carteiraId}/posicoes`);
   },
};
