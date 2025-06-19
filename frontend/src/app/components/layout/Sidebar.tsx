// frontend/src/app/components/layout/Sidebar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styled from 'styled-components';

// --- 아이콘 컴포넌트 ---
const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);
const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
);

// --- [수정 1] 메뉴 데이터 및 타입 ---
interface MenuItem {
  title: string;
  path?: string; // 단일 링크용 경로 (선택적)
  pathPrefix?: string;
  children?: { title: string; path: string }[]; // 하위 메뉴 (선택적)
}

// "대시보드"를 단일 링크로 수정하고, "빠르게 시작하기"는 이전 데이터로 복원
export const menuItems: MenuItem[] = [
    { title: '대시보드', path: '/dashboard' },
    { 
        title: '빠르게 시작하기', 
        pathPrefix: '/getting-started', 
        children: [ 
            { title: '자습서: 틱택토 게임', path: '/getting-started/tutorial' }, 
            { title: 'React로 사고하기', path: '/getting-started/thinking-in-react' } 
        ] 
    },
    { 
      title: '설치하기', 
      pathPrefix: '/installation', 
      children: [ 
        { title: '새로운 React 앱 만들기', path: '/installation/new-app' }, 
        { title: '처음부터 React 앱 만들기', path: '/installation/from-scratch' }, 
        { title: '기존 프로젝트에 React 추가하기', path: '/installation/add-react' } 
      ] 
    },
    { title: '설정하기', pathPrefix: '/configuration', 
      children: [ 
        { title: '에디터 설정하기', path: '/configuration/editor-setup' }, 
        { title: 'TypeScript 사용하기', path: '/configuration/typescript' } 
      ] 
    },
];


// --- Styled Components ---
const Aside = styled.aside`
  width: 16rem;
  height: 100vh;
  background-color: white;
  border-right: 1px solid #e5e7eb;
  padding: 1rem;
  flex-shrink: 0;
`;

const Logo = styled.div`
  margin-bottom: 1rem;
  font-weight: bold;
  font-size: 1.25rem;
  padding: 0.5rem 0.75rem;
`;

const MenuButton = styled.button<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.5rem 0.75rem;
  text-align: left;
  font-weight: 500;
  border-radius: 0.375rem;
  transition: background-color 0.15s, color 0.15s;
  color: ${props => (props.$isActive ? '#2563eb' : '#374151')};
  font-size: 1rem;

  &:hover {
    background-color: #f3f4f6;
  }
`;

// 단일 메뉴 링크를 위한 스타일 추가
const DirectLink = styled(Link)<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-weight: 500;
  font-size: 1rem;
  border-radius: 0.375rem;
  transition: background-color 0.15s, color 0.15s;
  color: #374151;
  background-color: ${props => (props.$isActive ? '#f3f4f6' : 'transparent')};

  &:hover {
    background-color: #f3f4f6;
  }
`;

const SubMenuList = styled.ul`
  margin-left: 1rem;
  margin-top: 0.25rem;
  padding: 0.25rem 0;
  list-style-type: none;
`;

const SubMenuLink = styled(Link)<{ $isActive: boolean }>`
  display: block;
  padding: 0.25rem 0.75rem;
  color: #4b5563;
  border-radius: 0.375rem;
  transition: background-color 0.15s, color 0.15s;
  font-size: 0.875rem;
  background-color: transparent;
  font-weight: ${props => (props.$isActive ? '600' : 'normal')};
  color: ${props => (props.$isActive ? '#1f2937' : '#4b5563')};

  &:hover {
    background-color: #f3f4f6;
    color: #111827;
  }
`;

export default function Sidebar() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    const currentMenu = menuItems.find(item => item.pathPrefix && pathname.startsWith(item.pathPrefix));
    if (currentMenu) {
        setOpenMenu(currentMenu.title);
    } else {
        // 하위 메뉴가 없는 페이지에 있을 때 모든 메뉴를 닫습니다.
        setOpenMenu(null);
    }
  }, [pathname]);

  const toggleMenu = (title: string) => {
    setOpenMenu(prevOpenMenu => (prevOpenMenu === title ? null : title));
  };

  return (
    <Aside>
      <Logo>My CMS</Logo>
      <nav>
        {menuItems.map((item) => (
          <div key={item.title} style={{ marginBottom: '0.25rem' }}>
            {/* --- [수정 3] children 배열이 있고, 그 길이가 0보다 클 때만 아코디언 메뉴로 렌더링 --- */}
            {item.children && item.children.length > 0 ? (
              <>
                <MenuButton $isActive={openMenu === item.title} onClick={() => toggleMenu(item.title)}>
                  <span>{item.title}</span>
                  {openMenu === item.title ? <ChevronDownIcon /> : <ChevronRightIcon />}
                </MenuButton>
                {openMenu === item.title && (
                  <SubMenuList>
                    {item.children.map((child) => (
                      <li key={child.path}>
                        <SubMenuLink href={child.path} $isActive={pathname === child.path}>
                          {child.title}
                        </SubMenuLink>
                      </li>
                    ))}
                  </SubMenuList>
                )}
              </>
            ) : (
              // children이 없거나 비어있으면 단일 링크로 렌더링
              <DirectLink href={item.path || '#'} $isActive={pathname === item.path}>
                <span>{item.title}</span>
              </DirectLink>
            )}
          </div>
        ))}
      </nav>
    </Aside>
  );
}