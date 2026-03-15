import { apiFetch } from './ApiService.js';

export const authService = {
   async login(email, password) {
      const data = await apiFetch('/login', {
         method: 'POST',
         body: JSON.stringify({ email, password }),
      });

      const jwt = data.token.token;
      const user = data.token.user;

      localStorage.setItem('token', jwt);

      return user;
   },

   async logout() {
      await apiFetch('/logout', {
         method: 'POST',
      });

      localStorage.removeItem('token');
   },
   
   async me() {
      const data = await apiFetch('/me');
      return data.user;
   },
};