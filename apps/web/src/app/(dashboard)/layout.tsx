'use client';

import { useAuthStore } from '@/stores/auth.store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BarChart3, Activity, AlertTriangle, GitCompare, Layers } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { href: '/dashboard', label: 'Executive Overview', icon: Activity },
  { href: '/dashboard/jobs', label: 'Integration Jobs', icon: Layers },
  { href: '/dashboard/dlq', label: 'Dead Letter Queue', icon: AlertTriangle },
  { href: '/dashboard/reconciliation', label: 'Reconciliation', icon: GitCompare },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  return (
    <div className="relative flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Radiant Background Orbs */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob dark:mix-blend-screen dark:opacity-20 z-0"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-fuchsia-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 dark:mix-blend-screen dark:opacity-20 z-0"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-violet-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 dark:mix-blend-screen dark:opacity-20 z-0"></div>
      
      {/* Sidebar — glass */}
      <aside
        className="glass-elevated relative z-20 flex w-80 flex-col border-r-0"
        style={{ borderRadius: '0 1rem 1rem 0', margin: '0.75rem 0 0.75rem 0' }}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]">
            <Layers className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
            Meridian
          </span>
        </div>

        {/* Nav */}
        <nav className="mt-2 flex-1 space-y-2 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                prefetch
                className="group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 transition-all duration-300 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 overflow-hidden"
              >
                <div className="absolute inset-0 bg-indigo-500/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-xl" />
                <Icon className="h-5 w-5 opacity-70 transition-transform duration-300 group-hover:scale-110 group-hover:opacity-100" />
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 px-6 py-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Meridian Platform v1.0
            </p>
            <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
          </div>
        </div>
      </aside>

      {/* Main Content — liquid-glass shell */}
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        {/* Header — frosted glass */}
        <header
          className="glass-strong mx-6 mt-4 flex h-16 items-center justify-between px-6 shadow-sm backdrop-blur-xl"
          style={{ borderRadius: '1.25rem' }}
        >
          <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">
            Overview
          </h1>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-fuchsia-500 shadow-[0_0_15px_rgba(99,102,241,0.4)]" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                {user ? `${user.firstName} ${user.lastName}` : 'Guest User'}
              </span>
            </div>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
            <button
              onClick={() => {
                logout();
                localStorage.removeItem('meridian_token');
                router.push('/login');
              }}
              className="text-sm font-semibold text-rose-500 transition-colors hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300"
            >
              Sign out
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}