// 생성: frontend/src/app/tag-status/page.tsx

'use client';

import React, { useState, useMemo, useEffect } from 'react'; // [수정] useEffect 추가
import DashboardLayout from '../components/layout/DashboardLayout';
import TagStatusHeader from './TagStatusHeader';
import TagStatusTable, { TagStatusData } from './TagStatusTable'; // [수정] 타입 임포트
import axiosInstance from '@/lib/axios';
import styled from 'styled-components';

// [추가] 로딩 및 에러 표시를 위한 컨테이너
const StatusContainer = styled.div`
  padding: 4rem;
  text-align: center;
  color: #6b7280;
  background-color: white;
  border-radius: 8px;
`;

// --- [추가] 정렬 설정을 위한 타입 ---
type SortDirection = 'ascending' | 'descending';
interface SortConfig {
  key: keyof TagStatusData;
  direction: SortDirection;
}

export default function TagStatusPage() {
  const [data, setData] = useState<TagStatusData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/tag-status');
        setData(response.data);
      } catch (err) {
        setError('데이터를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- [수정] 정렬 로직의 대상 데이터를 mockData에서 API로 받아온 data로 변경 ---
  const sortedData = useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  const requestSort = (key: keyof TagStatusData) => {
    let direction: SortDirection = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  // ---
  return (
    <DashboardLayout $bgColor="#e9eef2" $padding="2rem">
      <TagStatusHeader />
      {loading ? (
        <StatusContainer>데이터를 불러오는 중...</StatusContainer>
      ) : error ? (
        <StatusContainer>{error}</StatusContainer>
      ) : (
        <TagStatusTable 
          data={sortedData}
          requestSort={requestSort}
          sortConfig={sortConfig} 
        />
      )}
    </DashboardLayout>
  );
}