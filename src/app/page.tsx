
"use client";

import { useState } from 'react';
import ImageUploadForm from '@/components/features/image-verse/ImageUploadForm';
import PoemCard from '@/components/features/image-verse/PoemCard';
import { Button } from '@/components/ui/button';
import { Loader2, Wand2 } from 'lucide-react';
import { generatePoemFromImage, type GeneratePoemFromImageInput } from '@/ai/flows/generate-poem-from-image';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function HomePage() {
  const [imageDataUri, setImageDataUri] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [generatedPoem, setGeneratedPoem] = useState<string>('');
  const [isGeneratingPoem, setIsGeneratingPoem] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (dataUri: string, file: File) => {
    setImageDataUri(dataUri);
    setImageFile(file);
    setGeneratedPoem(''); // Reset poem when new image is uploaded
    setError(null);
  };

  const handleGeneratePoem = async () => {
    if (!imageDataUri) {
      toast({
        title: "No Image",
        description: "Please upload an image first.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingPoem(true);
    setError(null);
    setGeneratedPoem('');

    try {
      const input: GeneratePoemFromImageInput = { photoDataUri: imageDataUri };
      const result = await generatePoemFromImage(input);
      setGeneratedPoem(result.poem);
      toast({
        title: "Poem Generated!",
        description: "Your unique poem is ready.",
      });
    } catch (e: any) {
      console.error("Error generating poem:", e);
      setError(e.message || "Failed to generate poem. Please try again.");
      toast({
        title: "Generation Failed",
        description: e.message || "Could not generate poem. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPoem(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="text-center py-8 animate-in fade-in-0 duration-500">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Welcome to <span className="text-primary" style={{color: 'hsl(var(--primary-foreground))'}}>ImageVerse</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Transform your images into captivating poetry. Upload an image and let our AI weave words that capture its essence.
        </p>
      </section>

      <ImageUploadForm onImageUpload={handleImageUpload} isGeneratingPoem={isGeneratingPoem} />

      {imageDataUri && (
        <div className="text-center mt-6 animate-in fade-in-0 duration-500 delay-200">
          <Button
            onClick={handleGeneratePoem}
            disabled={isGeneratingPoem || !imageDataUri}
            size="lg"
            className="shadow-md"
          >
            {isGeneratingPoem ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-5 w-5" />
                Generate Poem
              </>
            )}
          </Button>
        </div>
      )}

      {error && (
        <Alert variant="destructive" className="mt-6 animate-in fade-in-0 duration-500">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {generatedPoem && imageDataUri && (
        <div className="mt-8">
          <PoemCard
            item={{
              imageDataUri,
              poem: generatedPoem,
              imageFileName: imageFile?.name,
            }}
            showFavoriteButton={true}
            animate={true}
          />
        </div>
      )}
    </div>
  );
}
