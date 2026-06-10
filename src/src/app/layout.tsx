// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import ClientEngine from '@/components/ClientEngine';

export const metadata: Metadata = {
  metadataBase: new URL('https://paceedizioni.it'),
  title: {
    template: '%s | Pace Edizioni',
    default: "Pace Edizioni | L'Avanguardia Editoriale",
  },
  description: 'Progetto editoriale premium. Letteratura senza compromessi. Ingegnerizziamo idee per resistere al tempo, garantendo agli autori una distribuzione internazionale reale.',
  keywords: [
    'casa editrice indipendente italiana',
    'pubblicare libro',
    'editoria premium',
    'Pace Edizioni',
    'avanguardia editoriale',
    'poesia italiana',
    'narrativa'
  ],
  authors: [{ name: "Pace Edizioni" }],
  creator: "Pace Edizioni",
  publisher: "Pace Edizioni",
  openGraph: {
    title: "Pace Edizioni | L'Avanguardia Editoriale",
    description: 'Letteratura senza compromessi. Ingegnerizziamo idee per resistere al tempo.',
    url: 'https://paceedizioni.it',
    siteName: 'Pace Edizioni',
    locale: 'it_IT',
    type: 'website',
    images: [{
      url: "/og-image.jpg",
      width: 1200,
      height: 630,
      alt: "Pace Edizioni — Casa Editrice Italiana"
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pace Edizioni | L'Avanguardia Editoriale",
    description: "Progetto editoriale premium. Letteratura senza compromessi.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://paceedizioni.it",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Pace Edizioni",
    "url": "https://paceedizioni.it",
    "logo": "https://paceedizioni.it/logo-pace.png",
    "description": "Casa editrice italiana indipendente specializzata in poesia, narrativa e saggistica.",
    "foundingDate": "2020",
    "founder": {
      "@type": "Person",
      "name": "Oreste Kessel Pace"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Via San Leonardo, 72",
      "addressLocality": "Palmi",
      "postalCode": "89015",
      "addressRegion": "RC",
      "addressCountry": "IT"
    },
    "email": "info@paceedizioni.it"
  };

  return (
    <html lang="it" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Instrument+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <ClientEngine />
        
        <main className="flex-grow">
          {children}
        </main>
        
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}