// frontend/src/app/edge-editor/page.tsx
'use client';

import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { useEditorStore, Content } from '@/store/editorStore';
import { ContentTypeModal } from './ContentTypeModal';
import { SceneEditor } from './SceneEditor';

const PageWrapper = styled.div`
  padding: 1rem;
  background-color: #f0f2f5;
  min-height: 100vh;
`;

const Header = styled.header`
  max-width: 1280px;
  margin: 0 auto 1.5rem auto;
  padding: 0.8rem 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: 1.2rem;
`;

const ControlsWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const FilenameInput = styled.input`
  padding: 0.4rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 120px;
  font-size: 0.8rem;
`;

const ResetButton = styled.button`
  padding: 0.4rem 0.8rem;
  background-color: #95a5a6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.8rem;

  &:hover {
    background-color: #7f8c8d;
  }
`;

const ExportButton = styled.button`
  padding: 0.4rem 0.8rem;
  background-color: #e67e22;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.8rem;

  &:hover {
    background-color: #d35400;
  }
`;

const EditorLayout = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

// [추가] 누락되었던 MainColumn 스타일 정의
const MainColumn = styled.div`
    flex: 1;
`;

const AddSceneButton = styled.button`
    display: block;
    width: 100%;
    margin-top: 1rem;
    padding: 0.7rem;
    font-size: 0.9rem;
    font-weight: bold;
    color: #3498db;
    background-color: #eaf5ff;
    border: 2px dashed #3498db;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        background-color: #d4e9f9;
        border-color: #2980b9;
    }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

export default function EdgeEditorPage() {
    const { 
        scenes, 
        addScene, 
        updateRegionContent,
        reset
    } = useEditorStore();

  const [exportFilename, setExportFilename] = useState('display');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadInfo, setUploadInfo] = useState<{ sceneId: string, regionId: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleZoneClick = (sceneId: string, regionId: string) => {
    setUploadInfo({ sceneId, regionId });
    setIsModalOpen(true);
  };

  const handleContentTypeSelect = (contentType: Content['type']) => {
    setIsModalOpen(false);
    if (!uploadInfo) return;
    
    const fileInput = fileInputRef.current;
    if (fileInput) {
        if (contentType === 'image') fileInput.accept = 'image/*';
        else if (contentType === 'video') fileInput.accept = 'video/*';
        else fileInput.accept = '.html';
        
        fileInput.click();
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && uploadInfo) {
        const { sceneId, regionId } = uploadInfo;
        const contentType = file.type.startsWith('image') ? 'image' : 
                            file.type.startsWith('video') ? 'video' : 'webpage';

        const reader = new FileReader();
        reader.onload = (e) => {
            updateRegionContent(sceneId, regionId, {
                type: contentType,
                src: e.target?.result as string,
            });
        };
        
        if (contentType === 'webpage') {
            reader.readAsText(file);
        } else {
            reader.readAsDataURL(file);
        }
    }
    if (event.target) {
      event.target.value = '';
    }
    setUploadInfo(null);
  };

  const handleAddScene = () => {
    const name = prompt('새 씬의 이름을 입력하세요:', `씬 ${scenes.length + 1}`);
    if (name) {
      addScene(name);
    }
  };

  const handleExport = () => {
    const sceneData = scenes.map(scene => ({
        id: scene.id,
        html: `
        <div id="scene-${scene.id}" class="scene-container" style="display: none;">
          ${scene.regions.map(region => {
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
      `,
      transitionTime: scene.transitionTime * 1000
    }));

    const script = `
      <script>
        const scenes = ${JSON.stringify(sceneData)};
        let currentSceneIndex = 0;

        function showScene(index) {
          scenes.forEach((scene, i) => {
            const el = document.getElementById('scene-' + scene.id);
            if(el) el.style.display = i === index ? 'flex' : 'none';
          });

          if (scenes.length > 1) {
            const nextDelay = scenes[index].transitionTime;
            if (nextDelay > 0) {
                setTimeout(nextScene, nextDelay);
            }
          }
        }

        function nextScene() {
          currentSceneIndex = (currentSceneIndex + 1) % scenes.length;
          showScene(currentSceneIndex);
        }

        if (scenes.length > 0) {
          showScene(0);
        }
      <\/script>
    `;

    const htmlContent = `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>${exportFilename}</title>
  <style>
    body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background-color: #2c3e50; display: flex; justify-content: center; align-items: center;}
    .display-wrapper { 
        width: 98vw;
        max-width: 1600px;
        border: 2px solid #fff;
        box-shadow: 0 0 20px rgba(0,0,0,0.5);
        aspect-ratio: 8 / 1;
    }
    .scene-container { display: flex; width: 100%; height: 100%; }
    .region { height: 100%; box-sizing: border-box; overflow: hidden; background-color: #eee; }
    .region img, .region video, .region iframe { width: 100%; height: 100%; object-fit: cover; border: none; }
  </style>
</head>
<body>
  <div class="display-wrapper">
    ${sceneData.map(s => s.html).join('')}
  </div>
  ${script}
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
        {isModalOpen && (
          <ContentTypeModal 
            onClose={() => setIsModalOpen(false)} 
            onConfirm={handleContentTypeSelect}
          />
        )}
        <PageWrapper>
            <Header>
              <HeaderTitle>엣지 디스플레이 에디터</HeaderTitle>
              <ControlsWrapper>
                <ResetButton onClick={() => {
                  if (confirm('전체 프로젝트를 초기화하시겠습니까? (모든 씬이 삭제됩니다)')) {
                    reset();
                  }
                }}>
                  전체 초기화
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
            <EditorLayout>
                <MainColumn>
                    {scenes.map(scene => (
                        <SceneEditor key={scene.id} scene={scene} onZoneClick={handleZoneClick} />
                    ))}
                    <AddSceneButton onClick={handleAddScene}>+ 새 씬 추가</AddSceneButton>
                </MainColumn>
            </EditorLayout>
        </PageWrapper>
        
        <HiddenFileInput
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
      </>
  );
}