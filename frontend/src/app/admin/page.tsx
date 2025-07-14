// frontend/src/app/admin/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import DashboardLayout from '../components/layout/DashboardLayout';
import { GridContainer, GridItem } from '../components/layout/Grid';
import ProjectListCard from '../dashboard/ProjectListCard';
import ProjectListItem from '../dashboard/ProjectListItem';
import ServerStatusCard from '../components/dashboard/ServerStatusCard';
import ServerStatusListItem from '../components/dashboard/ServerStatusListItem';

import {SectionWrapper} from '../board/BoardLayout';

// 타입 정의
interface TreeInfo {
  itemLv: number;
  name_KR: string;
  name_EN: string;
  co2_1: number;
  life_1: number;
}
interface ServerStatus {
  serverName: string;
  regeion: string;
  serverStatus: string;
}

// 스타일 컴포넌트
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
  cursor: pointer;
  &:hover { background-color: #2980b9; }
`;
const LoadingOrErrorContainer = styled.div`
    padding: 4rem;
    text-align: center;
    color: #95a5a6;
    width: 100%;
`;


export default function AdminPage() {
  const [userLevelInput, setUserLevelInput] = useState<string>('0');
  const [userApiParam, setUserApiParam] = useState<string>('2');
  const [userData, setUserData] = useState<TreeInfo[]>([]);
  const [userLoading, setUserLoading] = useState<boolean>(true);
  const [userError, setUserError] = useState<string | null>(null);

  const [serverLevelInput, setServerLevelInput] = useState<string>('1');
  const [serverApiParam, setServerApiParam] = useState<string>('1');
  const [serverData, setServerData] = useState<ServerStatus[]>([]);
  const [serverLoading, setServerLoading] = useState<boolean>(true);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
        setUserLoading(true);
        setUserError(null);
        try {
            const response = await fetch(`http://172.16.83.8:3002/game/getALLTreeInfo/${userApiParam}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const result = await response.json();
            setUserData(Array.isArray(result.data) ? result.data : []);
        } catch (e: any) {
            setUserError(e.message);
        } finally {
            setUserLoading(false);
        }
    };
    fetchUserData();
  }, [userApiParam]);

  useEffect(() => {
    const fetchServerData = async () => {
        setServerLoading(true);
        setServerError(null);
        try {
            const response = await fetch(`http://172.16.83.8:3002/game/getServerStatus/${serverApiParam}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const result = await response.json();
            setServerData(Array.isArray(result.data) ? result.data : []);
        } catch (e: any) {
            setServerError(e.message);
        } finally {
            setServerLoading(false);
        }
    };
    fetchServerData();
  }, [serverApiParam]);

  const handleUserSearch = () => setUserApiParam(userLevelInput);
  const handleServerSearch = () => setServerApiParam(serverLevelInput);

  return (
    <DashboardLayout $bgColor="#1c2833">
      <SectionWrapper>
        <GridContainer $gap="2rem">
          {/* [수정] 그리드 비율을 8:4로 명확하게 조정합니다. */}
          <GridItem $lg={7} $md={12} $xs={12}>
            {userLoading ? (
              <LoadingOrErrorContainer>유저 정보를 불러오는 중입니다...</LoadingOrErrorContainer>
            ) : userError ? (
              <LoadingOrErrorContainer>유저 정보 로딩 중 오류 발생: {userError}</LoadingOrErrorContainer>
            ) : (
              <ProjectListCard
                title="유저정보"
                subtitle={`${userData.length}개의 정보 조회됨`}
                headerControls={
                  <div>
                    <SearchInput
                      type="number"
                      value={userLevelInput}
                      onChange={(e) => setUserLevelInput(e.target.value)}
                      placeholder="레벨 입력"
                    />
                    <SearchButton onClick={handleUserSearch}>유저 조회</SearchButton>
                  </div>
                }
              >
                {userData.map((tree, index) => (
                  <ProjectListItem
                    key={index}
                    nameKr={tree.name_KR}
                    nameEn={tree.name_EN}
                    co2={tree.co2_1}
                    life={tree.life_1}
                  />
                ))}
              </ProjectListCard>
            )}
          </GridItem>

          <GridItem $lg={5} $md={12} $xs={12}>
            {serverLoading ? (
              <LoadingOrErrorContainer>서버 상태를 불러오는 중입니다...</LoadingOrErrorContainer>
            ) : serverError ? (
              <LoadingOrErrorContainer>서버 상태 로딩 중 오류 발생: {serverError}</LoadingOrErrorContainer>
            ) : (
              <ServerStatusCard
                title="서버 목록"
                headerControls={
                  <div>
                    <SearchInput
                      type="number"
                      value={serverLevelInput}
                      onChange={(e) => setServerLevelInput(e.target.value)}
                      placeholder="서버 ID 입력"
                    />
                    <SearchButton onClick={handleServerSearch}>서버 조회</SearchButton>
                  </div>
                }
              >
                {serverData.map((server, index) => (
                  <ServerStatusListItem
                    key={index}
                    serverName={server.serverName}
                    region={server.regeion}
                    status={server.serverStatus}
                  />
                ))}
              </ServerStatusCard>
            )}
          </GridItem>
        </GridContainer>
      </SectionWrapper>
      <GridContainer $gap="2rem">
        <GridItem $lg={12} $md={12} $xs={12}>
          <ProjectListCard
            title="프로젝트 관리"
            subtitle="프로젝트 목록을 관리합니다."
            headerControls={
              <div>
                <SearchInput
                  type="text"
                  placeholder="프로젝트 이름 검색"
                />
                <SearchButton>검색</SearchButton>
              </div>
            }
          >
            {userData.map((tree, index) => (
                <ProjectListItem
                  key={index}
                  nameKr={tree.name_KR}
                  nameEn={tree.name_EN}
                  co2={tree.co2_1}
                  life={tree.life_1}
                />
              ))}
            {/* 여기에 프로젝트 목록 아이템을 추가할 수 있습니다. */}
          </ProjectListCard>
        </GridItem>
        </GridContainer>
    </DashboardLayout>
  );
}