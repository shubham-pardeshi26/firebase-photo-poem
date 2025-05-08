import { Feather } from 'lucide-react';

export default function AppHeader() {
  return (
    <header className="w-full py-6 bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 flex items-center justify-center">
        <Feather className="h-10 w-10 mr-3" />
        <h1 className="text-4xl font-serif font-bold">
          Photo Poet
        </h1>
      </div>
    </header>
  );
}
