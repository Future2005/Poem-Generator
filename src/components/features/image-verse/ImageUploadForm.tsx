
"use client";

import type React from 'react';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadCloud, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ImageUploadFormProps {
  onImageUpload: (dataUri: string, file: File) => void;
  isGeneratingPoem: boolean;
}

export default function ImageUploadForm({ onImageUpload, isGeneratingPoem }: ImageUploadFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(selectedFile.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a JPG, PNG, WEBP, or GIF image.",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
        setFile(selectedFile);
        onImageUpload(reader.result as string, selectedFile);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input
    }
    onImageUpload("", new File([], "")); // Notify parent that image is removed
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg animate-in fade-in-0 duration-500">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <UploadCloud className="h-6 w-6 text-primary" />
          Upload Your Image
        </CardTitle>
        <CardDescription>Select an image file to generate a poem.</CardDescription>
      </CardHeader>
      <CardContent>
        <Input
          type="file"
          id="imageUpload"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
          disabled={isGeneratingPoem}
        />
        {!previewUrl ? (
          <label
            htmlFor="imageUpload"
            className={cn(
              "mt-2 flex flex-col items-center justify-center w-full h-64 border-2 border-border border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted transition-colors",
              isGeneratingPoem ? "cursor-not-allowed opacity-50" : ""
            )}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <UploadCloud className="w-10 h-10 mb-3 text-muted-foreground" />
              <p className="mb-2 text-sm text-muted-foreground">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">PNG, JPG, GIF, WEBP (MAX. 5MB)</p>
            </div>
          </label>
        ) : (
          <div className="mt-4 relative group">
            <Image
              src={previewUrl}
              alt={file?.name || "Image preview"}
              width={400}
              height={400}
              className="rounded-lg object-contain max-h-[400px] w-full shadow-md"
              data-ai-hint="uploaded image"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleRemoveImage}
              disabled={isGeneratingPoem}
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Helper function from ShadCN docs, not part of ImageUploadForm but useful for class conditional logic
function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(' ');
}
