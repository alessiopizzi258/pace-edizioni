import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /* IL BYPASS TATTICO: Disattiva l'ottimizzazione locale per evitare i timeout, ma la mantiene attiva in produzione */
    unoptimized: process.env.NODE_ENV === 'development',
    
    qualities: [25, 50, 75, 85, 95, 100],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        pathname: '**',
      },
    ],
  },
  compress: true,
};

export default nextConfig;