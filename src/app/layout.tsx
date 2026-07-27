import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://mapzy.com.co'),
  title: {
    default: 'Mapzy | Soluciones Geoespaciales, Minería y Gestión Ambiental en Colombia',
    template: '%s | Mapzy',
  },
  description: 'Líderes en topografía, sistemas de información geográfica (SIG), planes de ordenamiento territorial, exploración de yacimientos y estudios de impacto ambiental en Colombia.',
  keywords: [
    'Mapzy',
    'SIG Colombia',
    'Geología Colombia',
    'Minería Sostenible',
    'Gestión Ambiental',
    'Ordenamiento Territorial',
    'Ley 1523 de 2012',
    'Matriz de Exclusión Ambientales',
    'GeoRisk Colombia',
    'Cartografía Bogotá Tolima',
  ],
  authors: [{ name: 'Mapzy Team', url: 'https://mapzy.com.co' }],
  creator: 'Mapzy',
  publisher: 'Mapzy Geoespacial',
  openGraph: {
    title: 'Mapzy | Soluciones Geoespaciales y Gestión Ambiental en Colombia',
    description: 'Suite interactiva de mapas, gestión del riesgo, minería y consultoría ambiental territorial.',
    url: 'https://mapzy.com.co',
    siteName: 'Mapzy Colombia',
    locale: 'es_CO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mapzy | Soluciones Geoespaciales y Gestión Ambiental en Colombia',
    description: 'Suite interactiva de mapas, gestión del riesgo, minería y consultoría ambiental territorial.',
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-[#f8fafc] text-[#1a2a44] selection:bg-yellow-200`}
      >
        <Navbar />
        <main className="min-h-screen pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
