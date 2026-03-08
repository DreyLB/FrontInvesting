import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
   const [isDarkMode, setIsDarkMode] = useState(false);

   useEffect(() => {
      const savedMode = localStorage.getItem('theme') === 'dark';
      setIsDarkMode(savedMode);
      document.documentElement.classList.toggle('dark', savedMode);
   }, []);

   const toggleTheme = () => {
      setIsDarkMode((prevMode) => {
         const newMode = !prevMode;
         localStorage.setItem('theme', newMode ? 'dark' : 'light');
         document.documentElement.classList.toggle('dark', newMode);
         return newMode;
      });
   };

   return (
      <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
         {children}
      </ThemeContext.Provider>
   );
};

export const useTheme = () => useContext(ThemeContext);
