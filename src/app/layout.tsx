
import type {Metadata} from 'next';
import './globals.css';
import {SidebarProvider} from '@/components/ui/sidebar';
import {AppSidebar} from '@/components/layout/AppSidebar';
import {Header} from '@/components/layout/Header';
import {Toaster} from '@/components/ui/toaster';
import {LanguageProvider} from '@/context/LanguageContext';

export const metadata: Metadata = {
  title: 'BharatDarshan Wiki - India\'s Knowledge Platform',
  description: 'A collaborative wiki exploring the states, districts, and heritage of India.',
};

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
      </head>
      <body className="font-body antialiased">
        <LanguageProvider>
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
            <Toaster />
          </SidebarProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
