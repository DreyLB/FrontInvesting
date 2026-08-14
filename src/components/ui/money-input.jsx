import { InputGroupInput } from "@/components/ui/input-group";
import { centsToNumber, formatNumberBR } from "@/lib/format";

// Input de valor monetário: usuário digita apenas dígitos e o campo
// se formata sozinho no padrão BR (milhar com ponto, decimal com vírgula).
export function MoneyInput({ value, onValueChange, ...props }) {
   const display =
      value === "" || value === null || value === undefined
         ? ""
         : formatNumberBR(value, 2);

   const handleChange = (e) => {
      const raw = e.target.value.replace(/\D/g, "");
      onValueChange(raw ? centsToNumber(raw) : "");
   };

   return (
      <InputGroupInput
         type="text"
         inputMode="decimal"
         value={display}
         onChange={handleChange}
         {...props}
      />
   );
}
