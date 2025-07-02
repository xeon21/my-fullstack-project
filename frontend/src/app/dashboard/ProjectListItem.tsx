'use client';


import React from 'react';
import styled from 'styled-components';


const ItemRow = styled.div`
  display: flex;
  align-items: center;
  padding: 0.7rem 0;
  border-bottom: 1px solid #34495e;

  &:last-child {
    border-bottom: none;
  }
`;

const Column = styled.div<{ $flex: number; $align?: string }>`
  flex: ${props => props.$flex};
  padding: 0 1rem;
  color:rgb(172, 177, 179);
  font-size: 0.83rem;
  font-weight: 400;
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
  background-color:rgb(202, 60, 179);
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
  

  const completion = (life / 24) * 100;
  // Math.random()을 사용하여 0부터 100 사이의 랜덤 값을 생성합니다.
  const completion2= Math.random() * 100;

  return (
    <ItemRow>
      <CompanyColumn $flex={3}>
       
        <span>{nameKr}</span>
      </CompanyColumn>
      <Column $flex={2}>{nameEn}</Column>
      <Column $flex={2} $align="center">{co2.toFixed(3)}</Column>
      <Column $flex={3}>
        <ProgressBarContainer>
          <ProgressBar $progress={completion2} />
        </ProgressBarContainer>
      </Column>
    </ItemRow>
  );
}