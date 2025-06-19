// frontend/src/app/components/layout/Sidebar.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils'; // cn 유틸리티를 import 합니다.

// --- Icon Components ---
const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
        <path d="m9 18 6-6-6-6" />
    </svg>
);
const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
        <path d="m6 9 6 6 6-6" />
    </svg>
);

// --- Component Types and Data ---
export interface SubMenuItem {
    title: string;
    path: string;
}
export interface MenuItem {
    title: string;
    path?: string;
    children?: SubMenuItem[];
}

export const menuItems: MenuItem[] = [
    {
        title: '빠르게 시작하기',
        children: [
            { title: '자습서: 틱택토 게임', path: '/getting-started/tutorial' },
            { title: 'React로 사고하기', path: '/getting-started/thinking-in-react' },
        ],
    },
    {
        title: '설치하기',
        children: [
            { title: '새로운 React 앱 만들기', path: '/installation/new-app' },
        ],
    },
    {
        title: '설정하기',
        children: [
            { title: '에디터 설정하기', path: '/configuration/editor-setup' },
        ],
    },
];

interface SidebarProps {
    onMenuClick: (title: string, parentTitle?: string) => void;
}

export default function Sidebar({ onMenuClick }: SidebarProps) {
    const pathname = usePathname();
    const [openTitle, setOpenTitle] = useState<string | null>('빠르게 시작하기');

    const handleParentClick = (title: string) => {
        const newOpenTitle = openTitle === title ? null : title;
        setOpenTitle(newOpenTitle);
        onMenuClick(title);
    };

    return (
        <aside className="w-64 h-screen bg-white text-gray-800 flex flex-col flex-shrink-0 border-r border-gray-200">
            {/* 상단 로고 영역 */}
            <div className="h-20 flex items-center px-6">
                <h1 className="text-2xl font-bold text-gray-900">My CMS</h1>
            </div>
            {/* 메뉴 리스트 영역 */}
            <nav className="flex-1 px-4 py-2 space-y-4">
                {menuItems.map((item) => {
                    const isOpen = openTitle === item.title;
                    return (
                        <div key={item.title}>
                            <button
                                onClick={() => handleParentClick(item.title)}
                                className={cn(
                                    "flex items-center justify-between w-full p-2 text-left text-base font-medium rounded-md transition-colors duration-150 focus:outline-none",
                                    isOpen ? 'text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                                )}
                            >
                                <span>{item.title}</span>
                                {item.children && item.children.length > 0 && (
                                    isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />
                                )}
                            </button>

                            {/* 드롭다운 메뉴 */}
                            {isOpen && item.children && item.children.length > 0 && (
                                <ul className="mt-2 pl-4 space-y-2">
                                    {item.children.map((child) => (
                                        <li key={child.path}>
                                            <Link
                                                href={child.path}
                                                onClick={() => onMenuClick(child.title, item.title)}
                                                className={cn(
                                                    "block py-1 text-base",
                                                    pathname === child.path
                                                        ? 'font-semibold text-gray-900'
                                                        : 'text-gray-600 hover:text-gray-900'
                                                )}
                                            >
                                                {child.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    );
                })}
            </nav>
        </aside>
    );
}