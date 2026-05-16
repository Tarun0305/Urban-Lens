import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import client from '../api/client';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setToken, setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      const res = await client.post('/auth/login', formData);
      setToken(res.data.access_token);
      setUser(res.data.user);
      
      toast.success(`Welcome back, ${res.data.user.full_name}!`);
      
      // Redirect based on role
      const role = res.data.user.role;
      if (role === 'citizen') navigate('/citizen/dashboard');
      else if (role === 'municipal') navigate('/municipal/dashboard');
      else if (role === 'contractor') navigate('/contractor/dashboard');
      else if (role === 'admin') navigate('/admin/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-800 p-10 rounded-3xl border border-gray-200 dark:border-slate-700 shadow-2xl"
      >
        <div className="text-center space-y-2 mb-10">
          <div className="w-16 h-16 bg-primary rounded-2xl mx-auto flex items-center justify-center text-white text-3xl font-black mb-4">UL</div>
          <h1 className="text-3xl font-black">Welcome Back</h1>
          <p className="text-gray-500">Sign in to your UrbanLens account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input
                type="email"
                required
                className="w-full bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="tarun.citizen@test.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input
                type="password"
                required
                className="w-full bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-600 rounded-2xl py-3.5 pl-12 pr-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 shadow-xl shadow-blue-500/20 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : <>Sign In <ArrowRight className="ml-2" size={20} /></>}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-100 dark:border-slate-700 text-center">
           <p className="text-sm text-gray-500">Don't have an account? <span className="text-primary font-bold cursor-pointer hover:underline">Contact your Municipal Body</span></p>
        </div>
      </motion.div>

      {/* Quick Test Info */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-slate-800/50 border border-blue-100 dark:border-slate-700 rounded-2xl">
        <p className="text-xs font-bold text-blue-800 dark:text-blue-300 mb-2 uppercase tracking-wider">Test Credentials:</p>
        <p className="text-xs text-blue-700 dark:text-blue-400">Citizen: tarun.citizen@test.com / password123</p>
        <p className="text-xs text-blue-700 dark:text-blue-400">Municipal: tarun.municipal@test.com / password123</p>
      </div>
    </div>
  );
};

export default Login;
