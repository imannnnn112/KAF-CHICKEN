import React, { useState } from 'react';
import { Flame, Lock, User, ArrowRight, CheckCircle2, Utensils } from 'lucide-react';
import { usePOS } from '../context/POSContext';

export const LoginView: React.FC = () => {
  const { login } = usePOS();
  const [username, setUsername] = useState('kasir');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Silakan masukkan username');
      return;
    }
    const success = login(username, password);
    if (!success) {
      setError('Username atau password tidak valid');
    }
  };

  const handleQuickLogin = (role: 'kasir' | 'admin') => {
    if (role === 'kasir') {
      setUsername('kasir');
      setPassword('123456');
      login('kasir', '123456');
    } else {
      setUsername('admin');
      setPassword('admin123');
      login('admin', 'admin123');
    }
  };

  return (
    <div className="min-h-screen w-full bg-zinc-950 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-mono text-zinc-100">
      {/* Subtle grid and ambient backdrop */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a15_1px,transparent_1px),linear-gradient(to_bottom,#27272a15_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-zinc-900 rounded-xl shadow-2xl overflow-hidden border border-zinc-800 relative z-10">
        {/* Technical Brand Header */}
        <div className="bg-zinc-950 p-6 text-center border-b border-zinc-800 relative">
          <div className="w-12 h-12 mx-auto bg-zinc-900 border border-zinc-800 rounded-lg shadow-inner flex items-center justify-center mb-3">
            <Flame className="w-6 h-6 fill-red-500 text-red-500" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded border border-red-500/30 bg-red-950/40 text-[10px] text-red-400 font-bold uppercase mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            SYS_GATEWAY // AUTH_PORTAL
          </div>

          <h1 className="text-base font-black tracking-wider text-zinc-100 uppercase">
            KAF <span className="text-red-500">CHICKEN</span> POS
          </h1>
          <p className="text-[10px] text-zinc-500 mt-0.5 tracking-widest uppercase">
            FAST_FOOD_TERMINAL_NODE // v2.4.0
          </p>
        </div>

        {/* Login Form Body */}
        <div className="p-5 sm:p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {error && (
              <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-800/80 text-[11px] font-bold text-red-400 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                <span>ERR_AUTH: {error}</span>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                OPERATOR_USERNAME
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  id="login-username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError('');
                  }}
                  placeholder="kasir / admin"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 focus:border-red-500 text-xs font-mono text-zinc-100 transition-all outline-hidden"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                PASSCODE_KEY
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  id="login-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 focus:border-red-500 text-xs font-mono text-zinc-100 transition-all outline-hidden"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              id="btn-login-submit"
              className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg border border-red-500/60 shadow-xs active:scale-98 transition-all flex items-center justify-center gap-2 mt-2 uppercase cursor-pointer"
            >
              <span>ACCESS_TERMINAL</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick Demo Accounts */}
          <div className="pt-4 border-t border-zinc-800">
            <p className="text-[10px] font-bold text-zinc-500 text-center uppercase tracking-wider mb-2">
              QUICK_DEMO_CREDENTIALS:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="btn-quick-login-kasir"
                onClick={() => handleQuickLogin('kasir')}
                className="py-2 px-2.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3 h-3 text-amber-400" />
                <span>KASIR (BUDI)</span>
              </button>
              <button
                type="button"
                id="btn-quick-login-admin"
                onClick={() => handleQuickLogin('admin')}
                className="py-2 px-2.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3 h-3 text-red-400" />
                <span>ADMIN (SITI)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-zinc-950 px-4 py-2.5 border-t border-zinc-800 text-center">
          <p className="text-[10px] text-zinc-500">
            KAF_CHICKEN_POS // NODE_STATUS: OPERATIONAL
          </p>
        </div>
      </div>
    </div>
  );
};
