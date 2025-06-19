// frontend/src/app/components/layout/Sidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

// --- 타입 및 메뉴 데이터 정의 ---
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
        path: '/installation'
    },
    {
        title: '설정하기',
        path: '/configuration'
    },
];

interface SidebarProps {
    onMenuClick: (title: string) => void;
}

export default function Sidebar({ onMenuClick }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const path = e.target.value;
        if (path) {
            const selectedOption = e.target.options[e.target.selectedIndex];
            onMenuClick(selectedOption.text);
            router.push(path);
        }
    };

    return (
        <aside className="w-60 h-screen bg-white text-black flex flex-col flex-shrink-0 border-r border-gray-400 p-4">
            {/* 상단 로고 영역 */}
            <div className="h-16 flex items-center">
                <h1 className="text-3xl font-bold">My CMS</h1>
            </div>
            {/* 메뉴 리스트 영역 */}
            <nav className="flex-1 mt-4">
                {menuItems.map((item) => (
                    <div key={item.title} className="mb-2">
                        {item.children ? (
                            <>
                                <select 
                                    onChange={handleSelectChange}
                                    className="w-full border border-gray-400 p-1 text-base"
                                    value={item.children.some(c => c.path === pathname) ? pathname : ""}
                                >
                                    {/* 기본 비활성 옵션 */}
                                    <option value="" disabled>
                                        {item.title}
                                    </option>
                                    {item.children.map(child => (
                                        <option key={child.path} value={child.path}>
                                            {child.title}
                                        </option>
                                    ))}
                                </select>
                                <ul className="mt-2 pl-4 list-disc list-inside">
                                    {item.children.map(child => (
                                        <li key={child.path}>
                                            <Link 
                                                href={child.path} 
                                                onClick={() => onMenuClick(child.title)}
                                                className={pathname === child.path ? 'font-bold text-black underline' : 'text-blue-600 underline'}
                                            >
                                                {child.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </>
                        ) : (
                            <Link
                                href={item.path || '#'}
                                onClick={() => onMenuClick(item.title)}
                                className="block w-full border border-gray-400 p-1 text-left"
                            >
                                <div className="flex justify-between items-center">
                                    <span>{item.title}</span>
                                    <span>&gt;</span>
                                </div>
                            </Link>
                        )}
                    </div>
                ))}
            </nav>
        </aside> // [수정] 누락되었던 닫는 태그입니다.
    );
}