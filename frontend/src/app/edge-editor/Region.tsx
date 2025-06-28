// frontend/src/app/edge-editor/Region.tsx
'use client';

import React from 'react';
import styled from 'styled-components';
import { useEditorStore, Region as RegionType } from '@/store/editorStore';

// [수정] isOver 관련 스타일 제거, isSelected 스타일 강조
const Zone = styled.div<{ $isSelected: boolean }>`
  height: 100%;
  width: 100%;
  border: 2px dashed ${props => props.$isSelected ? '#e67e22' : '#3498db'};
  box-shadow: ${props => props.$isSelected ? '0 0 10px rgba(230, 126, 34, 0.5)' : 'none'};
  padding: 1rem;
  box-sizing: border-box;
  background-color: #f0f8ff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: all 0.2s;
  cursor: pointer;

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
  region: RegionType;
  // [추가] 부모 컴포넌트로부터 파일 선택을 트리거하는 함수를 받습니다.
  onZoneClick: (regionId: string) => void; 
}

export const Region = ({ region, onZoneClick }: RegionProps) => {
  const { selectedRegionId, setSelectedRegionId } = useEditorStore();
  const isSelected = selectedRegionId === region.id;

  const handleClick = () => {
    // 콘텐츠가 없으면 파일 업로드 로직 실행
    if (!region.content) {
      onZoneClick(region.id);
    } else {
      // 콘텐츠가 있으면 선택 모드로 전환
      setSelectedRegionId(region.id);
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