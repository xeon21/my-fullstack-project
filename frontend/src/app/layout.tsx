// frontend/src/app/layout.tsx
import type { Metadata } from 'next';
import StyledComponentsRegistry from '@/lib/registry';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header'; // Header 컴포넌트 import
import './globals.css';

export const metadata: Metadata = {
  title: "My CMS",
  description: "CMS built with NestJS and Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <StyledComponentsRegistry>
          <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f9fafb', fontFamily: 'sans-serif' }}>
            <Sidebar />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
               <Header />
              <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
                {children}
              </main>
            </div>
          </div>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}