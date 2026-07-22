'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { LockKey, EnvelopeSimple, WarningCircle, Eye, EyeSlash, ArrowRight } from '@phosphor-icons/react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      {/* Dynamic Ambient Backlight Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#FFF_1px,transparent_1px)] [background-size:20px_20px]" />
      
      <div className="w-full max-w-md bg-surface/90 backdrop-blur-xl border border-border/80 shadow-2xl rounded-3xl p-8 md:p-10 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl border border-border/60 flex items-center justify-center mb-5 p-3">
            <img src="/assets/logo/favicon.svg" className="w-full h-full object-contain" alt="NOMSYS" />
          </div>
          <h1 className="text-3xl font-display font-black uppercase tracking-tight text-foreground leading-none mb-2">NOMSYS</h1>
          <p className="text-xs font-bold text-muted uppercase tracking-widest">Khusus Nu Boga Akses</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-950/30 border border-red-500/30 text-red-400 flex items-center gap-3 rounded-2xl animate-shake">
            <WarningCircle weight="fill" size={20} className="text-red-400 shrink-0" />
            <p className="text-xs font-bold uppercase tracking-wider">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted/90 block">Akses Admin</label>
            <div className="flex items-center gap-3 px-4 py-3.5 border border-white/20 hover:border-white/40 rounded-2xl focus-within:!border-accent focus-within:ring-1 focus-within:ring-accent/40 transition-all group">
              <EnvelopeSimple weight="bold" size={20} className="text-muted group-focus-within:text-accent transition-colors shrink-0" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full !bg-transparent text-foreground text-sm font-medium placeholder:text-muted/40 focus:outline-none !border-none !p-0 shadow-none ring-0 outline-none"
                placeholder="Asupkeun email admin"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted/90 block">Kunci Rahasia</label>
            <div className="flex items-center gap-3 px-4 py-3.5 border border-white/20 hover:border-white/40 rounded-2xl focus-within:!border-accent focus-within:ring-1 focus-within:ring-accent/40 transition-all group">
              <LockKey weight="bold" size={20} className="text-muted group-focus-within:text-accent transition-colors shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="flex-1 min-w-0 !bg-transparent text-foreground text-sm font-medium placeholder:text-muted/40 focus:outline-none !border-none !p-0 shadow-none ring-0 outline-none"
                placeholder="Asupkeun sandi"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-muted hover:text-foreground transition-colors p-1 cursor-pointer focus:outline-none shrink-0"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeSlash weight="bold" size={18} />
                ) : (
                  <Eye weight="bold" size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-2 bg-accent hover:bg-accent/90 text-white border-accent border rounded-2xl font-black uppercase text-sm tracking-wider shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>GAS ASUP!</span>
                <ArrowRight weight="bold" size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
