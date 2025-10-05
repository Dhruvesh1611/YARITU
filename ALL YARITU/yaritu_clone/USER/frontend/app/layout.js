// app/layout.js

import { Poppins, Playfair_Display, Poiret_One, Cinzel, Source_Serif_4 } from 'next/font/google';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { UIProvider } from '../contexts/UIProvider';
import './globals.css';

// --- Font Definitions ---
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
  variable: '--font-poppins',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  display: 'swap',
  variable: '--font-playfair',
});

const poiret = Poiret_One({
  subsets: ['latin'],
  weight: ['400'],
  display: 'swap',
  variable: '--font-poiret',
});

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-cinzel',
});

const sourceSerif4 = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
  variable: '--font-source-serif-4',
});
// -----------------------

export const metadata = {
  title: 'YARITU - Where Dreams meet Elegance',
  description: 'Discover our exquisite collection of premium attire. Step into a world of elegance and grace with Yaritu.',
  keywords: 'fashion, attire, clothing, elegance, premium, collection',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} ${playfair.variable} ${poiret.variable} ${cinzel.variable} ${sourceSerif4.variable}`}>
      <body>
        <UIProvider>
          <Header />
          {children}
          <Footer />
          <a href="https://wa.me/" className="whatsapp-float" target="_blank" rel="noopener noreferrer">
            <img src="/images/logos_whatsapp-icon.png" alt="WhatsApp" width="50" height="50" />
          </a>
        </UIProvider>
      </body>
    </html>
  );
}