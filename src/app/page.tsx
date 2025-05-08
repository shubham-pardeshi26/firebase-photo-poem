import AppHeader from '@/components/photo-poet/AppHeader';
import PhotoPoetClient from '@/components/photo-poet/PhotoPoetClient';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-background text-foreground">
      <AppHeader />
      <main className="container mx-auto px-4 py-8 flex-grow w-full">
        <PhotoPoetClient />
      </main>
      <footer className="w-full text-center py-6 text-sm text-muted-foreground border-t">
        <p>Photo Poet &copy; {new Date().getFullYear()}</p>
        <p>Evoke emotion with every snapshot.</p>
      </footer>
    </div>
  );
}
