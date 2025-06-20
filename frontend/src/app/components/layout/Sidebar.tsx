'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styled from 'styled-components';
import { useAuthStore } from '@/store/authStore'; // [추가] 인증 스토어를 가져옵니다.

// --- 아이콘 컴포넌트 ---
const ChevronRightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);
const ChevronDownIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
);

// --- 메뉴 데이터 및 타입 ---
interface MenuItem {
  title: string;
  path?: string;
  pathPrefix?: string;
  children?: { title: string; path: string }[];
}

export const menuItems: MenuItem[] = [
    { title: 'Admin', path: '/admin' },
    { 
        title: '대시보드', 
        pathPrefix: '/dashboard', 
        children: [ 
            { title: 'Server Status', path: '/dashboard/server-status' }, 
            { title: '유저통계', path: '/dashboard/user-statistics' } 
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
  /* [추가] 로그아웃 버튼을 하단에 고정하기 위해 */
  position: relative; 
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

// [추가] 로그아웃 버튼 스타일
const LogoutButton = styled.button`
    position: absolute;
    bottom: 1rem;
    left: 1rem;
    right: 1rem;
    width: calc(100% - 2rem);
    padding: 0.5rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-weight: 600;
    color: #374151;
    transition: background-color 0.15s, color 0.15s;

    &:hover {
        background-color: #fee2e2;
        color: #b91c1c;
        border-color: #fca5a5;
    }
`;

export default function Sidebar() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  // [추가] authStore에서 logout 함수를 가져옵니다.
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const currentMenu = menuItems.find(item => item.pathPrefix && pathname.startsWith(item.pathPrefix));
    if (currentMenu) {
        setOpenMenu(currentMenu.title);
    } else {
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
              <DirectLink href={item.path || '#'} $isActive={pathname === item.path}>
                <span>{item.title}</span>
              </DirectLink>
            )}
          </div>
        ))}
      </nav>
      {/* [추가] 로그아웃 버튼을 렌더링하고 onClick 이벤트에 연결합니다. */}
      <LogoutButton onClick={logout}>
        로그아웃
      </LogoutButton>
    </Aside>
  );
}