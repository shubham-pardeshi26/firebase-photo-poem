"use client";

import type { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface PoemDisplayProps {
  poem: string | null;
}

const PoemDisplay: FC<PoemDisplayProps> = ({ poem }) => {
  if (!poem) {
    return null;
  }

  return (
    <Card key={poem} className="animate-in fade-in-50 duration-1000">
      <CardHeader>
        <CardTitle className="flex items-center text-2xl font-serif">
          <FileText className="mr-2 h-6 w-6 text-primary" />
          Generated Poem
        </CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="whitespace-pre-wrap font-sans text-foreground/90 text-lg leading-relaxed">
          {poem}
        </pre>
      </CardContent>
    </Card>
  );
};

export default PoemDisplay;
