'use client';

import React from 'react';
import styled from 'styled-components';
import StatusIcon from './StatusIcon';

const ItemRow = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #34495e;

  &:last-child {
    border-bottom: none;
  }
`;

const Column = styled.div<{ $flex: number; }>`
  flex: ${props => props.$flex};
  color: #ecf0f1;
  font-size: 0.9rem;
  font-weight: 500;
`;

const ServerNameColumn = styled(Column)`
  font-weight: 700;
`;


interface ServerStatusListItemProps {
  serverName: string;
  region: string;
  status: string;
}

export default function ServerStatusListItem({ serverName, region, status }: ServerStatusListItemProps) {
  const isActive = status === '1';

  return (
    <ItemRow>
      <ServerNameColumn $flex={3}>{serverName}</ServerNameColumn>
      <Column $flex={2}>{region}</Column>
      <Column $flex={1}>
        <StatusIcon isActive={isActive} />
      </Column>
    </ItemRow>
  );
}