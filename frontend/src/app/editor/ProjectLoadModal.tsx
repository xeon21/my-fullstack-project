// frontend/src/app/editor/ProjectLoadModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const ModalBackdrop = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex; justify-content: center; align-items: center; z-index: 1000;
`;
const ModalContent = styled.div`
  background-color: white; padding: 2rem; border-radius: 8px;
  width: 90%; max-width: 800px; max-height: 80vh;
  display: flex; flex-direction: column;
`;
const Title = styled.h2`
  margin: 0 0 1.5rem 0;
`;
const TableWrapper = styled.div`
  overflow-y: auto;
`;
const ProjectTable = styled.table`
  width: 100%; border-collapse: collapse;
`;
const Th = styled.th`
  background-color: #f8f9fa; padding: 0.8rem 1rem; text-align: left;
  font-size: 0.9rem; color: #555; border-bottom: 1px solid #dee2e6;
`;
const Td = styled.td`
  padding: 1rem; border-bottom: 1px solid #dee2e6; font-size: 0.95rem;
`;
const ActionButton = styled.button`
  background: #3498db; color: white; border: none; padding: 0.5rem 1rem;
  border-radius: 4px; cursor: pointer;
  &:hover { background: #2980b9; }
`;
const CloseButton = styled.button`
  margin-top: 1.5rem; align-self: flex-end;
  background: #bdc3c7; color: #333; border: none; padding: 0.6rem 1.2rem;
  border-radius: 4px; cursor: pointer;
`;

interface Project {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectLoadModalProps {
  onClose: () => void;
  onLoad: (projectId: number) => void;
}

export const ProjectLoadModal = ({ onClose, onLoad }: ProjectLoadModalProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:3002/projects');
        setProjects(response.data);
      } catch (error) {
        console.error("프로젝트 목록 로딩 실패:", error);
        alert("프로젝트 목록을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Title>프로젝트 불러오기</Title>
        <TableWrapper>
          <ProjectTable>
            <thead>
              <tr>
                <Th>이름</Th>
                <Th>최근 수정일</Th>
                <Th>작업</Th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><Td colSpan={3}>로딩 중...</Td></tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id}>
                    <Td>{project.name}</Td>
                    <Td>{new Date(project.updatedAt).toLocaleString()}</Td>
                    <Td>
                      <ActionButton onClick={() => onLoad(project.id)}>
                        불러오기
                      </ActionButton>
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </ProjectTable>
        </TableWrapper>
        <CloseButton onClick={onClose}>닫기</CloseButton>
      </ModalContent>
    </ModalBackdrop>
  );
};