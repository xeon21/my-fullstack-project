'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import styled from 'styled-components';
import { menuItems } from './Sidebar';

const HeaderWrapper = styled.header`
  height: 4.5rem;
  width: 100%;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  flex-shrink: 0;

  /* [추가] 구분선 스타일 */
  border-bottom: 1px solid #34495e; /* 사이드바의 어두운 색상과 비슷한 톤으로 선 추가 */
  padding-bottom: 1rem; /* 선과 아래 콘텐츠 사이의 여백 */
  margin-bottom: 1rem;  /* 헤더 자체의 하단 마진 추가 */
`;

const Breadcrumb = styled.div`
    color: #95a5a6;
    font-size: 0.875rem;

    span {
        color: white;
        font-weight: 600;
        font-size: 1.25rem;
        display: block;
        margin-top: 0.25rem;
    }
`;

const ControlsWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`;

const SearchInput = styled.input`
    background-color: transparent;
    border: 1px solid #4a627a;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    width: 200px;
    transition: border-color 0.2s;

    &::placeholder {
        color: #95a5a6;
    }

    &:focus {
        outline: none;
        border-color: #3498db;
    }
`;

const IconContainer = styled.div`
    display: flex;
    gap: 1rem;
    color: #bdc3c7;
    font-size: 1.25rem;

    span {
        cursor: pointer;
        &:hover {
            color: white;
        }
    }
`;


export default function Header() {
  const pathname = usePathname();
  const [title, setTitle] = useState('대시보드');
  const [parentTitle, setParentTitle] = useState('Home');

  useEffect(() => {
    let pageTitle = 'Dashboard';
    let parent = 'Home';

    for (const item of menuItems) {
      if (item.children?.some(c => c.path === pathname)) {
        parent = item.title;
        pageTitle = item.children.find(c => c.path === pathname)?.title || '';
        break;
      } else if (item.path === pathname) {
        pageTitle = item.title;
        break;
      }
    }
    setTitle(pageTitle);
    setParentTitle(parent);

  }, [pathname]);

  return (
    <HeaderWrapper>
      <Breadcrumb>
        {parentTitle} / {title}
        <span>{title}</span>
      </Breadcrumb>
      <ControlsWrapper>
          <SearchInput placeholder="Search here" />
          <IconContainer>
            <span>⚙️</span>
            <span>🔔</span>
          </IconContainer>
      </ControlsWrapper>
    </HeaderWrapper>
  );
}