import "./globals.css";
import NavBar from "../components/NavBar";

export const metadata = {
  title: "Dual MF Dashboard",
  description: "Demo project with CSR, SSR, ISR, and SSG",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
