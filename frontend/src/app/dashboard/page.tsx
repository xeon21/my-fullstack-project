// frontend/src/app/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// API로부터 받아올 데이터의 타입을 정의합니다.
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

// 스타일을 적용한 컴포넌트들 (기존과 동일)
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


// 대시보드 페이지 컴포넌트
export default function DashboardPage() {
  // [수정] API 데이터를 관리할 상태 추가
  const [data, setData] = useState<TreeInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // [수정] 컴포넌트가 마운트될 때 API를 호출하는 useEffect 추가
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/game/getALLTreeInfo/0', {
          method: 'GET', // NestJS 컨트롤러에 정의된 HTTP 메소드
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        // API 응답 데이터 구조에 맞춰 result.data를 사용
        setData(result.data); 
      } catch (e: any) {
        setError(e.message);
        console.error("Failed to fetch data:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // 빈 배열을 전달하여 최초 1회만 실행되도록 설정

  // 로딩 중일 때 표시할 UI
  if (loading) {
    return <LoadingOrErrorContainer>데이터를 불러오는 중입니다...</LoadingOrErrorContainer>;
  }

  // 에러 발생 시 표시할 UI
  if (error) {
    return <LoadingOrErrorContainer>데이터 로딩 중 오류가 발생했습니다: {error}</LoadingOrErrorContainer>;
  }

  // [수정] API 데이터로 테이블을 렌더링
  return (
    <TableContainer>
      <StyledTable>
        <thead>
          <TableRow>
            <TableHeader>레벨</TableHeader>
            <TableHeader>이름 (한글)</TableHeader>
            <TableHeader>이름 (영문)</TableHeader>
            <TableHeader>CO2_1 (타입1)</TableHeader>
            <TableHeader>CO2_2 (타입1)</TableHeader>
            <TableHeader>CO2_3 (타입1)</TableHeader>
            <TableHeader>CO2_4 (타입1)</TableHeader>
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
              <TableCell>{row.co2_2}</TableCell>
              <TableCell>{row.co2_3}</TableCell>
              <TableCell>{row.co2_4}</TableCell>
              <TableCell>{row.life_1}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </StyledTable>
    </TableContainer>
  );
}