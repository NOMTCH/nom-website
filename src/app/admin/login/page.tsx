'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { LockKey, EnvelopeSimple, WarningCircle } from '@phosphor-icons/react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Brutalist Pattern Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#0F0F0F_1px,transparent_1px)] [background-size:16px_16px]" />
      
      <div className="w-full max-w-md bg-surface border-4 border-foreground shadow-[16px_16px_0_0_#0F0F0F] p-8 md:p-10 relative z-10">
        
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 flex items-center justify-center mb-6">
            <img src="/assets/logo/favicon.svg" className="w-16 h-16 " alt="NOMSYS" />
          </div>
          <h1 className="text-4xl font-display font-black uppercase tracking-tighter text-foreground  leading-none mb-2">NOMSYS</h1>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Authorized Personnel Only</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border-2 border-red-500 flex items-start gap-3">
            <WarningCircle weight="fill" size={24} className="text-red-500 shrink-0" />
            <p className="text-sm font-bold text-red-600 uppercase">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-foreground">Admin Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <EnvelopeSimple weight="bold" size={20} className="text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-4 bg-[#F5F5F5] border-2 border-foreground font-mono text-sm focus:outline-none focus:bg-white focus:shadow-[4px_4px_0_0_#0F0F0F] transition-all"
                placeholder="admin@nomstd.studio"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-foreground">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <LockKey weight="bold" size={20} className="text-gray-400" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-4 bg-[#F5F5F5] border-2 border-foreground font-mono text-sm focus:outline-none focus:bg-white focus:shadow-[4px_4px_0_0_#0F0F0F] transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-4 bg-[#F7DF1E] border-4 border-foreground font-black uppercase text-black shadow-[6px_6px_0_0_#0F0F0F] hover:translate-y-1 hover:shadow-[2px_2px_0_0_#0F0F0F] transition-all active:translate-y-2 active:shadow-none disabled:opacity-50 flex justify-center"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'Access System'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
