import { useEffect, useRef } from 'react';
import TomSelect from 'tom-select';
import 'tom-select/dist/css/tom-select.css';
import { useTheme } from '../../context/ThemeProvider';

export default function TomSelectInput({ options }) {
   const selectRef = useRef(null);

   useEffect(() => {
      const tom = new TomSelect(selectRef.current, {
         create: false,
      });

      return () => tom.destroy();
   }, []);

   return (
      <select ref={selectRef}>
         {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
               {opt.label}
            </option>
         ))}
      </select>
   );
}
