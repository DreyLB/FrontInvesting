import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogOverlay,
   AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function RegisterPage() {
   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const [error, setError] = useState("");
   const [loading, setLoading] = useState(false);
   const [showSuccessModal, setShowSuccessModal] = useState(false); // 👈
   const { register } = useAuth();
   const navigate = useNavigate();

   const handleRegister = async (e) => {
      e.preventDefault();
      setError("");

      if (password !== confirmPassword) {
         setError("As senhas não coincidem.");
         return;
      }

      setLoading(true);
      const success = await register(name, email, password);
      setLoading(false);

      if (success) {
         setShowSuccessModal(true); // 👈 abre o modal em vez de redirecionar direto
      } else {
         setError("Erro ao criar conta. Tente novamente.");
      }
   };

   return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-[#09090B] font-inter">
         {/* Modal de sucesso */}
         <AlertDialog open={showSuccessModal}>
            <AlertDialogOverlay className="bg-black/50 backdrop-blur-sm" />
            <AlertDialogContent className="bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A]">
               <AlertDialogHeader>
                  <AlertDialogTitle className="text-gray-900 dark:text-[#F4F4F5]">
                     Cadastro realizado com sucesso! 🎉
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-500 dark:text-[#A1A1AA]">
                     Sua conta foi criada. Clique em continuar para fazer seu
                     login.
                  </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                  <AlertDialogAction
                     onClick={() => navigate("/login")}
                     className="bg-gray-900 text-white dark:bg-[#F4F4F5] dark:text-[#09090B] hover:bg-gray-800 dark:hover:bg-[#e4e4e7]"
                  >
                     Continuar para o login
                  </AlertDialogAction>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>

         {/* Formulário — igual ao anterior */}
         <div className="w-full max-w-sm p-8 bg-white dark:bg-[#18181B] border border-gray-200 dark:border-[#27272A] rounded-xl shadow-sm">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-[#F4F4F5] mb-2">
               Criar conta
            </h2>
            <p className="text-center text-sm text-gray-500 dark:text-[#A1A1AA] mb-8">
               Preencha os dados abaixo para se registrar
            </p>

            <form onSubmit={handleRegister} className="space-y-5">
               <div>
                  <label
                     className="block text-gray-700 dark:text-[#F4F4F5] text-sm font-semibold mb-2"
                     htmlFor="name"
                  >
                     Nome
                  </label>
                  <input
                     className="w-full px-4 py-2.5 text-gray-900 dark:text-[#F4F4F5] bg-white dark:bg-[#09090B] border border-gray-300 dark:border-[#27272A] rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-[#A1A1AA] transition-colors"
                     id="name"
                     type="text"
                     placeholder="Seu nome completo"
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                     required
                  />
               </div>

               <div>
                  <label
                     className="block text-gray-700 dark:text-[#F4F4F5] text-sm font-semibold mb-2"
                     htmlFor="email"
                  >
                     Email
                  </label>
                  <input
                     className="w-full px-4 py-2.5 text-gray-900 dark:text-[#F4F4F5] bg-white dark:bg-[#09090B] border border-gray-300 dark:border-[#27272A] rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-[#A1A1AA] transition-colors"
                     id="email"
                     type="email"
                     placeholder="seuemail@exemplo.com"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     required
                  />
               </div>

               <div>
                  <label
                     className="block text-gray-700 dark:text-[#F4F4F5] text-sm font-semibold mb-2"
                     htmlFor="password"
                  >
                     Senha
                  </label>
                  <input
                     className="w-full px-4 py-2.5 text-gray-900 dark:text-[#F4F4F5] bg-white dark:bg-[#09090B] border border-gray-300 dark:border-[#27272A] rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-[#A1A1AA] transition-colors"
                     id="password"
                     type="password"
                     placeholder="••••••••"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     required
                  />
               </div>

               <div>
                  <label
                     className="block text-gray-700 dark:text-[#F4F4F5] text-sm font-semibold mb-2"
                     htmlFor="confirmPassword"
                  >
                     Confirmar Senha
                  </label>
                  <input
                     className="w-full px-4 py-2.5 text-gray-900 dark:text-[#F4F4F5] bg-white dark:bg-[#09090B] border border-gray-300 dark:border-[#27272A] rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-[#A1A1AA] transition-colors"
                     id="confirmPassword"
                     type="password"
                     placeholder="••••••••"
                     value={confirmPassword}
                     onChange={(e) => setConfirmPassword(e.target.value)}
                     required
                  />
               </div>

               {error && (
                  <p className="text-red-500 dark:text-red-400 text-sm">
                     {error}
                  </p>
               )}

               <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 bg-gray-900 text-white dark:bg-[#F4F4F5] dark:text-[#09090B] font-bold py-3 px-4 rounded-lg hover:bg-gray-800 dark:hover:bg-[#e4e4e7] focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
               >
                  {loading ? "Criando conta..." : "Criar conta"}
               </button>

               <p className="text-center text-sm text-gray-500 dark:text-[#A1A1AA]">
                  Já tem uma conta?{" "}
                  <Link
                     to="/login"
                     className="font-semibold text-gray-900 dark:text-[#F4F4F5] hover:underline"
                  >
                     Entrar
                  </Link>
               </p>
            </form>
         </div>
      </div>
   );
}
