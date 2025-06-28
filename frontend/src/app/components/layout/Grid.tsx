'use client';
import styled from 'styled-components';

interface GridContainerProps {
  $gap?: string; // [수정]
}

export const GridContainer = styled.div<GridContainerProps>`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => props.$gap || '1.5rem'}; // [수정]
`;

interface GridItemProps {
  $lg?: number; // [수정]
  $md?: number; // [수정]
  $xs?: number; // [수정]
}

export const GridItem = styled.div<GridItemProps>`
  flex-grow: 0;
  width: 100%;
  max-width: ${props => props.$xs ? `${(props.$xs / 12) * 100}%` : '100%'}; // [수정]
  flex-basis: ${props => props.$xs ? `${(props.$xs / 12) * 100}%` : '100%'}; // [수정]
  display: flex;

  @media (min-width: 900px) {
    max-width: ${props => props.$md ? `${(props.$md / 12) * 100}%` : 'auto'}; // [수정]
    flex-basis: ${props => props.$md ? `${(props.$md / 12) * 100}%` : 'auto'}; // [수정]
  }

  @media (min-width: 1200px) {
    max-width: ${props => props.$lg ? `${(props.$lg / 12) * 100}%` : 'auto'}; // [수정]
    flex-basis: ${props => props.$lg ? `${(props.$lg / 12) * 100}%` : 'auto'}; // [수정]
  }
`;