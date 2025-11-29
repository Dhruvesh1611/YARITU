// app/layout.js

import { Poppins, Playfair_Display, Poiret_One, Cinzel, Source_Serif_4 } from 'next/font/google';
import { Suspense } from 'react';
import Header from '../components/Header'; // <-- Dekhein, ab hum original Header.js use kar rahe hain
import Footer from '../components/Footer';
import Providers from '../components/Providers'; // <-- Naya Providers component import kiya
import Script from 'next/script';
import Analytics from '../components/Analytics';
import './globals.css';
import WhatsAppChat from '../components/WhatsAppChat';
import { WHATSAPP_NUMBER } from '../lib/siteConfig';

// --- Font Definitions (Yeh code waisa hi rahega) ---
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600'], display: 'swap', variable: '--font-poppins' });
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '600', '700'], display: 'swap', variable: '--font-playfair' });
const poiret = Poiret_One({ subsets: ['latin'], weight: ['400'], display: 'swap', variable: '--font-poiret' });
const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '700'], display: 'swap', variable: '--font-cinzel' });
const sourceSerif4 = Source_Serif_4({ subsets: ['latin'], weight: ['400', '600'], display: 'swap', variable: '--font-source-serif-4' });
// ----------------------------------------------------

export const metadata = {
  title: 'YARITU - Where Dreams meet Elegance',
  description: 'Discover our exquisite collection of premium attire. Step into a world of elegance and grace with Yaritu.',
  keywords: 'fashion, attire, clothing, elegance, premium, collection',
};

export default function RootLayout({ children, session }) {
  return (
    <html lang="en" className={`${poppins.variable} ${playfair.variable} ${poiret.variable} ${cinzel.variable} ${sourceSerif4.variable}`}>
      <body>
        {/* Providers ab sirf {children} ko wrap kar rahe hain */}
        {/* Google Analytics: set NEXT_PUBLIC_GA_ID in your environment to enable. */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);} 
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', { send_page_view: false${process.env.NEXT_PUBLIC_GA_DEBUG ? ', debug_mode: true' : ''} });`}
            </Script>
          </>
        )}

        <Providers session={session}>
          <Header /> {/* <-- Header ab Providers ke bahar hai */}
          <main>
            {children}
          </main>
          <Footer /> {/* <-- Footer bhi bahar hai */}
          <WhatsAppChat
            phoneNumber={WHATSAPP_NUMBER}
            headerTitle="Welcome to YARITU"
            headerCaption="We'll reply shortly!"
            placeholder="Type your message..."
          />

          {/* Analytics client component sends page_view events on navigation
              Wrap in Suspense to avoid CSR-bailout errors during prerendering (Next.js requirement).
          */}
          <Suspense fallback={null}>
            <Analytics />
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}