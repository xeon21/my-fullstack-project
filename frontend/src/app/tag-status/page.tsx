// 생성: frontend/src/app/tag-status/page.tsx

'use client';

import React, { useState, useMemo } from 'react'; // [수정] useState, useMemo 추가
import DashboardLayout from '../components/layout/DashboardLayout';
import TagStatusHeader from './TagStatusHeader';
import TagStatusTable, { TagStatusData } from './TagStatusTable'; // [수정] 타입 임포트


// Mock 데이터 생성
const mockData: TagStatusData[] = [
    { companyName: '이마트', companyCode: 'emart', storeName: '수원시청점', storeCode: '0001', total: 0, ok: 0, wip: 0, ng: 0 },
    { companyName: '월마트', companyCode: 'wallmart', storeName: '안산점', storeCode: '1000', total: 0, ok: 0, wip: 0, ng: 0 },
    { companyName: '빅마트', companyCode: 'bigmart', storeName: '이케부쿠로점', storeCode: '1111', total: 1, ok: 0, wip: 0, ng: 1 },
    { companyName: 'stf1', companyCode: 'stf1', storeName: '동작구청점', storeCode: '11321', total: 0, ok: 0, wip: 0, ng: 0 },
    { companyName: '농심하나로', companyCode: 'fasano', storeName: '양재점', storeCode: '100164-1', total: 0, ok: 0, wip: 0, ng: 0 },
];

// --- [추가] 정렬 설정을 위한 타입 ---
type SortDirection = 'ascending' | 'descending';
interface SortConfig {
  key: keyof TagStatusData;
  direction: SortDirection;
}

export default function TagStatusPage() {
   const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  // --- [추가] 정렬 로직 ---
  const sortedData = useMemo(() => {
    let sortableItems = [...mockData];
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
  }, [mockData, sortConfig]);

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
      <TagStatusTable 
        data={sortedData}
        requestSort={requestSort}
        sortConfig={sortConfig} 
      />
    </DashboardLayout>
  );
}