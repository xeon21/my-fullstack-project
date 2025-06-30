// frontend/src/app/editor/SceneEditor.tsx
'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useEditorStore, Scene as SceneType, Region as RegionType } from '@/store/editorStore';
import { v4 as uuidv4 } from 'uuid';
import { Region } from './Region';

const SceneWrapper = styled.div`
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
`;

const ControlBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.8rem;
  flex-wrap: wrap;
`;

const SceneHeader = styled.h2`
  margin: 0;
  font-size: 1.1rem;
  flex-shrink: 0;
`;

const ControlGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background-color: #f8f9fa;
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
`;

const StyledInput = styled.input`
  padding: 0.3rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 50px;
  font-size: 0.8rem;
`;

const StyledButton = styled.button<{ $secondary?: boolean }>`
  padding: 0.3rem 0.6rem;
  background-color: ${props => props.$secondary ? '#95a5a6' : '#3498db'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.8rem;

  &:hover {
    background-color: ${props => props.$secondary ? '#7f8c8d' : '#2980b9'};
  }
`;

const CanvasWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 1rem auto 0 auto;
  border: 1px solid #d1d5db;
  aspect-ratio: 8 / 1;
  display: flex;
`;

const ResizeHandle = styled(PanelResizeHandle)`
  width: 8px;
  background-clip: padding-box;
  background-color: #e0e0e0;
  border: 2px solid transparent;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #3498db;
  }
`;

interface SceneEditorProps {
  scene: SceneType;
  onZoneClick: (sceneId: string, regionId: string) => void;
}

export const SceneEditor = ({ scene, onZoneClick }: SceneEditorProps) => {
  const { updateRegionSize, setRegions, updateSceneTransitionTime, resetScene } = useEditorStore();
  
  const [regionCount, setRegionCount] = useState(scene.regions.length);
  const [transitionTime, setTransitionTime] = useState(scene.transitionTime);

  useEffect(() => {
    setRegionCount(scene.regions.length);
    setTransitionTime(scene.transitionTime);
  }, [scene]);

  const handleApplyRegions = () => {
    if (regionCount > 0 && regionCount <= 10) {
      const newSize = 100 / regionCount;
      const newRegions: RegionType[] = Array.from({ length: regionCount }, () => ({
        id: uuidv4(),
        size: newSize,
        content: null,
      }));
      setRegions(scene.id, newRegions);
    } else {
      alert('영역 개수는 1에서 10 사이로 지정해주세요.');
    }
  };
  
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const time = Number(e.target.value);
      setTransitionTime(time);
      updateSceneTransitionTime(scene.id, time);
  };

  const handleResetScene = () => {
    if (confirm(`'${scene.name}' 씬을 초기화하시겠습니까?`)) {
        resetScene(scene.id);
    }
  }

  return (
    <SceneWrapper>
      <ControlBar>
        <SceneHeader>{scene.name}</SceneHeader>
        <div style={{flexGrow: 1}} />
        <ControlGroup>
          <label>영역 개수:</label>
          <StyledInput
            type="number"
            value={regionCount}
            onChange={(e) => setRegionCount(Number(e.target.value))}
            min="1" max="10"
          />
          <StyledButton onClick={handleApplyRegions}>적용</StyledButton>
        </ControlGroup>
        <ControlGroup>
            <label>플레이 시간(초):</label>
            <StyledInput
                type="number"
                value={transitionTime}
                onChange={handleTimeChange}
                min="1"
            />
        </ControlGroup>
        <StyledButton $secondary onClick={handleResetScene}>씬 초기화</StyledButton>
      </ControlBar>
      <CanvasWrapper>
        <PanelGroup
          direction="horizontal"
          onLayout={(sizes) => updateRegionSize(scene.id, sizes)}
          style={{ width: '100%', height: '100%' }}
        >
          {scene.regions.map((region, index) => (
            <React.Fragment key={region.id}>
              <Panel defaultSize={region.size} minSize={5}>
                <Region 
                  sceneId={scene.id} // [수정] sceneId를 prop으로 전달
                  region={region} 
                  onZoneClick={() => onZoneClick(scene.id, region.id)} 
                />
              </Panel>
              {index < scene.regions.length - 1 && <ResizeHandle />}
            </React.Fragment>
          ))}
        </PanelGroup>
      </CanvasWrapper>
    </SceneWrapper>
  );
};