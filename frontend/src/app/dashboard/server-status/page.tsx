// frontend/src/app/dashboard/server-status/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Image from 'next/image'; // next/image 컴포넌트 import

// API 응답 데이터 타입
interface ServerStatus {
  serverName: string;
  regeion: string;
  serverStatus: string;
}

// --- Styled Components ---
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

const SearchInput = styled.input`
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  margin-right: 0.5rem;
`;

const SearchButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #2563eb;
  color: white;
  font-weight: 600;
  border-radius: 0.375rem;
  transition: background-color 0.15s;

  &:hover {
    background-color: #1d4ed8;
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
  /* [수정] 이미지 정렬을 위해 추가 */
  vertical-align: middle;

  &:last-child {
    border-right: none;
  }
`;

const LoadingOrErrorContainer = styled.div`
  padding: 2rem;
  text-align: center;
  color: #4b5563;
`;

// 컴포넌트 이름을 ServerStatusPage로 변경하여 타입 이름과의 충돌 방지
export default function ServerStatusPage() {
  const [levelInput, setLevelInput] = useState<string>('1');
  const [apiParam, setApiParam] = useState<string>('1');

  const [data, setData] = useState<ServerStatus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`http://localhost:3002/game/getServerStatus/${apiParam}`, {
          method: 'GET', // 'Get' -> 'GET' (표준)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        // data가 배열이 아닐 경우를 대비한 방어 코드
        setData(Array.isArray(result.data) ? result.data : []); 
      } catch (e: any) {
        setError(e.message);
        console.error("Failed to fetch data:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiParam]);

  const handleSearch = () => {
    setApiParam(levelInput);
  };

  return (
    <>
      <ControlsContainer>
        <PageTitle>Server Status</PageTitle>
        <div>
          <SearchInput 
            type="number"
            value={levelInput}
            onChange={(e) => setLevelInput(e.target.value)}
            placeholder="서버 ID 입력"
          />
          <SearchButton onClick={handleSearch}>조회</SearchButton>
        </div>
      </ControlsContainer>

      {loading ? (
        <LoadingOrErrorContainer>데이터를 불러오는 중입니다...</LoadingOrErrorContainer>
      ) : error ? (
        <LoadingOrErrorContainer>데이터 로딩 중 오류가 발생했습니다: {error}</LoadingOrErrorContainer>
      ) : (
        <TableContainer>
          <StyledTable>
            <thead>
              <TableRow>
                <TableHeader>서버 이름</TableHeader>
                <TableHeader>리전</TableHeader>
                <TableHeader>상태</TableHeader>
              </TableRow>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.serverName}</TableCell>
                  <TableCell>{row.regeion}</TableCell>
                  {/* --- [수정] serverStatus 값에 따라 다른 이미지 표시 --- */}
                  <TableCell>
                    {row.serverStatus === '1' ? (
                      <Image src="/file.svg" alt="Working" width={24} height={24} />
                    ) : (
                      <Image src="/next.svg" alt="Stopped" width={24} height={24} />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </StyledTable>
        </TableContainer>
      )}
    </>
  );
}