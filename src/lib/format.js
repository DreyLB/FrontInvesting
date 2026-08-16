export function formatNumberBR(value, decimals = 2) {
   const numero = Number(value) || 0;
   return numero.toLocaleString("pt-BR", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
   });
}

// Formata quantidade de ativos: sem casas decimais quando é inteiro,
// com vírgula (padrão BR) quando há fração (ex: cripto fracionada).
export function formatQuantity(value, maxDecimals = 8) {
   const numero = Number(value) || 0;
   return numero.toLocaleString("pt-BR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: maxDecimals,
   });
}

export function formatCurrencyBRL(value) {
   return `R$ ${formatNumberBR(value, 2)}`;
}

// Converte centavos digitados (string só com dígitos) em número decimal.
// Ex: "12345" -> 123.45
export function centsToNumber(digits) {
   const centavos = parseInt(digits.replace(/\D/g, ""), 10) || 0;
   return centavos / 100;
}
