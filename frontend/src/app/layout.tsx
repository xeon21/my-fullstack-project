// frontend/src/app/layout.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

import Sidebar, { menuItems } from './components/layout/Sidebar';
// Topbar는 현재 사용하지 않으므로 import하지 않아도 됩니다.
// import Topbar from './components/layout/Topbar'; 
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const [activeTitle, setActiveTitle] = useState('대시보드');
    const pathname = usePathname();

    useEffect(() => {
        if (pathname === '/') {
            setActiveTitle('대시보드');
            return;
        }
        for (const parent of menuItems) {
            if (parent.children) {
                const child = parent.children.find(c => c.path === pathname);
                if (child) {
                    setActiveTitle(child.title);
                    return;
                }
            }
        }
    }, [pathname]);

    const handleMenuClick = (title: string, parentTitle?: string) => {
        setActiveTitle(title);
    };

    return (
        <html lang="ko">
            <body>
                <div className="flex h-screen bg-white">
                    <Sidebar onMenuClick={handleMenuClick} />
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <main className="flex-1 p-8 overflow-y-auto">
                           <h1 className="text-3xl font-bold mb-6">{activeTitle}</h1>
                            {children}
                        </main>
                    </div>
                </div>
            </body>
        </html>
    );
}