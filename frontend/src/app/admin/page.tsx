// frontend/src/app/admin/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// 범용 레이아웃 및 카드 컴포넌트 import
import DashboardLayout from '../components/layout/DashboardLayout';
import { GridContainer, GridItem } from '../components/layout/Grid';
import ProjectListCard from '../dashboard/ProjectListCard';
import ProjectListItem from '../dashboard/ProjectListItem';

// 타입 정의
interface TreeInfo {
  itemLv: number;
  name_KR: string;
  name_EN: string;
  co2_1: number;
  life_1: number;
}

const TREE_ICONS = ['🌳', '🌲', '🌴', '🌿', '🌵', '🍀', '🍁', '🌱'];

const ControlsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const PageTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #ecf0f1; // 밝은 텍스트 색상
`;

const SearchInput = styled.input`
  padding: 0.5rem 0.75rem;
  border: 1px solid #4a627a;
  border-radius: 0.375rem;
  margin-right: 0.5rem;
  background-color: #2c3e50;
  color: white;
`;

const SearchButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #3498db;
  color: white;
  font-weight: 600;
  border-radius: 0.375rem;
  border: none;
  transition: background-color 0.15s;
  cursor: pointer;

  &:hover {
    background-color: #2980b9;
  }
`;

const LoadingOrErrorContainer = styled.div`
    padding: 4rem;
    text-align: center;
    color: #95a5a6;
    width: 100%;
`;


export default function AdminPage() {
  const [levelInput, setLevelInput] = useState<string>('0');
  const [apiParam, setApiParam] = useState<string>('2');

  const [data, setData] = useState<TreeInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:3002/game/getALLTreeInfo/${apiParam}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const result = await response.json();
        setData(Array.isArray(result.data) ? result.data : []);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiParam]);

  const handleSearch = () => {
    setApiParam(levelInput);
  };

  const doneCount = data.length;

  return (
    <DashboardLayout $bgColor="#1c2833">
        <ControlsContainer>
            <PageTitle>유저정보</PageTitle>
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

        <GridContainer>
            <GridItem $lg={12} $md={12} $xs={12}>
                {loading ? (
                  <LoadingOrErrorContainer>데이터를 불러오는 중입니다...</LoadingOrErrorContainer>
                ) : error ? (
                  <LoadingOrErrorContainer>데이터 로딩 중 오류가 발생했습니다: {error}</LoadingOrErrorContainer>
                ) : (
                  <ProjectListCard title="나무 목록" subtitle={`${doneCount}개의 정보 조회됨`}>
                    {data.map((tree, index) => (
                      <ProjectListItem
                        key={index}
                        //icon={TREE_ICONS[index % TREE_ICONS.length]}
                        nameKr={tree.name_KR}
                        nameEn={tree.name_EN}
                        co2={tree.co2_1}
                        life={tree.life_1}
                      />
                    ))}
                  </ProjectListCard>
                )}
            </GridItem>
        </GridContainer>
    </DashboardLayout>
  );
}