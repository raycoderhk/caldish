import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { APP_CONFIG } from '@/lib/constants';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: `${APP_CONFIG.name} - ${APP_CONFIG.description}`,
  description: APP_CONFIG.description,
  keywords: ['food', 'nutrition', 'analysis', 'AI', 'calories', 'health'],
  authors: [{ name: APP_CONFIG.author }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: APP_CONFIG.name,
    description: APP_CONFIG.description,
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: APP_CONFIG.name,
    description: APP_CONFIG.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#22c55e',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 min-h-screen`}>
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🍽️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{APP_CONFIG.name}</h1>
                <p className="text-sm text-gray-500">{APP_CONFIG.description}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center text-gray-600 space-y-2">
              <p className="text-sm">
                Nutrition analysis powered by AI • Results are estimates for informational purposes
              </p>
              <p className="text-xs">
                Always consult with healthcare professionals for dietary advice
              </p>
              <div className="flex justify-center items-center space-x-4 text-xs text-gray-500 mt-4">
                <span>v{APP_CONFIG.version}</span>
                <span>•</span>
                <span>Made by {APP_CONFIG.author}</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
