import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PROSPERON — Indian Financial & Economic Intelligence',
  description: 'A daily digital newspaper empowering everyday Indian financial decisions with real-time NSE/BSE rate streaming, India Inc. earnings, and plain-English economic journalism.',
  keywords: ['Prosperon', 'Indian Finance', 'Nifty 50', 'BSE Sensex', 'Mutual Fund SIP', 'RBI Repo Rate', 'Indian Stock Market', 'Personal Finance India'],
  authors: [{ name: 'Prosperon Editorial Desk' }],
  openGraph: {
    title: 'PROSPERON — Indian Financial & Economic Intelligence',
    description: 'Real-time Indian market benchmarks, corporate earnings in ₹ Crores, and plain-English financial takeaways.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,800;0,900;1,400;1,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
