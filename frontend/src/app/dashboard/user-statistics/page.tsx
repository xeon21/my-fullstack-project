// frontend/src/app/dashboard/user-statistics/page.tsx
'use client'; // dynamic import를 사용하려면 클라이언트 컴포넌트여야 할 수 있습니다.
              // 만약 페이지 전체가 서버 컴포넌트여야 한다면, 이 파일을 서버 컴포넌트로 두고
              // dynamic import 부분만 별도 클라이언트 컴포넌트로 분리할 수 있습니다.

import React from 'react';
import styled from 'styled-components';
import dynamic from 'next/dynamic';

// --- [수정] 차트 컴포넌트를 동적으로 불러오고, SSR은 비활성화합니다. ---
const UserStatisticsCharts = dynamic(
  () => import('./UserStatisticsCharts'),
  { 
    ssr: false, // 이 옵션이 서버 사이드 렌더링을 막습니다.
    loading: () => <p>차트를 불러오는 중입니다...</p> // 로딩 중 표시할 UI
  }
);

// --- Styled Components ---
const ChartPageContainer = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #FAEBD7;
  border-radius: 1rem;
  font-family: sans-serif;
`;

const ChartTitle = styled.h2`
  text-align: center;
  font-size: 2rem;
  color: #5a4b41;
  margin-bottom: 3rem;
  font-style: italic;
`;

// 유저 통계 페이지 컴포넌트
export default function UserStatisticsPage() {
  return (
    <ChartPageContainer>
      <ChartTitle>유저통계</ChartTitle>
      
      {/* 이제 동적으로 불러온 차트 컴포넌트를 사용합니다. */}
      <UserStatisticsCharts />
    </ChartPageContainer>
  );
}