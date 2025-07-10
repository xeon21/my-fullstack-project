// 수정: frontend/src/app/tag-status/detail/[storeCode]/page.tsx

'use client';

import React, { useState, useMemo, use } from 'react'; // [수정]
import { useSearchParams } from 'next/navigation';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import TagDetailHeader from '../TagDetailHeader';
import TagDetailTable, { TagDetailData } from '../TagDetailTable'; // [수정]

// --- [추가] Mock 데이터 및 정렬 타입 정의 ---
const mockDetailData: TagDetailData[] = Array.from({ length: 15 }, (_, i) => ({
    id: `TG-00${i + 1}`,
    prCode: `P00${i + 1}`,
    tagType: i % 3 === 0 ? 'Type A' : 'Type B',
    gwIp: `192.168.1.${100 + i}`,
    operation: i % 4 === 0 ? 'Active' : 'Inactive',
    status: i % 5 === 0 ? 'NG' : 'OK',
    version: `1.0.${i}`,
    rssi: -50 - i,
    battery: 98 - i,
    temperature: 23.5 + (i/10),
    transmissionTime: new Date(Date.now() - i * 60000).toISOString(),
    receivingTime: new Date(Date.now() - i * 60000).toISOString(),
}));

type SortDirection = 'ascending' | 'descending';
interface SortConfig {
  key: keyof TagDetailData;
  direction: SortDirection;
}
// ---

export default function TagDetailPage({ params }: { params: Promise<{ storeCode: string }> }) {
  const resolvedParams = use(params);
  
  const searchParams = useSearchParams();
  const storeName = searchParams.get('name') || '';

  // --- [추가] 정렬 상태 및 로직 ---
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);

  const sortedData = useMemo(() => {
    let sortableItems = [...mockDetailData];
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
  }, [sortConfig]);

  const requestSort = (key: keyof TagDetailData) => {
    let direction: SortDirection = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };
  // ---

  return (
    <DashboardLayout $bgColor="#e9eef2" $padding="2rem">
      <TagDetailHeader storeName={storeName} storeCode={resolvedParams.storeCode} />
      {/* [수정] Props 전달 */}
      <TagDetailTable 
        data={sortedData} 
        requestSort={requestSort}
        sortConfig={sortConfig}
      />
    </DashboardLayout>
  );
}