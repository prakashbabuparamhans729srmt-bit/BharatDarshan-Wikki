"use client"

import './globals.css';
import {SidebarProvider} from '@/components/ui/sidebar';
import {AppSidebar} from '@/components/layout/AppSidebar';
import {Header} from '@/components/layout/Header';
import {Toaster} from '@/components/ui/toaster';
import {LanguageProvider} from '@/context/LanguageContext';
import {ThemeProvider} from '@/context/ThemeContext';
import { FirebaseClientProvider, useUser } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AIChatbot } from '@/components/ai/AIChatbot';

/**
 * @description Advanced AuthGuard that allows public browsing for Wiki reading
 * but protects member-only areas like Dashboard, Contribute, and Settings.
 */
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  // Define public routes that don't require authentication
  const publicRoutes = ['/', '/auth', '/browse', '/search'];
  const isArticlePage = pathname.startsWith('/article/');
  const isPublicRoute = publicRoutes.includes(pathname) || isArticlePage;

  useEffect(() => {
    // Redirect to auth only if trying to access a protected route without being logged in
    if (!isUserLoading && !user && !isPublicRoute) {
      router.push('/auth');
    }
  }, [user, isUserLoading, pathname, router, isPublicRoute]);

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-[#070707] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">Syncing Heritage Archives...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/auth';

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="flex min-h-screen w-full flex-col">
        <Header />
        <div className="flex flex-1 overflow-hidden pt-16">
          <AppSidebar />
          <main className="flex-1 overflow-y-auto px-4 py-8 md:px-8 lg:px-12 bg-background/50">
            {children}
          </main>
        </div>
        <AIChatbot />
      </div>
    </SidebarProvider>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Alegreya:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        <title>BharatDarshan Wiki - India's Digital Encyclopedia</title>
        <meta name="description" content="A collaborative A-Z wiki exploring the states, districts, and heritage of India powered by AI." />
        
        {/* PWA & Mobile Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#07F1D6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="BharatWiki" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" />
        
        {/* Open Graph Tags for better sharing */}
        <meta property="og:title" content="BharatDarshan Wiki" />
        <meta property="og:description" content="Explore India's heritage from A to Z." />
        <meta property="og:image" content="/icon.svg" />
        <meta property="og:type" content="website" />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <ThemeProvider>
            <LanguageProvider>
              <AuthGuard>
                <MainLayout>
                  {children}
                </MainLayout>
              </AuthGuard>
              <Toaster />
            </LanguageProvider>
          </ThemeProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}