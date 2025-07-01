// frontend/src/app/editor/Region.tsx
'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { useEditorStore, Region as RegionType } from '@/store/editorStore';

const Zone = styled.div<{ $isSelected: boolean; $isDragOver: boolean; }>`
  position: relative;
  height: 100%;
  width: 100%;
  border: 2px dashed ${props => 
    props.$isDragOver ? '#16a085' :
    props.$isSelected ? '#e67e22' : 
    '#3498db'};
  box-shadow: ${props => props.$isSelected ? '0 0 10px rgba(230, 126, 34, 0.5)' : 'none'};
  padding: 0.5rem;
  box-sizing: border-box;
  background-color: ${props => props.$isDragOver ? '#e8f8f5' : '#f0f8ff'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: all 0.2s;
  cursor: pointer;

  p {
      font-size: 0.85rem;
      color: #555;
      text-align: center;
      pointer-events: none;
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

const SizeDisplay = styled.div`
  position: absolute;
  bottom: 5px;
  right: 8px;
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 2px 6px;
  font-size: 0.75rem;
  font-family: 'Courier New', Courier, monospace;
  font-weight: bold;
  border-radius: 4px;
  pointer-events: none;
`;

interface RegionProps {
  sceneId: string;
  region: RegionType;
  canvasHeight: number; // [수정] 가상 높이를 prop으로 받음
  onZoneClick: () => void;
  onFileDrop: (file: File) => void;
}

const VIRTUAL_CANVAS_WIDTH = 1920;

export const Region = ({ sceneId, region, canvasHeight, onZoneClick, onFileDrop }: RegionProps) => {
  const { selectedRegionId, setSelectedRegionId } = useEditorStore();
  const [isDragOver, setIsDragOver] = useState(false);
  
  const isSelected = selectedRegionId?.sceneId === sceneId && selectedRegionId?.regionId === region.id;

  const handleClick = () => {
    if (!region.content) {
      onZoneClick();
    } else {
      setSelectedRegionId(sceneId, region.id);
    }
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation(); setIsDragOver(true);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation();
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation(); setIsDragOver(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); e.stopPropagation(); setIsDragOver(false);
    if (!region.content && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileDrop(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const renderContent = () => {
    if (!region.content) {
      return <p>클릭하여 콘텐츠를 추가하거나<br/>파일을 끌어다 놓으세요</p>;
    }
    switch (region.content.type) {
      case 'image':
        return <img src={region.content.src} alt="콘텐츠 이미지" />;
      case 'video':
        return <video src={region.content.src} controls muted loop playsInline />;
      case 'webpage':
        return <iframe srcDoc={region.content.src} title="웹페이지 콘텐츠" />;
      default:
        return null;
    }
  };

  const virtualWidth = Math.round(VIRTUAL_CANVAS_WIDTH * (region.size / 100));
  const sizeText = `${virtualWidth} x ${canvasHeight}`;

  return (
    <Zone
      $isSelected={isSelected}
      $isDragOver={isDragOver}
      onClick={handleClick}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <ContentWrapper>
        {renderContent()}
      </ContentWrapper>
      <SizeDisplay>{sizeText}</SizeDisplay>
    </Zone>
  );
};