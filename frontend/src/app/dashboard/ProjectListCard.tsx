'use client';

import React from 'react';
import styled from 'styled-components';
import Card from '../components/layout/Card'; // 이전에 만든 범용 Card 컴포넌트 사용

const Header = styled.div`
  padding: 0 1rem 1rem 1rem;
`;

const Title = styled.h3`
  color: white;
  margin: 0 0 0.25rem 0;
`;

const Subtitle = styled.p`
  color:rgb(228, 236, 236);
  font-size: 0.875rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  span {
    color: #2ecc71;
    font-weight: bold;
  }
`;

const TableHeader = styled.div`
    display: flex;
    padding: 0 1rem 0.5rem 1rem;
    border-bottom: 1px solid #34495e;
    color:rgb(232, 241, 241);
    font-size: 1rem;
    text-transform: uppercase;
`;

 const Column = styled.div<{ $flex: number; $align?: string }>`
  flex: ${props => props.$flex};
  text-align: ${props => props.$align || 'left'};
`;

const ListContainer = styled.div`
    /* 내용이 많아지면 스크롤 가능 */
    overflow-y: auto;
`;

interface ProjectListCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function ProjectListCard({ title, subtitle, children }: ProjectListCardProps) {
  return (
    <Card $padding="1.5rem" $bgColor="#2c3e50">
      <Header>
        <Title>{title}</Title>
        <Subtitle>
          <span>✔️</span> {subtitle}
        </Subtitle>
      </Header>
      <TableHeader>
          <Column $flex={3}>이름 (한글)</Column>
          <Column $flex={2}>이름 (영문)</Column>
          <Column $flex={2} $align="center">맨 먼쓰</Column>
          <Column $flex={3}>작업 진행</Column>
      </TableHeader>
      <ListContainer>
        {children}
      </ListContainer>
    </Card>
  );
}