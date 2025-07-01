// frontend/src/app/editor/new/page.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios'; // [수정] isAxiosError를 위해 기본 axios도 임포트합니다.
import axiosInstance from '@/lib/axios';
import { useEditorStore, Content, SavedState } from '@/store/editorStore';
import { useAuthStore } from '@/store/authStore';
import { ContentTypeModal } from '../ContentTypeModal';
import { SceneEditor } from '../SceneEditor';
import { ProjectLoadModal } from '../ProjectLoadModal';

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

const ProjectNameInput = styled.input`
  padding: 0.5rem;
  border: 1px solid transparent;
  border-radius: 4px;
  font-size: 1.2rem;
  font-weight: 600;
  &:hover, &:focus {
    border-color: #ccc;
  }
`;

const ControlsWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
`;

const ControlButton = styled.button<{ $primary?: boolean; $secondary?: boolean; $danger?: boolean; }>`
  padding: 0.4rem 0.8rem;
  background-color: ${props => 
    props.$primary ? '#e67e22' : 
    props.$danger ? '#c0392b' :
    props.$secondary ? '#3498db' : 
    '#95a5a6'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.8rem;
  white-space: nowrap;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.85;
  }
`;

const EditorLayout = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

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
    const { scenes, addScene, updateRegionContent, reset, loadState } = useEditorStore();
    
    const searchParams = useSearchParams();
    const router = useRouter();
    const projectIdFromUrl = searchParams.get('id');

  const [projectName, setProjectName] = useState('새 프로젝트');
  const [currentProjectId, setCurrentProjectId] = useState<number | null>(null);
  const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
  const [isContentTypeModalOpen, setIsContentTypeModalOpen] = useState(false);
  const [uploadInfo, setUploadInfo] = useState<{ sceneId: string, regionId: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const loadProjectInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const projectId = projectIdFromUrl ? parseInt(projectIdFromUrl, 10) : null;
    if (projectId && projectId !== currentProjectId) {
      const fetchProject = async () => {
        try {
          const response = await axiosInstance.get(`/projects/${projectId}`);
          const { name, data } = response.data;
          setProjectName(name);
          loadState(data);
          setCurrentProjectId(projectId);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status !== 401) {
                alert("프로젝트를 불러올 수 없습니다.");
            }
            router.push('/editor/new');
        }
      };
      fetchProject();
    } else if (!projectId) {
        reset();
        setProjectName('새 프로젝트');
        setCurrentProjectId(null);
    }
  }, [projectIdFromUrl, loadState, reset, router, currentProjectId]);


  const handleZoneClick = (sceneId: string, regionId: string) => {
    setUploadInfo({ sceneId, regionId });
    setIsContentTypeModalOpen(true);
  };

  const handleContentTypeSelect = (contentType: Content['type']) => {
    setIsContentTypeModalOpen(false);
    if (!uploadInfo) return;
    
    const fileInput = fileInputRef.current;
    if (fileInput) {
        if (contentType === 'image') fileInput.accept = 'image/*';
        else if (contentType === 'video') fileInput.accept = 'video/*';
        else fileInput.accept = '.html,.htm';
        
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
    if (event.target) event.target.value = '';
    setUploadInfo(null);
  };

  const handleAddScene = () => {
    const name = prompt('새 씬의 이름을 입력하세요:', `씬 ${scenes.length + 1}`);
    if (name) {
      addScene(name);
    }
  };

  const handleSave = async () => {
    if (!projectName.trim()) {
        alert('프로젝트 이름을 입력해주세요.');
        return;
    }
    const stateToSave: SavedState = { scenes };
    try {
      if (currentProjectId) {
        await axiosInstance.put(`/projects/${currentProjectId}`, {
          name: projectName, data: stateToSave,
        });
        alert('프로젝트가 성공적으로 업데이트되었습니다.');
      } else {
        const response = await axiosInstance.post('/projects', {
          name: projectName, data: stateToSave,
        });
        alert('새 프로젝트가 저장되었습니다.');
        router.push(`/editor/new?id=${response.data.id}`);
      }
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status !== 401) {
            console.error("프로젝트 저장/업데이트 실패:", error);
            alert("프로젝트 저장에 실패했습니다.");
        }
    }
  };

  const handleLoadProject = (projectId: number) => {
    router.push(`/editor/new?id=${projectId}`);
    setIsLoadModalOpen(false);
  };
  
  const handleExport = () => { /* 이전과 동일 */ };
  
  return (
      <>
        {isLoadModalOpen && (
          <ProjectLoadModal 
            onClose={() => setIsLoadModalOpen(false)}
            onLoad={handleLoadProject}
          />
        )}
        {isContentTypeModalOpen && (
          <ContentTypeModal 
            onClose={() => setIsContentTypeModalOpen(false)} 
            onConfirm={handleContentTypeSelect}
          />
        )}
        <PageWrapper>
            <Header>
              <ProjectNameInput
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="프로젝트 이름"
              />
              <ControlsWrapper>
                <ControlButton onClick={handleSave}>DB에 저장</ControlButton>
                <ControlButton onClick={() => setIsLoadModalOpen(true)}>불러오기</ControlButton>
                <ControlButton $danger onClick={() => router.push('/editor/new')}>새 프로젝트</ControlButton>
                <ControlButton $primary onClick={handleExport}>HTML로 내보내기</ControlButton>
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
        {/* 파일로 불러오기 기능은 이제 DB 연동으로 대체되었습니다. */}
      </>
  );
}