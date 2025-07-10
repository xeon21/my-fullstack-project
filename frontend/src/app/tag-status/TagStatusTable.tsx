// 수정: frontend/src/app/tag-status/TagStatusTable.tsx

'use client';

import React from 'react';
import styled from 'styled-components';
import Link from 'next/link'; // [추가] Next.js Link 임포트

const TableContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem; /* 패딩 조정 */
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  overflow-x: auto; /* 테이블이 넓을 경우 가로 스크롤 */
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap; /* 셀 내용이 줄바꿈되지 않도록 */
   /* --- [추가] tbody의 tr에 hover 효과 적용 --- */
  tbody tr:hover {
    background-color: #f9fafb; /* 또는 #f0f8ff 등 원하는 색상 */
  }
  /* --- */
`;

const Th = styled.th`
  /* --- [수정] 클릭 가능하도록 cursor 변경 및 user-select 추가 --- */
  cursor: pointer;
  user-select: none; 
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b7280;
  border-bottom: 2px solid #e5e7eb;
  text-transform: uppercase;
  vertical-align: top;

  &:hover {
    background-color: #f9fafb;
  }
  
  .header-content {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  & > div {
    margin-top: 0.5rem;
  }
`;

// [추가] 정렬 아이콘 스타일
const SortIcon = styled.span`
  font-size: 0.8rem;
  color: #9ca3af;
`;


const Td = styled.td`
  padding: 0.1rem 1rem; /* 패딩 조정 */
  border-bottom: 1px solid #f3f4f6;
  font-size: 0.875rem;
  color: #374151;
`;

const FilterInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  font-size: 0.8rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  min-width: 100px; /* 최소 너비 지정 */
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 0.5rem;
  font-size: 0.8rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0.5rem;
  color: #6b7280;
  
  &:hover {
    color: #3498db;
  }
`;

const FilterActions = styled.div`
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
`;

const FilterButton = styled.button<{ $reset?: boolean }>`
    padding: 0.4rem 0.8rem;
    border-radius: 4px;
    font-size: 0.8rem;
    font-weight: 600;
    cursor: pointer;
    background-color: ${props => props.$reset ? '#f3f4f6' : '#3498db'};
    color: ${props => props.$reset ? '#374151' : 'white'};
    border: 1px solid ${props => props.$reset ? '#d1d5db' : '#3498db'};
`;

// --- [수정] 타입 및 Props 인터페이스 확장 ---
export interface TagStatusData {
  companyName: string;
  companyCode: string;
  storeName: string;
  storeCode: string;
  total: number;
  ok: number;
  wip: number;
  ng: number;
}
type SortDirection = 'ascending' | 'descending';

interface SortConfig {
  key: keyof TagStatusData;
  direction: SortDirection;
}

interface TagStatusTableProps {
  data: TagStatusData[];
  requestSort: (key: keyof TagStatusData) => void;
  sortConfig: SortConfig | null;
}

export default function TagStatusTable({ data, requestSort, sortConfig }: TagStatusTableProps) {
  
    // [추가] 정렬 아이콘 렌더링 함수
  const getSortIcon = (key: keyof TagStatusData) => {
    if (!sortConfig || sortConfig.key !== key) {
      return '↕'; // 기본 (정렬 안됨)
    }
    if (sortConfig.direction === 'ascending') {
      return '▲'; // 오름차순
    }
    return '▼'; // 내림차순
  };

  return (
    <TableContainer>
      <StyledTable>
        <thead>
          {/* --- [핵심 수정] 필터 행을 제거하고 각 Th 안에 필터 요소를 포함 --- */}
          <tr>
            {/* --- [수정] 각 Th에 onClick 이벤트와 아이콘 추가 --- */}
            <Th onClick={() => requestSort('companyName')}>
                <div className="header-content">Company Name <SortIcon>{getSortIcon('companyName')}</SortIcon></div>
                <div><FilterSelect><option>All</option></FilterSelect></div>
            </Th>
            <Th onClick={() => requestSort('companyCode')}>
                <div className="header-content">Company Code <SortIcon>{getSortIcon('companyCode')}</SortIcon></div>
                <div><FilterSelect><option>All</option></FilterSelect></div>
            </Th>
            <Th onClick={() => requestSort('storeName')}>
                <div className="header-content">Store Name <SortIcon>{getSortIcon('storeName')}</SortIcon></div>
                <div><FilterInput placeholder="Search..." /></div>
            </Th>
            <Th onClick={() => requestSort('storeCode')}>
                <div className="header-content">Store Code <SortIcon>{getSortIcon('storeCode')}</SortIcon></div>
                <div><FilterInput placeholder="Search..." /></div>
            </Th>
            <Th onClick={() => requestSort('total')}>
                <div className="header-content">Total Tag Cnt <SortIcon>{getSortIcon('total')}</SortIcon></div>
            </Th>
            <Th onClick={() => requestSort('ok')}>
                <div className="header-content">OK Tag Cnt <SortIcon>{getSortIcon('ok')}</SortIcon></div>
            </Th>
            <Th onClick={() => requestSort('wip')}>
                <div className="header-content">WIP Tag Cnt <SortIcon>{getSortIcon('wip')}</SortIcon></div>
            </Th>
            <Th onClick={() => requestSort('ng')}>
                <div className="header-content">NG Tag Cnt<SortIcon>{getSortIcon('ng')}</SortIcon></div>
            </Th>
            <Th>
              Actions
              <FilterActions>
                <FilterButton>Search</FilterButton>
                <FilterButton $reset>Reset</FilterButton>
              </FilterActions>
            </Th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <Td>{row.companyName}</Td>
              <Td>{row.companyCode}</Td>
              <Td>{row.storeName}</Td>
              <Td>{row.storeCode}</Td>
              <Td>{row.total}</Td>
              <Td>{row.ok}</Td>
              <Td>{row.wip}</Td>
              <Td>{row.ng}</Td>
              <Td>
                <Link href={`/tag-status/detail/${row.storeCode}?name=${encodeURIComponent(row.storeName)}`} passHref>
                  <ActionButton>🔍</ActionButton>
                </Link>
              </Td>
            </tr>
          ))}
        </tbody>
      </StyledTable>
    </TableContainer>
  );
}