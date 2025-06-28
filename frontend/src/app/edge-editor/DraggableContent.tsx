// frontend/src/app/edge-editor/DraggableContent.tsx
'use client';

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import styled from 'styled-components';

const DraggableWrapper = styled.div`
  padding: 0.8rem 1rem;
  margin-bottom: 0.5rem;
  background-color: #ecf0f1;
  border-radius: 4px;
  cursor: grab;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: #bdc3c7;
  }

  &:active {
    cursor: grabbing;
  }
`;

interface DraggableContentProps {
  id: string;
  children: React.ReactNode;
}

export const DraggableContent = ({ id, children }: DraggableContentProps) => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id });
  
  return (
    <DraggableWrapper ref={setNodeRef} {...listeners} {...attributes}>
      {children}
    </DraggableWrapper>
  );
};