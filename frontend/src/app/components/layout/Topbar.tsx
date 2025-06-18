// frontend/src/app/components/layout/Topbar.tsx
'use client';

import { usePathname } from 'next/navigation';
import { menuItems } from './Sidebar'; // Sidebar에서 menuItems 배열 가져오기

export default function Topbar() {
  const pathname = usePathname();

  const getBreadcrumbs = () => {
    if (pathname === '/') return ['대시보드'];

    for (const parent of menuItems) {
        if (parent.children) {
            for (const child of parent.children) {
                if (child.path === pathname) {
                    return [parent.title, child.title];
                }
            }
        }
    }
    return ['']; // 경로를 못 찾은 경우
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <div>
        <span className="text-gray-600">
          {breadcrumbs.join(' / ')}
        </span>
      </div>
      <div className="text-sm">admin@example.com</div>
    </header>
  );
}