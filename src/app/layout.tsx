import type { Metadata } from 'next';
import { Exo_2 } from 'next/font/google';
import { gunnyRewritten, inspiration, marckScript, ntSomic, ntSomicVariable } from './fonts';
import './globals.css';

const exo2 = Exo_2({
  subsets: ['latin'],
  weight: ['300', '700', '900'],
  display: 'swap',
  variable: '--font-exo2',
});

export const metadata: Metadata = {
  title: 'HARIZMA',
  description: 'HARIZMA — музыкальный лейбл.',
  icons: {
    icon: [{ url: '/favicon.ico' }, { url: '/favicon.png', type: 'image/png' }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body
        className={`${exo2.variable} ${ntSomic.variable} ${ntSomicVariable.variable} ${inspiration.variable} ${gunnyRewritten.variable} ${marckScript.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
