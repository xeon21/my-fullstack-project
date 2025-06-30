// frontend/src/app/edge-editor/Region.tsx
'use client';

import React from 'react';
import styled from 'styled-components';
import { useEditorStore, Region as RegionType } from '@/store/editorStore';
const Zone = styled.div<{ $isSelected: boolean }>`
  height: 100%;
  width: 100%;
  border: 2px dashed ${props => props.$isSelected ? '#e67e22' : '#3498db'};
  box-shadow: ${props => props.$isSelected ? '0 0 10px rgba(230, 126, 34, 0.5)' : 'none'};
  padding: 0.5rem; /* 1rem -> 0.5rem */
  box-sizing: border-box;
  background-color: #f0f8ff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: all 0.2s;
  cursor: pointer;

  p {
      font-size: 0.85rem; /* 폰트 크기 조정 */
      color: #555;
  }

  &:hover {
    background-color: #e0f0ff;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  pointer-events: none;
  img, video, iframe {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border: none;
  }
`;

interface RegionProps {
  sceneId: string; // [추가]
  region: RegionType;
  onZoneClick: () => void; // [수정] 인자 불필요
}

export const Region = ({ sceneId, region, onZoneClick }: RegionProps) => {
  const { selectedRegionId, setSelectedRegionId } = useEditorStore();
  
  // [수정] isSelected 확인 로직 변경
  const isSelected = selectedRegionId?.sceneId === sceneId && selectedRegionId?.regionId === region.id;

  const handleClick = () => {
    if (!region.content) {
      onZoneClick();
    } else {
      // [수정] setSelectedRegionId에 sceneId와 regionId를 전달
      setSelectedRegionId(sceneId, region.id);
    }
  };

  const renderContent = () => {
    if (!region.content) {
      return <p>클릭하여 콘텐츠 추가</p>;
    }
    switch (region.content.type) {
      case 'image':
        return <img src={region.content.src} alt="콘텐츠 이미지" />;
      case 'video':
        return <video src={region.content.src} controls />;
      case 'webpage':
        return <iframe srcDoc={region.content.src} title="웹페이지 콘텐츠" />;
      default:
        return null;
    }
  };

  return (
    <Zone
      $isSelected={isSelected}
      onClick={handleClick}
    >
      <ContentWrapper>
        {renderContent()}
      </ContentWrapper>
    </Zone>
  );
};