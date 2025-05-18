
"use client";

import { Star } from 'lucide-react';
import { useFavorites, type FavoriteItem } from '@/context/FavoritesContext';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface FavoriteStarProps {
  item: Pick<FavoriteItem, 'imageDataUri' | 'poem' | 'imageFileName'>;
}

export default function FavoriteStar({ item }: FavoriteStarProps) {
  const { favorites, addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { imageDataUri, poem, imageFileName } = item;

  const favoriteEntry = favorites.find(fav => fav.imageDataUri === imageDataUri && fav.poem === poem);
  const isCurrentlyFavorite = !!favoriteEntry;

  const handleToggleFavorite = () => {
    if (isCurrentlyFavorite && favoriteEntry) {
      removeFavorite(favoriteEntry.id);
    } else {
      addFavorite({ imageDataUri, poem, imageFileName });
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleFavorite}
            aria-label={isCurrentlyFavorite ? "Remove from favorites" : "Add to favorites"}
            className="text-primary hover:text-primary/80"
          >
            <Star className={isCurrentlyFavorite ? "fill-primary" : ""} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isCurrentlyFavorite ? "Remove from favorites" : "Add to favorites"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
