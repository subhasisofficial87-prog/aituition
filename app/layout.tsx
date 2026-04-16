import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getSession } from '@/lib/auth';

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AITuition — Quality Tuition at Home for Every Indian Child',
  description:
    'AI-powered home tuition for CBSE, ICSE and Odia Medium students from LKG to Class 12. Daily lessons, surprise quizzes, 11 Indian languages. Start your 7-day free trial today.',
  keywords: 'AI tuition, home tuition India, CBSE tutor, online tuition, AI teacher, personalised learning',
  openGraph: {
    title: 'AITuition — Quality Tuition at Home',
    description: 'AI home tutor for Indian students. Daily lessons + quizzes in 11 languages. 7-day free trial.',
    url: 'https://aituition.in',
    siteName: 'AITuition',
    locale: 'en_IN',
    type: 'website',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${nunito.variable} font-sans antialiased bg-white text-gray-900 flex flex-col min-h-screen`}>
        <Navbar isLoggedIn={!!session} />
        <main className="flex-1 pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
