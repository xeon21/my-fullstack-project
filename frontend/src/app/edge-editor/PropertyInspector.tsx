// frontend/src/app/edge-editor/PropertyInspector.tsx
'use client';

import React from 'react';
import styled from 'styled-components';
import { useEditorStore } from '@/store/editorStore';

const InspectorWrapper = styled.div`
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
`;

const Title = styled.h4`
  margin-bottom: 1rem;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.6rem 1rem;
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #229954;
  }
`;

// 파일 입력을 숨기기 위한 스타일
const HiddenFileInput = styled.input`
  display: none;
`;

export const PropertyInspector = () => {
  const { regions, selectedRegionId, updateRegionContent } = useEditorStore();
  const selectedRegion = regions.find(r => r.id === selectedRegionId);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  if (!selectedRegion || !selectedRegion.content) {
    return (
      <InspectorWrapper>
        <p>속성을 편집할 영역을 선택하세요.</p>
      </InspectorWrapper>
    );
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && selectedRegion && selectedRegion.content) {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateRegionContent(selectedRegion.id, {
          ...selectedRegion.content!,
          src: e.target?.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const getAcceptType = () => {
    switch (selectedRegion?.content?.type) {
      case 'image': return 'image/*';
      case 'video': return 'video/*';
      default: return '';
    }
  }

  return (
    <InspectorWrapper>
      <Title>'{selectedRegion.content.type}' 속성</Title>
      <Button onClick={() => fileInputRef.current?.click()}>
        파일 변경
      </Button>
      <HiddenFileInput
        type="file"
        ref={fileInputRef}
        accept={getAcceptType()}
        onChange={handleFileChange}
      />
    </InspectorWrapper>
  );
};