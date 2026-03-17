
"use client"

import type {Metadata} from 'next';
import './globals.css';
import {SidebarProvider} from '@/components/ui/sidebar';
import {AppSidebar} from '@/components/layout/AppSidebar';
import {Header} from '@/components/layout/Header';
import {Toaster} from '@/components/ui/toaster';
import {LanguageProvider} from '@/context/LanguageContext';
import { FirebaseClientProvider, useUser } from '@/firebase';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user && pathname !== '/auth') {
      router.push('/auth');
    }
  }, [user, isUserLoading, pathname, router]);

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-[#070707] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // If we are on the auth page or logged in, show the content
  if (pathname === '/auth' || user) {
    return <>{children}</>;
  }

  // Otherwise, hide content while redirecting
  return <div className="min-h-screen bg-[#070707]" />;
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Alegreya:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        <title>BharatDarshan Wiki - India's Knowledge Platform</title>
        <meta name="description" content="A collaborative wiki exploring the states, districts, and heritage of India." />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <LanguageProvider>
            <AuthGuard>
              <MainLayout>
                {children}
              </MainLayout>
            </AuthGuard>
            <Toaster />
          </LanguageProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
