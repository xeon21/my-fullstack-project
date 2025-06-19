'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import styled from 'styled-components';
import { menuItems } from './Sidebar';

const HeaderWrapper = styled.header`
  height: 4rem;
  width: 100%;
  background-color: white;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  padding: 0 2rem;
  flex-shrink: 0;
`;

const HeaderTitle = styled.h1`
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
`;

export default function Header() {
  const pathname = usePathname();
  const [title, setTitle] = useState('대시보드');

  useEffect(() => {
    // 기본 페이지 처리
    if (pathname === '/' || pathname === '/dashboard') {
      setTitle('대시보드');
      return;
    }

    let pageTitle = '대시보드'; // 기본값
    let found = false;

    // 메뉴 아이템에서 현재 경로와 일치하는 항목 찾기
    for (const item of menuItems) {
      // 1. 하위 메뉴에서 찾기
      // [수정] item.children이 존재하는지 먼저 확인
      if (item.children && item.children.length > 0) {
        const child = item.children.find(c => c.path === pathname);
        if (child) {
          pageTitle = `${item.title} > ${child.title}`;
          found = true;
          break;
        }
      } 
      // 2. 단일 메뉴에서 찾기 (children이 없는 경우)
      else if (item.path === pathname) {
        pageTitle = item.title;
        found = true;
        break;
      }
    }

    setTitle(pageTitle);

  }, [pathname]);

  return (
    <HeaderWrapper>
      <HeaderTitle>{title}</HeaderTitle>
    </HeaderWrapper>
  );
}