// frontend/src/app/editor/new/page.tsx
'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import axiosInstance from '@/lib/axios';
import { useEditorStore, Content, SavedState } from '@/store/editorStore';
import { useAuthStore } from '@/store/authStore';
import { ContentTypeModal } from '../ContentTypeModal';
import { ProjectLoadModal } from '../ProjectLoadModal';
import { ConfirmOverwriteModal } from '../ConfirmOverwriteModal';
import { SortableSceneItem } from '../SortableSceneItem';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import DashboardLayout from '../../components/layout/DashboardLayout';

const PageWrapper = styled.div`
  padding: 1rem;
  background-color:rgb(220, 225, 233);
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
    '#7f8c8d'};
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
    const { scenes, addScene, updateRegionContent, reset, loadState, overwriteConfirm, clearOverwriteConfirm, moveScene, fetchCanvasResolutions } = useEditorStore();
    const { accessToken } = useAuthStore();

    const searchParams = useSearchParams();
    const router = useRouter();
    const projectIdFromUrl = searchParams.get('id');

    const [projectName, setProjectName] = useState('');
    const [currentProjectId, setCurrentProjectId] = useState<number | null>(null);
    const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
    const [isContentTypeModalOpen, setIsContentTypeModalOpen] = useState(false);
    const [uploadInfo, setUploadInfo] = useState<{ sceneId: string, regionId: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const projectNameInputRef = useRef<HTMLInputElement>(null);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor)
    );

    const handleSceneDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = scenes.findIndex((s) => s.id === active.id);
            const newIndex = scenes.findIndex((s) => s.id === over.id);
            if (oldIndex !== -1 && newIndex !== -1) {
                moveScene(oldIndex, newIndex);
            }
        }
    }, [scenes, moveScene]);

    useEffect(() => {
        fetchCanvasResolutions();
    }, [fetchCanvasResolutions]);
    
    useEffect(() => {
        const projectId = projectIdFromUrl ? parseInt(projectIdFromUrl, 10) : null;

        const fetchProject = async (id: number) => {
            try {
              const response = await axiosInstance.get(`/projects/${id}`);
              const { name, data } = response.data;
              setProjectName(name);
              loadState(data);
              setCurrentProjectId(id);
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status !== 401) {
                    alert("프로젝트를 불러올 수 없습니다.");
                }
                router.push('/editor/new');
            }
        };

        if (projectId && projectId !== currentProjectId) {
          fetchProject(projectId);
        } else if (!projectId) {
            reset();
            setProjectName('');
            setCurrentProjectId(null);
            projectNameInputRef.current?.focus();
        }
    }, [projectIdFromUrl, currentProjectId, loadState, reset, router]);

    const processFile = (file: File, sceneId: string, regionId: string) => {
        const contentType = file.type.startsWith('image') ? 'image' :
                              file.type.startsWith('video') ? 'video' : 'webpage';

        if (contentType === 'webpage' && !/\.(html|htm)$/i.test(file.name)) {
            alert('웹페이지 콘텐츠는 .html 또는 .htm 파일만 가능합니다.');
            return;
        }

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
    };

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
            processFile(file, sceneId, regionId);
        }
        if (event.target) event.target.value = '';
        setUploadInfo(null);
    };
    
    const handleFileDrop = (sceneId: string, regionId: string, file: File) => {
        processFile(file, sceneId, regionId);
    };

    const handleConfirmOverwrite = () => {
        if (overwriteConfirm) {
            const { sceneId, regionId, file } = overwriteConfirm;
            processFile(file, sceneId, regionId);
            clearOverwriteConfirm();
        }
    };

    const handleAddScene = () => {
        const name = prompt('새 씬의 이름을 입력하세요:', `씬 ${scenes.length + 1}`);
        if (name) {
          addScene(name);
        }
    };

    const handleSave = async () => {
        if (!projectName.trim()) {
            alert('컨텐츠 명을 입력해 주세요.');
            projectNameInputRef.current?.focus();
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

    const handleExport = () => { /* ... */ };

    const handleNewProject = () => {
        reset();
        setProjectName('');
        setCurrentProjectId(null);
        if (projectIdFromUrl) {
          router.push('/editor/new');
        }
        setTimeout(() => projectNameInputRef.current?.focus(), 0);
    };
  
    return (
        <>
            {isLoadModalOpen && <ProjectLoadModal onClose={() => setIsLoadModalOpen(false)} onLoad={handleLoadProject} />}
            {isContentTypeModalOpen && <ContentTypeModal onClose={() => setIsContentTypeModalOpen(false)} onConfirm={handleContentTypeSelect} />}
            {overwriteConfirm && <ConfirmOverwriteModal onConfirm={handleConfirmOverwrite} onCancel={clearOverwriteConfirm} />}
            
            <PageWrapper>
                <Header>
                    <ProjectNameInput ref={projectNameInputRef} type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="컨텐츠 명을 입력해 주세요" />
                    <ControlsWrapper>
                        <ControlButton onClick={handleSave}>{currentProjectId ? '수정하기' : 'DB에 저장'}</ControlButton>
                        <ControlButton $secondary onClick={() => setIsLoadModalOpen(true)}>불러오기</ControlButton>
                        <ControlButton $danger onClick={handleNewProject}>새 프로젝트</ControlButton>
                        <ControlButton $primary onClick={handleExport}>HTML로 내보내기</ControlButton>
                    </ControlsWrapper>
                </Header>
                <EditorLayout>
                    <MainColumn>
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleSceneDragEnd}
                        >
                            <SortableContext items={scenes.map(s => s.id)} strategy={verticalListSortingStrategy}>
                                {scenes.map(scene => (
                                    <SortableSceneItem
                                        key={scene.id}
                                        scene={scene}
                                        onZoneClick={handleZoneClick}
                                        onFileDrop={handleFileDrop}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>
                        <AddSceneButton onClick={handleAddScene}>+ 새 씬 추가</AddSceneButton>
                    </MainColumn>
                </EditorLayout>
            </PageWrapper>
            
            <HiddenFileInput type="file" ref={fileInputRef} onChange={handleFileChange} />
        </>
    );
}