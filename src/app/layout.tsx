import type {Metadata} from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { lora } from '@/lib/fonts';
import { FavoritesProvider } from '@/context/FavoritesContext';
import Header from '@/components/layout/Header';
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ImageVerse - AI Poem Generator',
  description: 'Generate beautiful poems from your images with ImageVerse.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${lora.variable} antialiased`}>
        <FavoritesProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <footer className="text-center py-4 text-muted-foreground text-sm">
              <p>&copy; {new Date().getFullYear()} ImageVerse. All rights reserved.</p>
            </footer>
          </div>
          <Toaster />
        </FavoritesProvider>
      </body>
    </html>
  );
}
