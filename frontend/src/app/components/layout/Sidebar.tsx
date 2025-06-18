// frontend/src/app/components/layout/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMenuStore } from '@/store/menuStore';
import { cn } from '@/lib/utils';

interface MenuItem {
  title: string;
  path?: string;
  children?: { title: string; path: string }[];
}

export const menuItems: MenuItem[] = [
    {
        title: '대시보드',
        path: '/'
    },
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
        { title: '처음부터 React 앱 만들기', path: '/installation/from-scratch' },
      ],
    },
    {
      title: '설정하기',
      children: [
        { title: '에디터 설정하기', path: '/configuration/editor-setup' },
        { title: 'TypeScript 사용하기', path: '/configuration/typescript' },
      ],
    },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { activeMenu, setActiveMenu } = useMenuStore();

  return (
    <aside className="w-64 bg-white p-4 shadow-lg flex-shrink-0">
      <div className="mb-8 text-2xl font-bold text-center">CMS LOGO</div>
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.title} className="mb-2">
              {item.children ? (
                <>
                  <button
                    onClick={() => setActiveMenu(item.title)}
                    className="w-full text-left font-semibold flex justify-between items-center p-2 rounded-md hover:bg-gray-100"
                  >
                    {item.title}
                    <span className="transform transition-transform duration-200">
                      {activeMenu === item.title ? '▲' : '▼'}
                    </span>
                  </button>
                  {activeMenu === item.title && (
                    <ul className="pl-4 mt-2 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.title}>
                          <Link href={child.path}
                              className={cn(
                                "block p-2 rounded-md hover:bg-gray-200 text-sm",
                                pathname === child.path && "font-bold text-blue-600 bg-gray-200"
                              )}>
                              {child.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link href={item.path || '#'}
                    className={cn(
                        "block p-2 rounded-md font-semibold hover:bg-gray-100",
                        pathname === item.path && "font-bold text-blue-600 bg-gray-100"
                    )}>
                    {item.title}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}