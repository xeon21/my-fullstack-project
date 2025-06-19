// frontend/src/app/components/layout/Header.tsx
'use client';

import Link from 'next/link';
import { menuItems, ChevronDownIcon, ChevronRightIcon } from './Sidebar'; // Sidebar에서 데이터와 아이콘 가져오기

interface HeaderProps {
  activeTopMenu: string | null;
  setActiveTopMenu: (title: string | null) => void;
}

export default function Header({ activeTopMenu, setActiveTopMenu }: HeaderProps) {
  return (
    <header className="h-16 w-full bg-white border-b flex items-center px-4 space-x-8">
      <div className="text-2xl font-bold">
        <Link href="/">My CMS</Link>
      </div>
      <div className="flex items-center space-x-4">
        {menuItems.map((item) => (
          <div key={item.title}>
            {item.path ? ( // path가 있으면 단순 링크
              <Link
                href={item.path}
                onClick={() => setActiveTopMenu(item.title)}
                className={`px-3 py-2 text-sm font-medium rounded-md ${
                  activeTopMenu === item.title ? 'bg-gray-100' : ''
                }`}
              >
                {item.title}
              </Link>
            ) : ( // path가 없고 children이 있으면 버튼
              <button
                onClick={() => setActiveTopMenu(item.title)}
                className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 ${
                    activeTopMenu === item.title ? 'bg-gray-100' : ''
                }`}
              >
                <span>{item.title}</span>
                {item.children && (activeTopMenu === item.title ? <ChevronDownIcon/> : <ChevronRightIcon />)}
              </button>
            )}
          </div>
        ))}
      </div>
    </header>
  );
}