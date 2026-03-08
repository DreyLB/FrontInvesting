import React, { useState, useEffect, createContext, useContext } from 'react';
import {
   LineChart,
   Line,
   PieChart,
   Pie,
   Cell,
   ResponsiveContainer,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   Legend,
} from 'recharts';

// Definindo o contexto de autenticação para gerenciar o estado do usuário
const AuthContext = createContext();

// Contexto para gerenciar o tema da aplicação (claro/escuro)
const ThemeContext = createContext();

const MOCK_API_DATA = {
   user: {
      name: 'João Victor',
      portfolios: [
         { id: '1', name: 'Aposentadoria' },
         { id: '2', name: 'Crescimento' },
         { id: '3', name: 'Renda Passiva' },
      ],
   },
   portfolios: {
      1: {
         // Carteira Aposentadoria
         dashboard: {
            portfolioValue: 125432.5,
            portfolioEvolution: [
               { month: 'Jan', value: 100000 },
               { month: 'Fev', value: 105000 },
               { month: 'Mar', value: 110500 },
               { month: 'Abr', value: 115000 },
               { month: 'Mai', value: 120200 },
               { month: 'Jun', value: 125432.5 },
            ],
            portfolioComposition: [
               { name: 'Ações', value: 50000, color: '#3182CE' },
               { name: 'FIIs', value: 30000, color: '#48BB78' },
               { name: 'ETFs', value: 25000, color: '#805AD5' },
               { name: 'Caixa', value: 20432.5, color: '#ECC94B' },
            ],
         },
         portfolio: [
            {
               id: 1,
               type: 'Ação',
               symbol: 'PETR4',
               category: 'Ações',
               quantity: 200,
               averagePrice: 25.5,
               currentPrice: 28.1,
               isin: 'BRPETRACNPR5',
            },
            {
               id: 2,
               type: 'FII',
               symbol: 'HGLG11',
               category: 'FIIs',
               quantity: 50,
               averagePrice: 150.0,
               currentPrice: 152.5,
               isin: 'BRHGLGCTF009',
            },
            {
               id: 3,
               type: 'ETF',
               symbol: 'IVVB11',
               category: 'ETFs',
               quantity: 15,
               averagePrice: 245.0,
               currentPrice: 250.2,
               isin: 'BRIVVBCTF005',
            },
            {
               id: 4,
               type: 'Ação',
               symbol: 'VALE3',
               category: 'Ações',
               quantity: 100,
               averagePrice: 65.0,
               currentPrice: 62.8,
               isin: 'BRVALEACNORO',
            },
            {
               id: 5,
               type: 'Caixa',
               symbol: 'R$ C/C',
               category: 'Caixa',
               quantity: 20432.5,
               averagePrice: 1.0,
               currentPrice: 1.0,
               isin: 'N/A',
            },
         ],
         transactions: [
            {
               id: 1,
               date: '2024-06-15',
               type: 'Compra',
               asset: 'PETR4',
               quantity: 100,
               price: 28.0,
            },
            {
               id: 2,
               date: '2024-06-10',
               type: 'Dividendo',
               asset: 'HGLG11',
               value: 250.0,
            },
            {
               id: 3,
               date: '2024-05-20',
               type: 'Compra',
               asset: 'IVVB11',
               quantity: 15,
               price: 245.0,
            },
         ],
         dividends: [
            {
               asset: 'PETR4',
               Jan: 50,
               Feb: 0,
               Mar: 65,
               Apr: 0,
               May: 55,
               Jun: 75,
               Jul: 0,
               Aug: 0,
               Sep: 0,
               Oct: 0,
               Nov: 0,
               Dec: 0,
            },
            {
               asset: 'HGLG11',
               Jan: 150,
               Feb: 150,
               Mar: 150,
               Apr: 150,
               May: 150,
               Jun: 150,
               Jul: 150,
               Aug: 150,
               Sep: 150,
               Oct: 150,
               Nov: 150,
               Dec: 150,
            },
            {
               asset: 'IVVB11',
               Jan: 0,
               Feb: 20,
               Mar: 0,
               Apr: 30,
               May: 0,
               Jun: 45,
               Jul: 0,
               Aug: 0,
               Sep: 0,
               Oct: 0,
               Nov: 0,
               Dec: 0,
            },
         ],
         goals: [
            {
               id: 1,
               name: 'Comprar um carro',
               description: 'Meta de 50.000 para comprar um carro novo',
               targetValue: 50000,
               currentValue: 15000,
               deadline: '2025-12-31',
            },
            {
               id: 2,
               name: 'Reserva de Emergência',
               description: 'Valor equivalente a 6 meses de despesas',
               targetValue: 25000,
               currentValue: 20432.5,
               deadline: '2024-12-31',
            },
         ],
         alerts: [
            {
               id: 1,
               type: 'preço',
               message: 'PETR4 subiu mais de 5% hoje!',
               date: '2024-06-27',
            },
            {
               id: 2,
               type: 'dividendo',
               message: 'Dividendo de HGLG11 agendado para o dia 10',
               date: '2024-06-05',
            },
            {
               id: 3,
               type: 'meta',
               message: 'Sua meta "Reserva de Emergência" está a 20% do alvo!',
               date: '2024-06-01',
            },
         ],
      },
      2: {
         // Carteira Crescimento
         dashboard: {
            portfolioValue: 75000.0,
            portfolioEvolution: [
               { month: 'Jan', value: 50000 },
               { month: 'Fev', value: 58000 },
               { month: 'Mar', value: 62000 },
               { month: 'Abr', value: 68000 },
               { month: 'Mai', value: 72000 },
               { month: 'Jun', value: 75000.0 },
            ],
            portfolioComposition: [
               { name: 'Cripto', value: 35000, color: '#F6AD55' },
               { name: 'Ações', value: 40000, color: '#4299E1' },
            ],
         },
         portfolio: [
            {
               id: 6,
               type: 'Ação',
               symbol: 'TSLA34',
               category: 'Ações',
               quantity: 50,
               averagePrice: 70.0,
               currentPrice: 75.0,
               isin: 'BRTSLAACNOR8',
            },
            {
               id: 7,
               type: 'Cripto',
               symbol: 'BTC',
               category: 'Criptomoedas',
               quantity: 0.5,
               averagePrice: 60000,
               currentPrice: 70000,
               isin: 'N/A',
            },
            {
               id: 8,
               type: 'Cripto',
               symbol: 'ETH',
               category: 'Criptomoedas',
               quantity: 5,
               averagePrice: 3000,
               currentPrice: 3200,
               isin: 'N/A',
            },
         ],
         transactions: [
            {
               id: 4,
               date: '2024-06-25',
               type: 'Compra',
               asset: 'BTC',
               quantity: 0.1,
               price: 70000,
            },
            {
               id: 5,
               date: '2024-06-20',
               type: 'Compra',
               asset: 'TSLA34',
               quantity: 50,
               price: 70.0,
            },
         ],
         dividends: [],
         goals: [],
         alerts: [],
      },
      3: {
         // Carteira Renda Passiva
         dashboard: {
            portfolioValue: 45000.0,
            portfolioEvolution: [
               { month: 'Jan', value: 40000 },
               { month: 'Fev', value: 41000 },
               { month: 'Mar', value: 42500 },
               { month: 'Abr', value: 43500 },
               { month: 'Mai', value: 44200 },
               { month: 'Jun', value: 45000.0 },
            ],
            portfolioComposition: [
               { name: 'FIIs', value: 25000, color: '#48BB78' },
               { name: 'ETFs', value: 15000, color: '#805AD5' },
               { name: 'Caixa', value: 5000, color: '#ECC94B' },
            ],
         },
         portfolio: [
            {
               id: 9,
               type: 'FII',
               symbol: 'MXRF11',
               category: 'FIIs',
               quantity: 200,
               averagePrice: 10.0,
               currentPrice: 10.5,
               isin: 'BRMXRFCDNOR6',
            },
            {
               id: 10,
               type: 'FII',
               symbol: 'KNRI11',
               category: 'FIIs',
               quantity: 50,
               averagePrice: 160.0,
               currentPrice: 161.0,
               isin: 'BRKNRICTF007',
            },
            {
               id: 11,
               type: 'ETF',
               symbol: 'BNDS11',
               category: 'ETFs',
               quantity: 20,
               averagePrice: 75.0,
               currentPrice: 76.0,
               isin: 'BRBNDSCTF005',
            },
         ],
         transactions: [
            {
               id: 6,
               date: '2024-06-05',
               type: 'Compra',
               asset: 'KNRI11',
               quantity: 50,
               price: 160.0,
            },
            {
               id: 7,
               date: '2024-06-01',
               type: 'Dividendo',
               asset: 'MXRF11',
               value: 200.0,
            },
            {
               id: 8,
               date: '2024-05-15',
               type: 'Compra',
               asset: 'MXRF11',
               quantity: 200,
               price: 10.0,
            },
         ],
         dividends: [
            {
               asset: 'MXRF11',
               Jan: 200,
               Feb: 200,
               Mar: 200,
               Apr: 200,
               May: 200,
               Jun: 200,
               Jul: 200,
               Aug: 200,
               Sep: 200,
               Oct: 200,
               Nov: 200,
               Dec: 200,
            },
            {
               asset: 'KNRI11',
               Jan: 0,
               Feb: 0,
               Mar: 0,
               Apr: 0,
               May: 0,
               Jun: 500,
               Jul: 0,
               Aug: 0,
               Sep: 0,
               Oct: 0,
               Nov: 0,
               Dec: 0,
            },
         ],
         goals: [],
         alerts: [],
      },
   },
};

