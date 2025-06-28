// frontend/src/app/edge-editor/page.tsx
'use client';

import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useEditorStore, Content } from '@/store/editorStore';

import { RegionControls } from './RegionControls';
import { Region } from './Region';
import { PropertyInspector } from './PropertyInspector';
import { ContentTypeModal } from './ContentTypeModal'; // [추가] 모달 컴포넌트 임포트


const EditorLayout = styled.div`
  display: flex;
  height: calc(100vh - 5rem);
  background-color: #ffffff;
  color: #333;
`;

const Sidebar = styled.div`
  width: 250px;
  padding: 1rem;
  border-right: 1px solid #e0e0e0;
  background-color: #f8f9fa;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex-grow: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
`;

const ControlsWrapper = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
`;

const FilenameInput = styled.input`
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 150px;
`;

const ResetButton = styled.button`
  padding: 0.6rem 1.2rem;
  background-color: #95a5a6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background-color: #7f8c8d;
  }
`;

const ExportButton = styled.button`
  padding: 0.6rem 1.2rem;
  background-color: #e67e22;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background-color: #d35400;
  }
`;

const CanvasWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 2rem auto;
  border: 2px solid #ccc;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  aspect-ratio: 8 / 1;
  display: flex;
`;

const ResizeHandle = styled(PanelResizeHandle)`
  width: 12px;
  background-clip: padding-box;
  background-color: #e0e0e0;
  border: 4px solid transparent;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #3498db;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

export default function EdgeEditorPage() {
  const { regions, updateRegionSize, updateRegionContent, reset } = useEditorStore();
  const [exportFilename, setExportFilename] = useState('display');
  
  // [추가] 모달 상태 관리
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRegionForUpload, setSelectedRegionForUpload] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // [수정] 빈 영역 클릭 시 모달을 엽니다.
  const handleZoneClick = (regionId: string) => {
    setSelectedRegionForUpload(regionId);
    setIsModalOpen(true);
  };

  // [추가] 모달에서 타입을 선택하고 '확인'을 눌렀을 때 실행되는 함수
  const handleContentTypeSelect = (contentType: Content['type']) => {
    setIsModalOpen(false); // 모달 닫기
    
    if (!selectedRegionForUpload) return;
    
    const fileInput = fileInputRef.current;
    if (fileInput) {
        // 선택된 타입에 따라 파일 종류 필터링
        if (contentType === 'image') fileInput.accept = 'image/*';
        else if (contentType === 'video') fileInput.accept = 'video/*';
        else fileInput.accept = '.html';
        
        // 파일 탐색기 열기
        fileInput.click();
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const regionId = selectedRegionForUpload;

    if (file && regionId) {
        const contentType = file.type.startsWith('image') ? 'image' : 
                            file.type.startsWith('video') ? 'video' : 'webpage';

        const reader = new FileReader();

        reader.onload = (e) => {
            const newContent: Content = {
                type: contentType,
                src: e.target?.result as string,
            };
            updateRegionContent(regionId, newContent);
        };
        
        if (contentType === 'webpage') {
            reader.readAsText(file);
        } else {
            reader.readAsDataURL(file);
        }
    }
    event.target.value = '';
    setSelectedRegionForUpload(null); // 초기화
  };

  const handleExport = () => {
    // ... (내보내기 로직은 이전과 동일)
    const htmlContent = `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>${exportFilename}</title>
  <style>
    body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background-color: black; }
    .container { display: flex; width: 100%; height: 100%; }
    .region { height: 100%; box-sizing: border-box; overflow: hidden; background-color: #eee; }
    .region img, .region video, .region iframe { width: 100%; height: 100%; object-fit: cover; border: none; }
  </style>
</head>
<body>
  <div class="container">
    ${regions.map(region => {
      let contentHtml = '';
      if (region.content) {
        switch (region.content.type) {
          case 'image':
            contentHtml = `<img src="${region.content.src}" alt="">`;
            break;
          case 'video':
            contentHtml = `<video src="${region.content.src}" autoplay muted loop playsinline></video>`;
            break;
          case 'webpage':
            const escapedSrc = region.content.src.replace(/"/g, '&quot;');
            contentHtml = `<iframe srcdoc="${escapedSrc}"></iframe>`;
            break;
        }
      }
      return `<div class="region" style="flex-basis: ${region.size}%;">${contentHtml}</div>`;
    }).join('')}
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = exportFilename.endsWith('.html') ? exportFilename : `${exportFilename}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
      <>
        {/* [추가] 모달 렌더링 */}
        {isModalOpen && (
          <ContentTypeModal 
            onClose={() => setIsModalOpen(false)} 
            onConfirm={handleContentTypeSelect}
          />
        )}
        <EditorLayout>
          <Sidebar>
            {/* [수정] 사이드바에 콘텐츠 추가 관련 UI 제거 */}
            <PropertyInspector />
          </Sidebar>
          <MainContent>
            <Header>
              <h1>엣지 디스플레이 에디터</h1>
              <ControlsWrapper>
                <ResetButton onClick={() => {
                  if (confirm('정말로 모든 작업을 초기화하시겠습니까?')) {
                    reset();
                  }
                }}>
                  초기화
                </ResetButton>
                <FilenameInput
                  type="text"
                  value={exportFilename}
                  onChange={(e) => setExportFilename(e.target.value)}
                  placeholder="내보낼 파일명"
                />
                <ExportButton onClick={handleExport}>HTML로 내보내기</ExportButton>
              </ControlsWrapper>
            </Header>
            <RegionControls />
            <CanvasWrapper>
              <PanelGroup
                direction="horizontal"
                onLayout={(sizes) => updateRegionSize(sizes)}
                style={{ width: '100%', height: '100%' }}
              >
                {regions.map((region, index) => (
                  <React.Fragment key={region.id}>
                    <Panel defaultSize={region.size} minSize={5}>
                      <Region region={region} onZoneClick={handleZoneClick} />
                    </Panel>
                    {index < regions.length - 1 && <ResizeHandle />}
                  </React.Fragment>
                ))}
              </PanelGroup>
            </CanvasWrapper>
          </MainContent>
          <HiddenFileInput
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </EditorLayout>
      </>
  );
}

// ... 생략된 스타일 컴포넌트들 ...