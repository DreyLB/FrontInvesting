const API_URL = 'http://localhost:8000/api';

export async function apiFetch(endpoint, options = {}) {
   const token = localStorage.getItem('token');

   const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
         'Content-Type': 'application/json',
         ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...options,
   });

   const data = await response.json();

   if (!response.ok) {
      throw new Error(data.error || data.message || 'Erro na requisição');
   }

   return data;
}