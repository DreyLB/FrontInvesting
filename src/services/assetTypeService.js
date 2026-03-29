import { apiFetch } from "./ApiService";

export const assetTypeService = {
   async listar() {
      return await apiFetch("/asset-types");
   },
};
