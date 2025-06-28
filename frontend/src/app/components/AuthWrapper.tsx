// frontend/src/app/components/AuthWrapper.tsx
'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Sidebar from './layout/Sidebar';
import Header from './layout/Header';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const isLoginPage = pathname === '/login';

    if (!isAuthenticated && !isLoginPage) {
      router.push('/login');
    }
    if (isAuthenticated && isLoginPage) {
      router.push('/admin');
    }
  }, [isAuthenticated, pathname, router, isClient]);

 // [수정] /admin 경로도 전체 화면을 사용하도록 조건 추가
  const isFullbleedPage = pathname.startsWith('/dashboard') || pathname === '/admin';


  if (!isClient) {
    return null;
  }

   if (isAuthenticated) {
    if (pathname === '/login') return null;

    return (
      // [수정] backgroundColor를 어두운 색상으로 변경합니다.
      <div style={{ display: 'flex', height: '100vh', backgroundColor: '#1c2833', fontFamily: 'sans-serif' }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Header />
          <main style={{
              flex: 1,
              // [수정] isFullbleedPage 변수를 사용하여 padding과 배경색을 결정
              padding: isFullbleedPage ? '0' : '2rem',
              backgroundColor: isFullbleedPage ? 'transparent' : '#f1f5f9',
              overflowY: 'auto'
          }}>
            {children}
          </main>
        </div>
      </div>
    );
  }

  if (pathname === '/login') {
    return <>{children}</>;
  }

  return null;
}