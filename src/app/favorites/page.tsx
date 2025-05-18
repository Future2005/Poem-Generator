
"use client";

import { useFavorites } from '@/context/FavoritesContext';
import PoemCard from '@/components/features/image-verse/PoemCard';
import { StarOff } from 'lucide-react';

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div className="text-center py-10 animate-in fade-in-0 duration-500">
        <StarOff className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">No Favorites Yet</h2>
        <p className="text-muted-foreground">
          Start by generating some poems and adding your favorites!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="text-center py-8 animate-in fade-in-0 duration-500">
        <h1 className="text-3xl font-bold tracking-tight">Your Favorite Poems</h1>
        <p className="text-md text-muted-foreground mt-2">
          Revisit the image-poem pairs you've cherished.
        </p>
      </section>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((item, index) => (
          <div key={item.id} className="animate-in fade-in-0 duration-500" style={{ animationDelay: `${index * 100}ms`}}>
            <PoemCard
              item={item}
              showFavoriteButton={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