const apiKey = '';
const LLM_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

const fakeApi = {
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

const AuthProvider = ({ children }) => {
   const [isAuthenticated, setIsAuthenticated] = useState(false);
   const [user, setUser] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const token = localStorage.getItem('auth_token');
      if (token) {
         setUser(MOCK_API_DATA.user);
         setIsAuthenticated(true);
      }
      setLoading(false);
   }, []);

   const login = async (username, password) => {
      try {
         const response = await fakeApi.login(username, password);
         localStorage.setItem('auth_token', response.token);
         setUser(response.user);
         setIsAuthenticated(true);
         return true;
      } catch (error) {
         console.error('Login failed:', error);
         return false;
      }
   };

   const logout = () => {
      localStorage.removeItem('auth_token');
      setUser(null);
      setIsAuthenticated(false);
   };

   return (
      <AuthContext.Provider
         value={{ isAuthenticated, user, login, logout, loading }}
      >
         {children}
      </AuthContext.Provider>
   );
};

const useAuth = () => useContext(AuthContext);

const ThemeProvider = ({ children }) => {
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

//SERÁ UTILIZADO NO LAYOUT
const useTheme = () => useContext(ThemeContext);

const ProtectedRoute = ({ children }) => {
   const { isAuthenticated, loading } = useAuth();
   if (loading)
      return (
         <div className="flex items-center justify-center min-h-screen">
            Carregando...
         </div>
      );
   if (!isAuthenticated) return <LoginPage />;
   return children;
};

const Layout = ({ children }) => {
   const { logout, user } = useAuth();
   const { isDarkMode, toggleTheme } = useTheme();
   const [activePage, setActivePage] = useState('dashboard');
   const [activePortfolio, setActivePortfolio] = useState(
      user.portfolios[0].id,
   );

   return (
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 dark:bg-gray-900 font-inter">
         {/* Sidebar de navegação */}
         <aside className="bg-white dark:bg-gray-800 md:w-64 p-4 border-r border-gray-200 dark:border-gray-700 shadow-md relative">
            <button
               onClick={toggleTheme}
               className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
               aria-label="Toggle dark mode"
            >
               {isDarkMode ? '🌙' : '☀️'}
            </button>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
               Investing
            </h1>
            <nav>
               <ul>
                  <li>
                     <button
                        onClick={() => setActivePage('dashboard')}
                        className={`w-full text-left p-3 rounded-md transition-colors ${activePage === 'dashboard' ? 'bg-indigo-500 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                     >
                        Dashboard
                     </button>
                  </li>
                  <li>
                     <button
                        onClick={() => setActivePage('portfolio')}
                        className={`w-full text-left p-3 rounded-md transition-colors ${activePage === 'portfolio' ? 'bg-indigo-500 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                     >
                        Carteira
                     </button>
                  </li>
                  <li>
                     <button
                        onClick={() => setActivePage('transactions')}
                        className={`w-full text-left p-3 rounded-md transition-colors ${activePage === 'transactions' ? 'bg-indigo-500 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                     >
                        Movimentações
                     </button>
                  </li>
                  <li>
                     <button
                        onClick={() => setActivePage('new-transaction')}
                        className={`w-full text-left p-3 rounded-md transition-colors ${activePage === 'new-transaction' ? 'bg-indigo-500 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                     >
                        Nova Transação
                     </button>
                  </li>
                  <li>
                     <button
                        onClick={() => setActivePage('reports')}
                        className={`w-full text-left p-3 rounded-md transition-colors ${activePage === 'reports' ? 'bg-indigo-500 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                     >
                        Relatórios
                     </button>
                  </li>
                  <li>
                     <button
                        onClick={() => setActivePage('goals')}
                        className={`w-full text-left p-3 rounded-md transition-colors ${activePage === 'goals' ? 'bg-indigo-500 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                     >
                        Metas
                     </button>
                  </li>
               </ul>
            </nav>
            <div className="absolute bottom-4 left-4 right-4">
               <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Bem-vindo, {user.name}
               </div>
               <button
                  onClick={logout}
                  className="w-full p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
               >
                  Sair
               </button>
            </div>
         </aside>
         {/* Conteúdo principal */}
         <main className="flex-1 p-8 overflow-y-auto">
            <div className="flex justify-end mb-4">
               <select
                  value={activePortfolio}
                  onChange={(e) => setActivePortfolio(e.target.value)}
                  className="p-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white"
               >
                  {user.portfolios.map((p) => (
                     <option key={p.id} value={p.id}>
                        {p.name}
                     </option>
                  ))}
               </select>
            </div>
            {activePage === 'dashboard' && (
               <DashboardPage activePortfolioId={activePortfolio} />
            )}
            {activePage === 'portfolio' && (
               <PortfolioPage activePortfolioId={activePortfolio} />
            )}
            {activePage === 'transactions' && (
               <TransactionsPage activePortfolioId={activePortfolio} />
            )}
            {activePage === 'new-transaction' && <NewTransactionPage />}
            {activePage === 'reports' && (
               <ReportsPage activePortfolioId={activePortfolio} />
            )}
            {activePage === 'goals' && (
               <GoalsPage activePortfolioId={activePortfolio} />
            )}
         </main>
      </div>
   );
};

const LoginPage = () => {
   const [username, setUsername] = useState('');
   const [password, setPassword] = useState('');
   const [error, setError] = useState('');
   const { login } = useAuth();

   const handleLogin = async (e) => {
      e.preventDefault();
      setError('');
      const success = await login(username, password);
      if (!success) {
         setError('Credenciais inválidas. Tente novamente.');
      }
   };

   return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 font-inter">
         <div className="w-full max-w-sm p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
            <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-6">
               Login
            </h2>
            <form onSubmit={handleLogin}>
               <div className="mb-4">
                  <label
                     className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2"
                     htmlFor="username"
                  >
                     Email
                  </label>
                  <input
                     className="w-full px-3 py-2 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
                     id="username"
                     type="email"
                     placeholder="seuemail@exemplo.com"
                     value={username}
                     onChange={(e) => setUsername(e.target.value)}
                     required
                  />
               </div>
               <div className="mb-6">
                  <label
                     className="block text-gray-700 dark:text-gray-200 text-sm font-bold mb-2"
                     htmlFor="password"
                  >
                     Senha
                  </label>
                  <input
                     className="w-full px-3 py-2 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
                     id="password"
                     type="password"
                     placeholder="********"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     required
                  />
               </div>
               {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
               <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:shadow-outline transition-colors"
               >
                  Entrar
               </button>
            </form>
         </div>
      </div>
   );
};

const DashboardPage = ({ activePortfolioId }) => {
   const [dashboardData, setDashboardData] = useState(null);
   const [portfolioData, setPortfolioData] = useState(null);
   const [alerts, setAlerts] = useState(null);
   const [ibovespa, setIbovespa] = useState(null);
   const [bitcoin, setBitcoin] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchData = async () => {
         setLoading(true);
         const data = await fakeApi.getDashboardData(activePortfolioId);
         const portfolio = await fakeApi.getPortfolioData(activePortfolioId);
         const alertsData = await fakeApi.getAlerts(activePortfolioId);
         const ibovespaData = await fakeApi.getIbovespa();
         const bitcoinData = await fakeApi.getBitcoin();
         setDashboardData(data);
         setPortfolioData(portfolio);
         setAlerts(alertsData);
         setIbovespa(ibovespaData);
         setBitcoin(bitcoinData);
         setLoading(false);
      };
      fetchData();
   }, [activePortfolioId]);

   if (loading)
      return (
         <div className="text-center mt-8 text-gray-800 dark:text-gray-200">
            Carregando dados do painel...
         </div>
      );
   if (!dashboardData || !portfolioData || !alerts || !ibovespa || !bitcoin)
      return (
         <div className="text-center mt-8 text-red-500">
            Erro ao carregar os dados.
         </div>
      );

   const getCompositionData = (category) => {
      const filtered = portfolioData.filter(
         (asset) => asset.category === category,
      );
      return filtered.map((asset) => ({
         name: asset.symbol,
         value: asset.quantity * asset.currentPrice,
         color: '#' + Math.floor(Math.random() * 16777215).toString(16),
      }));
   };

   const stocksComposition = getCompositionData('Ações');
   const fiisComposition = getCompositionData('FIIs');

   return (
      <div className="space-y-8">
         <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            Dashboard
         </h2>

         {/* Indicadores de Mercado */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex justify-between items-center">
               <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  Ibovespa
               </h3>
               <div className="text-right">
                  <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                     {ibovespa.value.toLocaleString('pt-BR')}
                  </p>
                  <span
                     className={`text-sm font-semibold ${ibovespa.change >= 0 ? 'text-green-500' : 'text-red-500'}`}
                  >
                     {ibovespa.change.toFixed(2)}%
                  </span>
               </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex justify-between items-center">
               <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                  Bitcoin
               </h3>
               <div className="text-right">
                  <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                     R${' '}
                     {bitcoin.value.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                     })}
                  </p>
                  <span
                     className={`text-sm font-semibold ${bitcoin.change >= 0 ? 'text-green-500' : 'text-red-500'}`}
                  >
                     {bitcoin.change.toFixed(2)}%
                  </span>
               </div>
            </div>
         </div>

         {/* Cards de resumo */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
               <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
                  Valor Total da Carteira
               </h3>
               <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                  R${' '}
                  {dashboardData.portfolioValue.toLocaleString('pt-BR', {
                     minimumFractionDigits: 2,
                  })}
               </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
               <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
                  Alertas
               </h3>
               <ul className="list-disc list-inside space-y-2">
                  {alerts.length > 0 ? (
                     alerts.map((alert) => (
                        <li
                           key={alert.id}
                           className="text-sm text-gray-800 dark:text-gray-200"
                        >
                           <span
                              className={`font-semibold ${alert.type === 'preço' ? 'text-blue-500' : alert.type === 'dividendo' ? 'text-green-500' : 'text-purple-500'}`}
                           >
                              [{alert.type.toUpperCase()}]
                           </span>{' '}
                           {alert.message}
                        </li>
                     ))
                  ) : (
                     <li className="text-sm text-gray-500">
                        Nenhum alerta recente.
                     </li>
                  )}
               </ul>
            </div>
         </div>

         {/* Gráficos */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
               <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  Evolução do Patrimônio
               </h3>
               <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dashboardData.portfolioEvolution}>
                     <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#e2e8f0"
                        className="dark:stroke-gray-600"
                     />
                     <XAxis
                        dataKey="month"
                        stroke="#6b7280"
                        className="dark:stroke-gray-400"
                     />
                     <YAxis stroke="#6b7280" className="dark:stroke-gray-400" />
                     <Tooltip
                        contentStyle={{
                           backgroundColor: 'white',
                           border: 'none',
                           borderRadius: '8px',
                        }}
                        itemStyle={{ color: '#1a202c' }}
                     />
                     <Legend />
                     <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#8884d8"
                        name="Patrimônio"
                        activeDot={{ r: 8 }}
                     />
                  </LineChart>
               </ResponsiveContainer>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
               <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                  Composição da Carteira
               </h3>
               <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                     <Pie
                        data={dashboardData.portfolioComposition}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                     >
                        {dashboardData.portfolioComposition.map(
                           (entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                           ),
                        )}
                     </Pie>
                     <Tooltip
                        contentStyle={{
                           backgroundColor: 'white',
                           border: 'none',
                           borderRadius: '8px',
                        }}
                        itemStyle={{ color: '#1a202c' }}
                     />
                     <Legend />
                  </PieChart>
               </ResponsiveContainer>
            </div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {stocksComposition.length > 0 && (
               <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                     Composição de Ações
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                     <PieChart>
                        <Pie
                           data={stocksComposition}
                           cx="50%"
                           cy="50%"
                           labelLine={false}
                           outerRadius={80}
                           fill="#3182CE"
                           dataKey="value"
                           nameKey="name"
                        >
                           {stocksComposition.map((entry, index) => (
                              <Cell
                                 key={`cell-stocks-${index}`}
                                 fill={entry.color}
                              />
                           ))}
                        </Pie>
                        <Tooltip
                           contentStyle={{
                              backgroundColor: 'white',
                              border: 'none',
                              borderRadius: '8px',
                           }}
                           itemStyle={{ color: '#1a202c' }}
                        />
                        <Legend />
                     </PieChart>
                  </ResponsiveContainer>
               </div>
            )}
            {fiisComposition.length > 0 && (
               <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                     Composição de FIIs
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                     <PieChart>
                        <Pie
                           data={fiisComposition}
                           cx="50%"
                           cy="50%"
                           labelLine={false}
                           outerRadius={80}
                           fill="#48BB78"
                           dataKey="value"
                           nameKey="name"
                        >
                           {fiisComposition.map((entry, index) => (
                              <Cell
                                 key={`cell-fiis-${index}`}
                                 fill={entry.color}
                              />
                           ))}
                        </Pie>
                        <Tooltip
                           contentStyle={{
                              backgroundColor: 'white',
                              border: 'none',
                              borderRadius: '8px',
                           }}
                           itemStyle={{ color: '#1a202c' }}
                        />
                        <Legend />
                     </PieChart>
                  </ResponsiveContainer>
               </div>
            )}
         </div>
      </div>
   );
};

const PortfolioPage = ({ activePortfolioId }) => {
   const [data, setData] = useState(null);
   const [loading, setLoading] = useState(true);
   const [analysis, setAnalysis] = useState('');
   const [suggestions, setSuggestions] = useState('');
   const [loadingAnalysis, setLoadingAnalysis] = useState(false);
   const [loadingSuggestions, setLoadingSuggestions] = useState(false);

   useEffect(() => {
      const fetchData = async () => {
         setLoading(true);
         const portfolioData =
            await fakeApi.getPortfolioData(activePortfolioId);
         setData(portfolioData);
         setLoading(false);
      };
      fetchData();
   }, [activePortfolioId]);

   const handleAnalyzePortfolio = async () => {
      setLoadingAnalysis(true);
      const result = await fakeApi.analyzePortfolio(data);
      setAnalysis(result);
      setLoadingAnalysis(false);
   };

   const handleSuggestAssets = async () => {
      setLoadingSuggestions(true);
      const result = await fakeApi.suggestAssets(data);
      setSuggestions(result);
      setLoadingSuggestions(false);
   };

   if (loading)
      return (
         <div className="text-center mt-8 text-gray-800 dark:text-gray-200">
            Carregando carteira...
         </div>
      );
   if (!data)
      return (
         <div className="text-center mt-8 text-red-500">
            Erro ao carregar a carteira.
         </div>
      );

   const categories = [...new Set(data.map((asset) => asset.category))];

   const calculateProfitLoss = (asset) => {
      const cost = asset.quantity * asset.averagePrice;
      const value = asset.quantity * asset.currentPrice;
      return value - cost;
   };

   return (
      <div className="space-y-8">
         <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            Minha Carteira
         </h2>
         <div className="flex space-x-4">
            <button
               onClick={handleAnalyzePortfolio}
               className="px-6 py-3 bg-indigo-500 text-white rounded-md shadow-md hover:bg-indigo-600 transition-colors"
               disabled={loadingAnalysis}
            >
               {loadingAnalysis ? 'Analisando...' : 'Análise da Carteira ✨'}
            </button>
            <button
               onClick={handleSuggestAssets}
               className="px-6 py-3 bg-indigo-500 text-white rounded-md shadow-md hover:bg-indigo-600 transition-colors"
               disabled={loadingSuggestions}
            >
               {loadingSuggestions ? 'Sugerindo...' : 'Sugestão de Ativos ✨'}
            </button>
         </div>

         {(analysis || suggestions) && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
               {analysis && (
                  <div
                     className="text-gray-800 dark:text-white prose max-w-none"
                     dangerouslySetInnerHTML={{
                        __html: analysis.replace(/\n/g, '<br />'),
                     }}
                  ></div>
               )}
               {suggestions && (
                  <div
                     className="text-gray-800 dark:text-white prose max-w-none"
                     dangerouslySetInnerHTML={{
                        __html: suggestions.replace(/\n/g, '<br />'),
                     }}
                  ></div>
               )}
            </div>
         )}

         {categories.map((category) => (
            <div key={category} className="space-y-4">
               <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
                  {category}
               </h3>
               <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                     <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Ativo
                           </th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Tipo
                           </th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Quantidade
                           </th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Preço Médio
                           </th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Preço Atual
                           </th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              Valor Atual
                           </th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                              P&L
                           </th>
                        </tr>
                     </thead>
                     <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {data
                           .filter((asset) => asset.category === category)
                           .map((asset) => (
                              <tr key={asset.id}>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                    {asset.symbol}
                                 </td>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {asset.type}
                                 </td>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {asset.quantity}
                                 </td>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    R$ {asset.averagePrice.toFixed(2)}
                                 </td>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    R$ {asset.currentPrice.toFixed(2)}
                                 </td>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    R${' '}
                                    {(
                                       asset.quantity * asset.currentPrice
                                    ).toFixed(2)}
                                 </td>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <span
                                       className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${calculateProfitLoss(asset) >= 0 ? 'bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100'}`}
                                    >
                                       R${' '}
                                       {calculateProfitLoss(asset).toFixed(2)}
                                    </span>
                                 </td>
                              </tr>
                           ))}
                     </tbody>
                  </table>
               </div>
            </div>
         ))}
      </div>
   );
};

const TransactionsPage = ({ activePortfolioId }) => {
   const [data, setData] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchData = async () => {
         setLoading(true);
         const transactionsData =
            await fakeApi.getTransactions(activePortfolioId);
         setData(transactionsData);
         setLoading(false);
      };
      fetchData();
   }, [activePortfolioId]);

   if (loading)
      return (
         <div className="text-center mt-8 text-gray-800 dark:text-gray-200">
            Carregando transações...
         </div>
      );
   if (!data)
      return (
         <div className="text-center mt-8 text-red-500">
            Erro ao carregar as transações.
         </div>
      );

   return (
      <div className="space-y-8">
         <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            Movimentações
         </h2>
         <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
               <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Data
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Tipo
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Ativo
                     </th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Valor
                     </th>
                  </tr>
               </thead>
               <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {data.map((transaction) => (
                     <tr key={transaction.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                           {transaction.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                           {transaction.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                           {transaction.asset || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                           R${' '}
                           {(
                              transaction.price * transaction.quantity ||
                              transaction.value
                           ).toFixed(2)}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   );
};

const ReportsPage = ({ activePortfolioId }) => {
   const [data, setData] = useState(null);
   const [loading, setLoading] = useState(true);
   const months = [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
   ];

   useEffect(() => {
      const fetchData = async () => {
         setLoading(true);
         const dividendsData =
            await fakeApi.getDividendsData(activePortfolioId);
         setData(dividendsData);
         setLoading(false);
      };
      fetchData();
   }, [activePortfolioId]);

   if (loading)
      return (
         <div className="text-center mt-8 text-gray-800 dark:text-gray-200">
            Carregando relatórios...
         </div>
      );
   if (!data || data.length === 0)
      return (
         <div className="text-center mt-8 text-red-500">
            Nenhum dado de dividendo encontrado para esta carteira.
         </div>
      );

   const calculateTotal = (dividends, month) => {
      return dividends.reduce(
         (sum, dividend) => sum + (dividend[month] || 0),
         0,
      );
   };

   const calculateTotalAsset = (asset) => {
      return months.reduce((sum, month) => sum + (asset[month] || 0), 0);
   };

   const totalMonths = months.map((month) => ({
      month,
      total: calculateTotal(data, month),
   }));
   const totalReceived = totalMonths.reduce(
      (sum, month) => sum + month.total,
      0,
   );

   return (
      <div className="space-y-8">
         <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            Relatórios
         </h2>
         <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md overflow-x-auto">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
               Dividendos Recebidos por Ativo (mensal)
            </h3>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
               <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Ativo
                     </th>
                     {months.map((month) => (
                        <th
                           key={month}
                           className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                        >
                           {month}
                        </th>
                     ))}
                     <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Total
                     </th>
                  </tr>
               </thead>
               <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {data.map((dividend, index) => (
                     <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                           {dividend.asset}
                        </td>
                        {months.map((month) => (
                           <td
                              key={`${dividend.asset}-${month}`}
                              className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center"
                           >
                              {dividend[month]
                                 ? `R$ ${dividend[month].toFixed(2)}`
                                 : '-'}
                           </td>
                        ))}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white text-center">
                           R$ {calculateTotalAsset(dividend).toFixed(2)}
                        </td>
                     </tr>
                  ))}
                  <tr className="bg-gray-200 dark:bg-gray-700 font-bold">
                     <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                        Total
                     </td>
                     {totalMonths.map((monthData) => (
                        <td
                           key={monthData.month}
                           className="px-6 py-4 text-sm text-gray-900 dark:text-white text-center"
                        >
                           R$ {monthData.total.toFixed(2)}
                        </td>
                     ))}
                     <td className="px-6 py-4 text-sm text-gray-900 dark:text-white text-center">
                        R$ {totalReceived.toFixed(2)}
                     </td>
                  </tr>
               </tbody>
            </table>
         </div>
      </div>
   );
};

const GoalsPage = ({ activePortfolioId }) => {
   const [data, setData] = useState(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchData = async () => {
         setLoading(true);
         const goalsData = await fakeApi.getGoals(activePortfolioId);
         setData(goalsData);
         setLoading(false);
      };
      fetchData();
   }, [activePortfolioId]);

   if (loading)
      return (
         <div className="text-center mt-8 text-gray-800 dark:text-gray-200">
            Carregando metas...
         </div>
      );
   if (!data || data.length === 0)
      return (
         <div className="text-center mt-8 text-red-500">
            Nenhuma meta encontrada para esta carteira.
         </div>
      );

   const calculateProgress = (goal) =>
      (goal.currentValue / goal.targetValue) * 100;

   return (
      <div className="space-y-8">
         <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            Minhas Metas
         </h2>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((goal) => (
               <div
                  key={goal.id}
                  className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md"
               >
                  <h3 className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                     {goal.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">
                     {goal.description}
                  </p>
                  <div className="mt-4">
                     <div className="flex justify-between text-sm text-gray-800 dark:text-gray-200">
                        <span>
                           R$ {goal.currentValue.toLocaleString('pt-BR')}
                        </span>
                        <span>
                           R$ {goal.targetValue.toLocaleString('pt-BR')}
                        </span>
                     </div>
                     <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mt-2">
                        <div
                           className="bg-indigo-600 h-2.5 rounded-full"
                           style={{ width: `${calculateProgress(goal)}%` }}
                        ></div>
                     </div>
                     <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        Progresso: {calculateProgress(goal).toFixed(0)}%
                     </p>
                     <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Data Limite: {goal.deadline}
                     </p>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
};

const NewTransactionPage = () => {
   const [type, setType] = useState('Compra');
   const [asset, setAsset] = useState('');
   const [quantity, setQuantity] = useState('');
   const [price, setPrice] = useState('');
   const [value, setValue] = useState('');
   const [date, setDate] = useState('');
   const [message, setMessage] = useState(null);

   const handleSubmit = async (e) => {
      e.preventDefault();
      setMessage(null);

      let transactionData = {
         type,
         asset,
         date,
      };

      if (type === 'Dividendo') {
         transactionData = {
            ...transactionData,
            value: parseFloat(value),
         };
      } else {
         transactionData = {
            ...transactionData,
            quantity: parseFloat(quantity),
            price: parseFloat(price),
         };
      }

      try {
         // Simula a chamada para a API de criação de transação
         const response = await fakeApi.createTransaction(transactionData);
         setMessage({ text: response.message, type: 'success' });
         // Limpar formulário após o sucesso
         setAsset('');
         setQuantity('');
         setPrice('');
         setValue('');
         setDate('');
      } catch (error) {
         setMessage({ text: 'Erro ao registrar a transação.', type: 'error' });
      }
   };

   return (
      <div className="space-y-8">
         <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            Nova Transação
         </h2>
         <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-4">
               <div>
                  <label
                     className="block text-gray-700 dark:text-gray-200 font-semibold mb-2"
                     htmlFor="type"
                  >
                     Tipo de Operação
                  </label>
                  <select
                     id="type"
                     value={type}
                     onChange={(e) => setType(e.target.value)}
                     className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
                  >
                     <option value="Compra">Compra</option>
                     <option value="Venda">Venda</option>
                     <option value="Dividendo">Dividendo</option>
                  </select>
               </div>
               <div>
                  <label
                     className="block text-gray-700 dark:text-gray-200 font-semibold mb-2"
                     htmlFor="date"
                  >
                     Data
                  </label>
                  <input
                     id="date"
                     type="date"
                     value={date}
                     onChange={(e) => setDate(e.target.value)}
                     className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
                     required
                  />
               </div>
               <div>
                  <label
                     className="block text-gray-700 dark:text-gray-200 font-semibold mb-2"
                     htmlFor="asset"
                  >
                     Ativo
                  </label>
                  <input
                     id="asset"
                     type="text"
                     placeholder="Ex: PETR4"
                     value={asset}
                     onChange={(e) => setAsset(e.target.value)}
                     className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
                     required
                  />
               </div>
               {type !== 'Dividendo' ? (
                  <>
                     <div>
                        <label
                           className="block text-gray-700 dark:text-gray-200 font-semibold mb-2"
                           htmlFor="quantity"
                        >
                           Quantidade
                        </label>
                        <input
                           id="quantity"
                           type="number"
                           placeholder="Ex: 100"
                           value={quantity}
                           onChange={(e) => setQuantity(e.target.value)}
                           className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
                           required
                        />
                     </div>
                     <div>
                        <label
                           className="block text-gray-700 dark:text-gray-200 font-semibold mb-2"
                           htmlFor="price"
                        >
                           Preço Unitário
                        </label>
                        <input
                           id="price"
                           type="number"
                           step="0.01"
                           placeholder="Ex: 28.50"
                           value={price}
                           onChange={(e) => setPrice(e.target.value)}
                           className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
                           required
                        />
                     </div>
                  </>
               ) : (
                  <div>
                     <label
                        className="block text-gray-700 dark:text-gray-200 font-semibold mb-2"
                        htmlFor="value"
                     >
                        Valor Recebido
                     </label>
                     <input
                        id="value"
                        type="number"
                        step="0.01"
                        placeholder="Ex: 250.00"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
                        required
                     />
                  </div>
               )}
               {message && (
                  <div
                     className={`p-3 rounded-md text-sm ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                  >
                     {message.text}
                  </div>
               )}
               <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:shadow-outline transition-colors"
               >
                  Registrar Transação
               </button>
            </form>
         </div>
      </div>
   );
};

// Componente principal que usa o contexto de autenticação
const App = () => {
   return (
      <AuthProvider>
         <ThemeProvider>
            <ProtectedRoute>
               <Layout />
            </ProtectedRoute>
         </ThemeProvider>
      </AuthProvider>
   );
};

export default App;
