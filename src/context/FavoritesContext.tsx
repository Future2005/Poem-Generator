
"use client";

import type React from 'react';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from "@/hooks/use-toast";

export interface FavoriteItem {
  id: string; // Unique ID for the favorite entry
  imageDataUri: string;
  poem: string;
  imageFileName?: string; // Optional: for potential future use like download with original name
  addedAt: number; // Timestamp
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addFavorite: (item: Omit<FavoriteItem, 'id' | 'addedAt'>) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (imageDataUri: string, poem: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'imageverse-favorites';

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Failed to load favorites from localStorage:", error);
      // Optionally clear corrupted data
      // localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(favorites));
      } catch (error) {
        console.error("Failed to save favorites to localStorage:", error);
        toast({
          title: "Storage Error",
          description: "Could not save favorites. Your browser storage might be full.",
          variant: "destructive",
        });
      }
    }
  }, [favorites, isLoaded]);

  const addFavorite = useCallback((item: Omit<FavoriteItem, 'id' | 'addedAt'>) => {
    if (isFavorite(item.imageDataUri, item.poem)) {
      toast({
        title: "Already a Favorite",
        description: "This image and poem pair is already in your favorites.",
      });
      return;
    }
    const newItem: FavoriteItem = {
      ...item,
      id: crypto.randomUUID(), // Generate a unique ID
      addedAt: Date.now(),
    };
    setFavorites((prevFavorites) => [newItem, ...prevFavorites]);
    toast({
      title: "Added to Favorites!",
      description: "The poem has been saved to your favorites.",
    });
  }, [favorites]);

  const removeFavorite = useCallback((id: string) => {
    setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav.id !== id));
    toast({
      title: "Removed from Favorites",
      description: "The poem has been removed from your favorites.",
    });
  }, []);

  const isFavorite = useCallback((imageDataUri: string, poem: string) => {
    return favorites.some(fav => fav.imageDataUri === imageDataUri && fav.poem === poem);
  }, [favorites]);

  if (!isLoaded) {
    return null; // Or a loading spinner, but null avoids hydration issues if localStorage access is delayed
  }

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
