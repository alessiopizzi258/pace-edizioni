// app/admin/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Image from 'next/image';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/admin');
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found') {
        setError('Email o password errati.');
      } else {
        setError('Errore di autenticazione. Riprova.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f2eb] flex items-center justify-center p-6">
      <div className="w-full max-w-sm flex flex-col items-center gap-10">

        {/* Logo */}
        <Image
          src="/logo-pace.png"
          alt="Pace Edizioni"
          width={100}
          height={100}
          className="w-24 h-auto object-contain dark:invert opacity-80"
          priority
        />

        {/* Header */}
        <div className="text-center">
          <span className="font-[family-name:var(--font-josefin)] text-[10px] uppercase tracking-[0.2em] text-[#9a8e78] block mb-3">
            Area riservata
          </span>
          <h1 className="font-playfair font-light text-[clamp(28px,4vw,36px)] tracking-[-0.02em] text-[#1a1916]">
            Accesso
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-8">

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-[family-name:var(--font-josefin)] text-[9px] uppercase tracking-[0.2em] text-[#9a8e78]">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="bg-transparent border-b border-[#c9c3b8] outline-none py-2 font-playfair font-light text-xl text-[#1a1916] focus:border-[#1a1916] transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="font-[family-name:var(--font-josefin)] text-[9px] uppercase tracking-[0.2em] text-[#9a8e78]">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="bg-transparent border-b border-[#c9c3b8] outline-none py-2 font-playfair font-light text-xl text-[#1a1916] focus:border-[#1a1916] transition-colors"
            />
          </div>

          {error && (
            <p className="font-[family-name:var(--font-josefin)] text-[9px] uppercase tracking-[0.15em] text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a1916] text-[#f5f2eb] py-4 font-[family-name:var(--font-josefin)] text-[10px] uppercase tracking-[0.25em] hover:bg-[#3a3630] disabled:bg-[#c9c3b8] disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Accesso in corso...' : 'Accedi →'}
          </button>
        </form>

      </div>
    </main>
  );
}