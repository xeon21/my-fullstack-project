// frontend/src/app/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface TreeInfo {
  itemLv: number;
  name_KR: string;
  name_EN: string;
  name_EC: string;
  co2_1: number;
  co2_2: number;
  co2_3: number;
  co2_4: number;
  life_1: number;
  life_2: number;
  life_3: number;
  life_4: number;
}

// --- Styled Components ---

// [추가] 제목과 조회 컨트롤을 묶는 컨테이너
const ControlsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const PageTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
`;

// [추가] 레벨 입력 필드 스타일
const SearchInput = styled.input`
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db; /* gray-300 */
  border-radius: 0.375rem; /* rounded-md */
  margin-right: 0.5rem;
`;

// [추가] 조회 버튼 스타일
const SearchButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #2563eb; /* blue-600 */
  color: white;
  font-weight: 600;
  border-radius: 0.375rem;
  transition: background-color 0.15s;

  &:hover {
    background-color: #1d4ed8; /* blue-700 */
  }
`;

const TableContainer = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  border: 1px solid #e5e7eb;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: center;
`;

const TableHeader = styled.th`
  background-color: #f9fafb;
  padding: 0.75rem 1.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: #4b5563;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-right: 1px solid #e5e7eb;
  &:last-child {
    border-right: none;
  }
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #e5e7eb;
  &:nth-child(even) {
    background-color: #f9fafb;
  }
  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  color: #1f2937;
  border-right: 1px solid #e5e7eb;
  &:last-child {
    border-right: none;
  }
`;

const LoadingOrErrorContainer = styled.div`
    padding: 2rem;
    text-align: center;
    color: #4b5563;
`;


export default function DashboardPage() {
  // --- [수정] 상태 변수 추가 ---
  const [levelInput, setLevelInput] = useState<string>('0'); // 사용자의 입력을 받는 상태
  const [apiParam, setApiParam] = useState<string>('1');     // 실제 API 요청에 사용할 상태

  const [data, setData] = useState<TreeInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // --- [수정] useEffect가 apiParam을 구독하도록 변경 ---
  useEffect(() => {
    const fetchData = async () => {
      // 요청 시작 시 로딩 상태로 설정
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`http://localhost:3002/game/getALLTreeInfo/${apiParam}`, {
          method: 'Get',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result.data); 
      } catch (e: any) {
        setError(e.message);
        console.error("Failed to fetch data:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiParam]); // apiParam이 변경될 때마다 이 useEffect가 다시 실행됩니다.

  // 조회 버튼 클릭 시 호출될 함수
  const handleSearch = () => {
    setApiParam(levelInput);
  };

  return (
    <>
      {/* --- [추가] 조회 컨트롤 UI --- */}
      <ControlsContainer>
        <PageTitle>나무정보</PageTitle>
        <div>
          <SearchInput 
            type="number"
            value={levelInput}
            onChange={(e) => setLevelInput(e.target.value)}
            placeholder="레벨 입력"
          />
          <SearchButton onClick={handleSearch}>조회</SearchButton>
        </div>
      </ControlsContainer>

      {/* --- [수정] 로딩 및 에러 메시지 표시 후 테이블 렌더링 --- */}
      {loading ? (
        <LoadingOrErrorContainer>데이터를 불러오는 중입니다...</LoadingOrErrorContainer>
      ) : error ? (
        <LoadingOrErrorContainer>데이터 로딩 중 오류가 발생했습니다: {error}</LoadingOrErrorContainer>
      ) : (
        <TableContainer>
          <StyledTable>
            <thead>
              <TableRow>
                <TableHeader>레벨</TableHeader>
                <TableHeader>이름 (한글)</TableHeader>
                <TableHeader>이름 (영문)</TableHeader>
                <TableHeader>CO2 (타입1)</TableHeader>
                <TableHeader>Life (타입1)</TableHeader>
              </TableRow>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.itemLv}</TableCell>
                  <TableCell>{row.name_KR}</TableCell>
                  <TableCell>{row.name_EN}</TableCell>
                  <TableCell>{row.co2_1}</TableCell>
                  <TableCell>{row.life_1}</TableCell>
                </TableRow>
              ))}
            </tbody>
          </StyledTable>
        </TableContainer>
      )}
    </>
  );
}