// src/app/admin/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { auth, db } from '@/lib/firebase'; 
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const navItems = [
  { label: 'Dashboard',  href: '/admin',         exact: true },
  { label: 'Libri',      href: '/admin/libri' },
  { label: 'Autori',     href: '/admin/autori' },
  { label: 'Collane',    href: '/admin/collane' },
  { label: 'Eventi',     href: '/admin/eventi' },
  { label: 'Forum',      href: '/admin/forum' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser]       = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router   = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        if (pathname !== '/admin/login') {
          router.replace('/admin/login');
        } else {
          setLoading(false);
        }
        return;
      }

      try {
        const userRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userRef);

        const isAdmin = userDoc.exists() && userDoc.data().role === 'admin';
        if (isAdmin) {
          setUser(currentUser);
          if (pathname === '/admin/login') {
            router.replace('/admin');
          } else {
            setLoading(false);
          }
        } else {
          await signOut(auth);
          setUser(null);
          router.replace('/');
        }
      } catch (error) {
        await signOut(auth);
        setUser(null);
        router.replace('/');
      }
    });

    return () => unsubscribe();
  }, [pathname, router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/admin/login');
  };

  const isActive = (item: typeof navItems[0]) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f2eb] flex flex-col items-center justify-center gap-4">
        <svg className="w-6 h-6 text-[#9a8e78] animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="font-[family-name:var(--font-josefin)] text-[10px] uppercase tracking-[0.3em] text-[#9a8e78]">
          Verifica Security Clearance...
        </p>
      </div>
    );
  }

  if (!user && pathname !== '/admin/login') return null;
  if (pathname === '/admin/login') return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-[#f5f2eb]">
      <aside className="hidden md:flex w-64 bg-[#f5f2eb] border-r border-[#c9c3b8] flex-col shrink-0">
        <div className="px-8 pt-10 pb-8 border-b border-[#e0dbd0]">
          <Link href="/" className="inline-block mb-1 transition-opacity hover:opacity-60">
            <Image src="/logo-pace.png" alt="Pace Edizioni" width={100} height={100} className="w-24 h-auto object-contain dark:invert" priority />
          </Link>
          <p className="font-[family-name:var(--font-josefin)] text-[9px] uppercase tracking-[0.2em] text-[#c9c3b8] mt-3">
            Area Admin
          </p>
        </div>

        <nav className="flex-1 px-6 py-8 flex flex-col gap-1">
          {navItems.map((item, i) => (
            <Link key={item.href} href={item.href} className={`flex items-center gap-4 px-2 py-2.5 transition-colors group ${isActive(item) ? 'text-[#1a1916]' : 'text-[#c9c3b8] hover:text-[#9a8e78]'}`}>
              <span className="font-[family-name:var(--font-josefin)] text-[8px] tracking-[0.2em] shrink-0 w-5 text-right">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className={`font-[family-name:var(--font-josefin)] text-[10px] uppercase tracking-[0.18em] transition-colors ${isActive(item) ? 'text-[#1a1916]' : ''}`}>
                {item.label}
              </span>
              {isActive(item) && <span className="ml-auto w-1 h-1 bg-[#1a1916] rounded-full shrink-0" />}
            </Link>
          ))}
        </nav>

        <div className="px-8 py-6 border-t border-[#e0dbd0]">
          <p className="font-[family-name:var(--font-josefin)] text-[9px] uppercase tracking-[0.15em] text-[#c9c3b8] truncate mb-3">
            {user?.email}
          </p>
          <button onClick={handleLogout} className="font-[family-name:var(--font-josefin)] text-[9px] uppercase tracking-[0.15em] text-[#c9c3b8] hover:text-red-400 transition-colors">
            Esci →
          </button>
        </div>
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#f5f2eb]/95 backdrop-blur-sm border-b border-[#c9c3b8] flex items-center justify-between px-6 py-4">
        <Image src="/logo-pace.png" alt="Pace Edizioni" width={80} height={80} className="w-20 h-auto object-contain dark:invert" priority />
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-[#1a1916] focus:outline-none" aria-label="Toggle menu">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {sidebarOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-[#f5f2eb] pt-20 px-6 flex flex-col">
          <nav className="flex flex-col gap-6 py-8 border-b border-[#e0dbd0]">
            {navItems.map((item, i) => (
              <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)} className={`flex items-center gap-4 ${isActive(item) ? 'text-[#1a1916]' : 'text-[#c9c3b8]'}`}>
                <span className="font-[family-name:var(--font-josefin)] text-[9px] tracking-[0.2em]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-playfair font-light text-2xl">{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="py-6">
            <p className="font-[family-name:var(--font-josefin)] text-[9px] uppercase tracking-[0.15em] text-[#c9c3b8] mb-3">
              {user?.email}
            </p>
            <button onClick={handleLogout} className="font-[family-name:var(--font-josefin)] text-[9px] uppercase tracking-[0.15em] text-[#c9c3b8] hover:text-red-400 transition-colors">
              Esci →
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 overflow-auto md:pt-0 pt-16">
        {children}
      </main>
    </div>
  );
}