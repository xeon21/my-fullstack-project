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

  // 이 컴포넌트가 클라이언트에서 마운트되었는지 확인하는 상태
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 리다이렉트 로직
  useEffect(() => {
    // 클라이언트가 아니고서는 로직을 실행하지 않음 (서버 렌더링 시 실행 방지)
    if (!isClient) return;

    const isLoginPage = pathname === '/login';

    if (!isAuthenticated && !isLoginPage) {
      router.push('/login');
    }
    if (isAuthenticated && isLoginPage) {
      router.push('/admin');
    }
  }, [isAuthenticated, pathname, router, isClient]);

  // [수정] 클라이언트에서 상태 확인이 끝나기 전까지는 아무것도 렌더링하지 않음
  // 이렇게 하면 서버가 그린 잘못된 화면이 깜빡이는 현상을 막을 수 있습니다.
  if (!isClient) {
    return null;
  }

  // 로그인 상태일 경우, 전체 레이아웃을 렌더링합니다.
  if (isAuthenticated) {
    // 로그인 페이지로 이동 중일때는 잠시 아무것도 보여주지 않습니다.
    if (pathname === '/login') return null;

    return (
      <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f9fafb', fontFamily: 'sans-serif' }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Header />
          <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
            {children}
          </main>
        </div>
      </div>
    );
  }

  // 로그아웃 상태일 경우, 로그인 페이지만 렌더링합니다.
  if (pathname === '/login') {
    return <>{children}</>;
  }

  // 그 외의 경우 (예: 보호된 페이지에서 로그인 페이지로 리다이렉트되는 동안)는 아무것도 렌더링하지 않습니다.
  return null;
}