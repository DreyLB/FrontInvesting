import { MOCK_API_DATA } from '../data/mockData';

const apiKey = '';
const LLM_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

export const fakeApi = {
   login: async (username, password) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (username === 'test@example.com' && password === 'password123') {
         return { token: 'mock-jwt-token', user: MOCK_API_DATA.user };
      }
      throw new Error('Credenciais inválidas.');
   },
   getDashboardData: async (portfolioId) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return MOCK_API_DATA.portfolios[portfolioId].dashboard;
   },
   getPortfolioData: async (portfolioId) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return MOCK_API_DATA.portfolios[portfolioId].portfolio;
   },
   getTransactions: async (portfolioId) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return MOCK_API_DATA.portfolios[portfolioId].transactions;
   },
   getDividendsData: async (portfolioId) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return MOCK_API_DATA.portfolios[portfolioId].dividends;
   },
   getGoals: async (portfolioId) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return MOCK_API_DATA.portfolios[portfolioId].goals;
   },
   getAlerts: async (portfolioId) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return MOCK_API_DATA.portfolios[portfolioId].alerts;
   },
   getIbovespa: async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return { value: 125345, change: 1.25 };
   },
   getBitcoin: async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return { value: 65432.1, change: -0.75 };
   },
   createTransaction: async (newTransactionData) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Nova transação criada (simulado):', newTransactionData);
      return { success: true, message: 'Transação registrada com sucesso!' };
   },
   analyzePortfolio: async (portfolioData) => {
      try {
         const prompt = `Analise a seguinte carteira de investimentos e forneça uma análise de risco, diversificação e sugestões de otimização em português. A resposta deve ser formatada em Markdown com títulos para cada seção.
      
      Carteira: ${JSON.stringify(portfolioData, null, 2)}
      
      Análise de Risco:
      Diversificação:
      Sugestões de Otimização:`;

         const response = await fetch(LLM_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               contents: [{ parts: [{ text: prompt }] }],
            }),
         });

         if (!response.ok) {
            throw new Error(`API call failed with status: ${response.status}`);
         }

         const result = await response.json();
         const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
         return text || 'Não foi possível gerar a análise. Tente novamente.';
      } catch (error) {
         console.error('Erro ao analisar a carteira:', error);
         return 'Erro ao gerar a análise. Por favor, verifique sua conexão ou tente mais tarde.';
      }
   },
   suggestAssets: async (portfolioData) => {
      try {
         const prompt = `Com base na seguinte carteira de investimentos, sugira 3-5 novos ativos que possam complementar a estratégia atual. Apresente os ativos em uma lista numerada, fornecendo o nome, o tipo de ativo (ex: Ação, FII), e uma breve justificativa de por que cada um é uma boa adição à carteira.
      
      Carteira: ${JSON.stringify(portfolioData, null, 2)}
      
      Ativos sugeridos:`;

         const response = await fetch(LLM_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
               contents: [{ parts: [{ text: prompt }] }],
            }),
         });

         if (!response.ok) {
            throw new Error(`API call failed with status: ${response.status}`);
         }

         const result = await response.json();
         const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
         return text || 'Não foi possível gerar sugestões. Tente novamente.';
      } catch (error) {
         console.error('Erro ao sugerir ativos:', error);
         return 'Erro ao gerar sugestões. Por favor, verifique sua conexão ou tente mais tarde.';
      }
   },
};
