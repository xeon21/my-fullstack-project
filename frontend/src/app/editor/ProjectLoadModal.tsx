// frontend/src/app/editor/ProjectLoadModal.tsx
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import { Scene, Content } from '@/store/editorStore';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const ModalBackdrop = styled.div`
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex; justify-content: center; align-items: center; z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white; padding: 1.5rem;
  border-radius: 8px;
  width: 90%; 
  max-width: 1200px;
  max-height: 90vh;
  display: flex; flex-direction: column;
  animation: ${fadeIn} 0.2s ease-out;
`;

const Title = styled.h2`
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
`;

const FilterWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  align-items: center;
  flex-wrap: wrap;
`;

const FilterInput = styled.input`
  padding: 0.4rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.85rem;
`;

const SearchButton = styled.button`
  background: #16a085;
  color: white;
  border: none;
  padding: 0.4rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.85rem;
  &:hover { background: #117a65; }
`;

// [수정] 테이블 래퍼의 높이를 auto로 변경
const TableWrapper = styled.div`
  overflow-y: visible; /* 스크롤바 제거 */
  position: relative;
  border-top: 1px solid #dee2e6;
  border-bottom: 1px solid #dee2e6;
  margin-bottom: 1rem;
`;


const ProjectTable = styled.table`
  width: 100%; border-collapse: collapse;
`;

const Th = styled.th<{ width?: string }>`
  background-color: #f8f9fa; 
  padding: 0.7rem 1rem; /* 헤더는 현재 크기 유지 */
  text-align: left;
  font-size: 0.9rem; /* 헤더 폰트 크기 유지 */
  color: #333; 
  border-bottom: 2px solid #dee2e6; /* 헤더 구분선 강화 */
  position: sticky; 
  top: 0;
  width: ${props => props.width || 'auto'};
`;

const Tr = styled.tr`
  &:hover {
    background-color: #f8f9fa;
  }
`;

const Td = styled.td`
  /* [수정] 패딩과 폰트 크기를 약 70%로 축소 */
  padding: 0.5rem 1rem; 
  border-bottom: 1px solid #e9ecef; 
  font-size: 0.85rem; 
  vertical-align: middle;
`;

const ActionButton = styled.button`
  background: #3498db; 
  color: white; 
  border: none; 
  /* [수정] 패딩과 폰트 크기를 약 70%로 축소 */
  padding: 0.35rem 0.7rem;
  border-radius: 4px; 
  cursor: pointer; 
  font-size: 0.75rem;
  &:hover { background: #2980b9; }
`;

const CloseButton = styled.button`
  margin-top: 1rem; 
  align-self: flex-end;
  background: #bdc3c7; 
  color: #333; 
  border: none; 
  padding: 0.6rem 1.2rem;
  border-radius: 4px; 
  cursor: pointer; 
  font-size: 0.9rem;
`;

const ThumbnailWrapper = styled.div`
    /* [수정] 썸네일 크기 축소 */
    width: 70px; 
    height: 39.37px;
    border-radius: 4px;
    border: 1px solid #ddd;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f0f0f0;
    font-size: 1.2rem; /* 아이콘 크기 축소 */
    color: #999;
    cursor: default;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 4px;
    }
`;

// [수정] 미리보기 팝업 크기 및 위치 조정
const PreviewPopup = styled.div`
  position: fixed;
  top: 30%;
  left: 25%; /* 정중앙(50%)에서 왼쪽으로 절반 이동 */
  transform: translateX(-50%); /* 자신의 너비의 50%만큼 왼쪽으로 이동하여 중앙 정렬 */
  width: 240px; /* 480px -> 240px */
  height: 135px; /* 270px -> 135px */
  border: 1px solid #ccc;
  background: #fff;
  box-shadow: 0 6px 20px rgba(0,0,0,0.25);
  border-radius: 8px;
  z-index: 1010;
  pointer-events: none;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${fadeIn} 0.2s;

  img, video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  span {
      font-size: 0.9rem;
      color: #777;
  }
`;

// [추가] 페이지네이션 컨테이너 스타일
const PaginationWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
`;

const PageButton = styled.button<{ active?: boolean }>`
    padding: 0.5rem 0.8rem;
    border: 1px solid ${props => props.active ? '#3498db' : '#ccc'};
    background-color: ${props => props.active ? '#3498db' : 'white'};
    color: ${props => props.active ? 'white' : '#333'};
    border-radius: 4px;
    cursor: pointer;
    &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
    }
`;


interface Project {
  id: number;
  name: string;
  author: string;
  createdAt: string;
  updatedAt: string;
  thumbnail: string | null;
}

interface PreviewData {
  src: string;
  type: 'image' | 'video';
}

interface ProjectLoadModalProps {
  onClose: () => void;
  onLoad: (projectId: number) => void;
}

export const ProjectLoadModal = ({ onClose, onLoad }: ProjectLoadModalProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState<PreviewData | null>(null);

  const [authorSearch, setAuthorSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

   // [추가] 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // 한 페이지에 10개씩 표시

 const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (authorSearch) params.append('author', authorSearch);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      params.append('page', String(currentPage));
      params.append('limit', String(limit));
      
      const response = await axios.get(`http://localhost:3002/projects`, { params });
      setProjects(response.data.data);
      setTotalPages(response.data.lastPage); // 전체 페이지 수 설정
    } catch (error) {
      console.error("프로젝트 목록 로딩 실패:", error);
    } finally {
      setLoading(false);
    }
  }, [authorSearch, startDate, endDate, currentPage]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  }

  const handleMouseEnter = (thumbnail: string | null) => {
    if (thumbnail && (thumbnail.startsWith('data:image') || thumbnail.startsWith('data:video'))) {
      const type = thumbnail.startsWith('data:image') ? 'image' : 'video';
      setPreview({ src: thumbnail, type });
    } else {
      setPreview(null);
    }
  };

  const handleMouseLeave = () => {
    setPreview(null);
  };

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Title>프로젝트 불러오기</Title>

        <FilterWrapper>
            <FilterInput 
              type="text" 
              placeholder="작성자 이름으로 검색" 
              value={authorSearch}
              onChange={(e) => setAuthorSearch(e.target.value)}
            />
            <FilterInput type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <span>~</span>
            <FilterInput type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            <SearchButton onClick={fetchProjects}>검색</SearchButton>
        </FilterWrapper>

        <TableWrapper onMouseLeave={handleMouseLeave}>
          <ProjectTable>
            <thead>
              <tr>
                <Th width="30%">프로젝트 이름</Th>
                <Th width="15%">작성자</Th>
                <Th width="20%">미리보기</Th>
                <Th width="20%">최근 수정일</Th>
                <Th width="15%">작업</Th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><Td colSpan={5}>로딩 중...</Td></tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id} onMouseEnter={() => handleMouseEnter(project.thumbnail)}>
                    <Td>{project.name}</Td>
                    <Td>{project.author || 'N/A'}</Td>
                    <Td>
                      <ThumbnailWrapper>
                        {project.thumbnail?.startsWith('data:image') ? 
                          <img src={project.thumbnail} alt={`${project.name} 썸네일`} /> :
                          project.thumbnail?.startsWith('data:video') ? '🎬' :
                          <span>📄</span>
                        }
                      </ThumbnailWrapper>
                    </Td>
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
         {/* [추가] 페이지네이션 UI */}
        <PaginationWrapper>
            <PageButton onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                이전
            </PageButton>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <PageButton key={page} active={page === currentPage} onClick={() => handlePageChange(page)}>
                    {page}
                </PageButton>
            ))}
            <PageButton onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                다음
            </PageButton>
        </PaginationWrapper>
        <CloseButton onClick={onClose}>닫기</CloseButton>
      </ModalContent>
      
      {preview && (
        <PreviewPopup>
          {preview.type === 'image' ? <img src={preview.src} alt="preview" /> : 
           preview.type === 'video' ? <video src={preview.src} muted autoPlay loop /> :
           null
          }
        </PreviewPopup>
      )}
    </ModalBackdrop>
  );
};