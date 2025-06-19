// frontend/src/app/layout.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar, { menuItems } from './components/layout/Sidebar';
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    const [activeTitle, setActiveTitle] = useState('대시보드');
    const pathname = usePathname();

    useEffect(() => {
        let found = false;
        if (pathname === '/') {
            setActiveTitle('대시보드');
            found = true;
        } else {
            for (const parent of menuItems) {
                if (parent.children) {
                    const child = parent.children.find(c => c.path === pathname);
                    if (child) {
                        setActiveTitle(child.title);
                        found = true;
                        break;
                    }
                } else if (parent.path === pathname) {
                    setActiveTitle(parent.title);
                    found = true;
                    break;
                }
            }
        }
        if (!found) {
            //setActiveTitle('페이지 없음');
        }
    }, [pathname]);

    const handleMenuClick = (title: string) => {
        setActiveTitle(title);
    };

    return (
        <html lang="ko">
            <body>
                <div className="flex h-screen bg-white text-black">
                    <Sidebar onMenuClick={handleMenuClick} />
                    <div className="flex-1 flex flex-col">
                        <main className="flex-1 p-4">
                           <h1 className="text-3xl font-bold mb-4">{activeTitle}</h1>
                            {children}
                        </main>
                    </div>
                </div>
            </body>
        </html>
    );
}