'use client';

import React from 'react';
import styled from 'styled-components';
import Card from '../layout/Card';

const Header = styled.div`
  padding-bottom: 1rem;
`;

const Title = styled.h3`
  color: white;
  margin: 0;
`;

const TableHeader = styled.div`
    display: flex;
    padding: 0 1rem 0.5rem 1rem;
    border-bottom: 1px solid #34495e;
    color: #95a5a6;
    font-size: 0.75rem;
    text-transform: uppercase;
`;

 const Column = styled.div<{ $flex: number; }>`
  flex: ${props => props.$flex};
`;

const ListContainer = styled.div`
  overflow-y: auto;
`;

interface ServerStatusCardProps {
  title: string;
  children: React.ReactNode;
}

export default function ServerStatusCard({ title, children }: ServerStatusCardProps) {
  return (
    <Card $padding="1.5rem" $bgColor="#2c3e50">
      <Header>
        <Title>{title}</Title>
      </Header>
      <TableHeader>
          <Column $flex={3}>Server Name</Column>
          <Column $flex={2}>Region</Column>
          <Column $flex={1}>Status</Column>
      </TableHeader>
      <ListContainer>
        {children}
      </ListContainer>
    </Card>
  );
}