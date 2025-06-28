// frontend/src/app/edge-editor/RegionControls.tsx
'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { useEditorStore, Region } from '@/store/editorStore';
import { v4 as uuidv4 } from 'uuid';

const ControlsWrapper = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 80px;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #2980b9;
  }
`;

export const RegionControls = () => {
  const [regionCount, setRegionCount] = useState(1);
  const { setRegions } = useEditorStore();

  const handleApply = () => {
    if (regionCount > 0 && regionCount <= 10) { // 최대 10개 영역으로 제한
      const newSize = 100 / regionCount;
      const newRegions: Region[] = Array.from({ length: regionCount }, (_, i) => ({
        id: uuidv4(), // 각 영역에 고유 ID 부여
        size: newSize,
        content: null,
      }));
      setRegions(newRegions);
    } else {
      alert('영역 개수는 1에서 10 사이로 지정해주세요.');
    }
  };

  return (
    <ControlsWrapper>
      <label htmlFor="region-count">영역 개수:</label>
      <Input
        id="region-count"
        type="number"
        min="1"
        max="10"
        value={regionCount}
        onChange={(e) => setRegionCount(parseInt(e.target.value, 10))}
      />
      <Button onClick={handleApply}>적용</Button>
    </ControlsWrapper>
  );
};