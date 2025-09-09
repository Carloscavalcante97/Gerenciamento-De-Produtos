import { ReactNode } from 'react';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen">
      <main className="pb-6">
        {children}
      </main>
    </div>
  );
}