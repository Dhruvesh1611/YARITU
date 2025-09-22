import Header from '../components/Header';
import Footer from '../components/Footer';
import './globals.css';

export const metadata = {
  title: 'YARITU - Where Dreams meet Elegance',
  description: 'Discover our exquisite collection of premium attire. Step into a world of elegance and grace with Yaritu.',
  keywords: 'fashion, attire, clothing, elegance, premium, collection',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
