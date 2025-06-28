'use client';

import styled from 'styled-components';

// [수정] props 이름 앞에 '$' 추가
interface DashboardLayoutProps {
  $bgColor?: string;
  $padding?: string;
}

// [수정] props 이름 앞에 '$' 추가
const LayoutContainer = styled.div<DashboardLayoutProps>`
  width: 100%;
  min-height: 100%;
  background-color: ${props => props.$bgColor || '#1c2833'};
  padding: ${props => props.$padding || '2rem'};
  border-radius: 1rem;
`;

interface LayoutProps extends DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children, $bgColor, $padding }: LayoutProps) {
  // [수정] 컴포넌트에 전달되는 props 이름도 변경
  return (
    <LayoutContainer $bgColor={$bgColor} $padding={$padding}>
      {children}
    </LayoutContainer>
  );
}