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
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--background)' }}>
      {/* Sidebar — glass */}
      <aside
        className="glass-elevated relative z-20 flex w-80 flex-col border-r-0"
        style={{ borderRadius: '0 1rem 1rem 0', margin: '0.75rem 0 0.75rem 0' }}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/20">
            <Layers className="h-5 w-5 text-indigo-400" />
          </div>
          <span className="text-lg font-semibold tracking-tight" style={{ color: 'var(--foreground)' }}>
            Meridian
          </span>
        </div>

        {/* Nav */}
        <nav className="mt-2 flex-1 space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                prefetch
                className="glass-surface flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
                style={{ color: 'var(--text-soft)' }}
              >
                <Icon className="h-4 w-4 opacity-70" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t px-4 py-4" style={{ borderColor: 'var(--glass-border)' }}>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Meridian Platform v1.0
          </p>
        </div>
      </aside>

      {/* Main Content — liquid-glass shell */}
      <div
        className="flex flex-1 flex-col overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.03) 0%, rgba(255,255,255,0) 50%, rgba(99,102,241,0.02) 100%)',
        }}
      >
        {/* Header — frosted glass */}
        <header
          className="glass-strong z-10 mx-4 mt-3 flex h-14 items-center justify-between px-6"
          style={{ borderRadius: '1rem' }}
        >
          <h1 className="text-lg font-semibold tracking-tight" style={{ color: 'var(--foreground)' }}>
            Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
              {user ? `${user.firstName} ${user.lastName} (${user.role})` : 'Guest'}
            </span>
            <button
              onClick={() => {
                logout();
                localStorage.removeItem('meridian_token');
                router.push('/login');
              }}
              className="glass-surface rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 hover:scale-105"
              style={{ color: 'var(--accent)' }}
            >
              Sign out
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}