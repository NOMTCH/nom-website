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
      
      <div className="w-full max-w-md bg-surface border border-border shadow-[0_20px_50px_rgba(0,0,0,0.04)] rounded-3xl p-8 md:p-10 relative z-10">
        
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-16 h-16 flex items-center justify-center mb-6">
            <img src="/assets/logo/favicon.svg" className="w-16 h-16" alt="NOMSYS" />
          </div>
          <h1 className="text-4xl font-display font-black uppercase tracking-tighter text-foreground leading-none mb-2">NOMSYS</h1>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Khusus Nu Boga Akses</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border-2 border-red-500 flex items-start gap-3">
            <WarningCircle weight="fill" size={24} className="text-red-500 shrink-0" />
            <p className="text-sm font-bold text-red-600 uppercase">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Akses Admin</label>
            <div className="flex bg-[#F5F5F5] border border-border rounded-xl shadow-sm focus-within:bg-white transition-all group">
              <div className="flex items-center justify-center w-14 border-border bg-surface group-focus-within:bg-white transition-colors">
                <EnvelopeSimple weight="bold" size={24} className="text-foreground" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-4 !bg-transparent font-mono text-sm focus:outline-none !rounded-none !border-0 !shadow-none !ring-0"
                placeholder="Asupkeun email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Kunci Rahasia</label>
            <div className="flex bg-[#F5F5F5] border border-border rounded-xl shadow-sm focus-within:bg-white transition-all group">
              <div className="flex items-center justify-center w-14 border-border bg-surface group-focus-within:bg-white transition-colors">
                <LockKey weight="bold" size={24} className="text-foreground" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-4 !bg-transparent font-mono text-sm focus:outline-none !rounded-none !border-0 !shadow-none !ring-0"
                placeholder="Asupkeun sandi"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-4 bg-accent text-white border-accent border rounded-2xl font-black uppercase shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 hover:shadow-none active:translate-y-0 disabled:opacity-50 flex justify-center"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              'GAS ASUP!'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
