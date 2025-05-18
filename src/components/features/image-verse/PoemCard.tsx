
"use client";

import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import FavoriteStar from './FavoriteStar';
import type { FavoriteItem } from '@/context/FavoritesContext';

interface PoemCardProps {
  item: Pick<FavoriteItem, 'imageDataUri' | 'poem' | 'imageFileName'>;
  showFavoriteButton: boolean;
  animate?: boolean;
}

export default function PoemCard({ item, showFavoriteButton, animate = false }: PoemCardProps) {
  const { imageDataUri, poem, imageFileName } = item;

  return (
    <Card className={`w-full shadow-lg ${animate ? 'animate-in fade-in-0 duration-700' : ''}`}>
      <CardHeader>
        {imageFileName && <CardTitle className="text-lg truncate">{imageFileName}</CardTitle>}
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2 items-start">
        <div className="relative aspect-square md:aspect-auto md:min-h-[300px] rounded-lg overflow-hidden shadow-md">
          <Image
            src={imageDataUri}
            alt={imageFileName || "Generated image"}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            data-ai-hint="poem related"
          />
        </div>
        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-primary-foreground" style={{color: 'hsl(var(--primary-foreground))'}}>Generated Poem</h3>
          {poem ? (
            <p className="font-lora text-base leading-relaxed whitespace-pre-wrap">
              {poem}
            </p>
          ) : (
            <p className="text-muted-foreground italic">No poem generated yet.</p>
          )}
        </div>
      </CardContent>
      {showFavoriteButton && (
        <CardFooter className="flex justify-end">
          <FavoriteStar item={item} />
        </CardFooter>
      )}
    </Card>
  );
}
