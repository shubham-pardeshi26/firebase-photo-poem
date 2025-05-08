"use client";

import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, UploadCloud, AlertCircle, Wand2 } from 'lucide-react';
import { generatePoemAction } from '@/app/actions';
import PoemDisplay from './PoemDisplay';

export default function PhotoPoetClient() {
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [poem, setPoem] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        setError("File is too large. Maximum size is 4MB.");
        setImageDataUrl(null);
        setFileName(null);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageDataUrl(reader.result as string);
        setPoem(null);
        setError(null);
        setFileName(file.name);
      };
      reader.onerror = () => {
        setError("Failed to read the file.");
        setImageDataUrl(null);
        setFileName(null);
      }
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!imageDataUrl) {
      setError("Please upload a photo first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setPoem(null);

    try {
      const result = await generatePoemAction({ photoDataUri: imageDataUrl });
      setPoem(result.poem);
    } catch (e) {
      console.error(e);
      setError((e as Error).message || "An unexpected error occurred while generating the poem.");
      setPoem(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-serif text-center text-primary">Unleash Poetry from Your Photos</CardTitle>
          <CardDescription className="text-center text-muted-foreground text-lg">
            Upload a photo and let our AI craft a unique poem inspired by its essence.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="photo-upload" className="text-lg font-semibold">Upload Your Photo</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file:text-accent-foreground file:bg-accent hover:file:bg-accent/90 file:font-semibold file:py-2 file:px-4 file:rounded-md file:border-0 cursor-pointer"
                  aria-describedby="photo-upload-help"
                />
                <Button type="button" variant="outline" size="icon" onClick={() => document.getElementById('photo-upload')?.click()} title="Upload Photo">
                  <UploadCloud className="h-5 w-5" />
                </Button>
              </div>
              {fileName && <p className="text-sm text-muted-foreground">Selected file: {fileName}</p>}
              <p id="photo-upload-help" className="text-sm text-muted-foreground">
                Max file size: 4MB. Supported formats: JPG, PNG, GIF, WEBP.
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={isLoading || !imageDataUrl} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-3 text-lg font-semibold">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Poem...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-5 w-5" />
                  Generate Poem
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {imageDataUrl && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-serif flex items-center">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-6 w-6 text-primary"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>
                Uploaded Photo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                <Image
                  src={imageDataUrl}
                  alt="Uploaded photo"
                  layout="fill"
                  objectFit="contain"
                  className="transition-opacity duration-500 opacity-0"
                  onLoadingComplete={(image) => image.classList.remove('opacity-0')}
                  data-ai-hint="uploaded image"
                />
              </div>
            </CardContent>
          </Card>
        )}
        
        {isLoading && !poem && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-serif flex items-center">
                <Loader2 className="mr-2 h-6 w-6 animate-spin text-primary" />
                Generating...
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
              <p className="text-muted-foreground">The AI muse is at work, please wait...</p>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary animate-pulse" style={{ width: '100%', animationDuration: '1.5s' }}></div>
              </div>
            </CardContent>
          </Card>
        )}

        {poem && <PoemDisplay poem={poem} />}
      </div>
    </div>
  );
}
