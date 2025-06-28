'use client';

import React from 'react';
import styled from 'styled-components';

const ItemRow = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #34495e;

  &:last-child {
    border-bottom: none;
  }
`;

const Column = styled.div<{ $flex: number; $align?: string }>`
  flex: ${props => props.$flex};
  padding: 0 1rem;
  color: #ecf0f1;
  font-size: 0.875rem;
  font-weight: 600;
  text-align: ${props => props.$align || 'left'};
`;

const CompanyColumn = styled(Column)`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const IconWrapper = styled.div`
  font-size: 1.5rem;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 6px;
  background-color: #34495e;
  border-radius: 3px;
`;

const ProgressBar = styled.div<{ $progress: number }>`
  width: ${props => props.$progress}%;
  height: 100%;
  background-color: #3498db;
  border-radius: 3px;
`;

interface ProjectListItemProps {
 // icon: React.ReactNode;
  nameKr: string;
  nameEn: string;
  co2: number;
  life: number;
}

export default function ProjectListItem({  nameKr, nameEn, co2, life }: ProjectListItemProps) {
  // life 값을 0-100 사이의 퍼센트로 변환 (최대값을 24로 가정)
  const completion = (life / 24) * 100;

  return (
    <ItemRow>
      <CompanyColumn $flex={3}>
       
        <span>{nameKr}</span>
      </CompanyColumn>
      <Column $flex={2}>{nameEn}</Column>
      <Column $flex={2} $align="center">{co2.toFixed(3)}</Column>
      <Column $flex={3}>
        <ProgressBarContainer>
          <ProgressBar $progress={completion} />
        </ProgressBarContainer>
      </Column>
    </ItemRow>
  );
}