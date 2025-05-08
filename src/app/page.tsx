
"use client"; // Required for using hooks like useAuth and useRouter

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import AppHeader from '@/components/photo-poet/AppHeader';
import PhotoPoetClient from '@/components/photo-poet/PhotoPoetClient';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg">Loading your poetic experience...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // This is a fallback, middleware and useEffect should handle redirection
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
        <p className="text-lg">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-background text-foreground">
      <AppHeader />
      <main className="container mx-auto px-4 py-8 flex-grow w-full">
        {user && <h2 className="text-2xl font-semibold mb-6 text-center md:text-left">Welcome, <span className="text-accent">{user.email}</span>!</h2>}
        <PhotoPoetClient />
      </main>
      <footer className="w-full text-center py-6 text-sm text-muted-foreground border-t">
        <p>Photo Poet &copy; {new Date().getFullYear()}</p>
        <p>Evoke emotion with every snapshot.</p>
      </footer>
    </div>
  );
}
    