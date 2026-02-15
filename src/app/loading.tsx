import { Sparkles } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="h-16 w-16 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4 animate-pulse">
          <Sparkles className="h-8 w-8 text-primary-foreground" />
        </div>
        <p className="text-muted-foreground animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
