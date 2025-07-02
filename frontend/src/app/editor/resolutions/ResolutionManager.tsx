// frontend/src/app/admin/resolutions/ResolutionManager.tsx
'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useEditorStore } from '@/store/editorStore';
import axiosInstance from '@/lib/axios';

const ManagerWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  color: #ecf0f1;
`;

const FormCard = styled.div`
  background-color: #2c3e50;
  padding: 1.5rem;
  border-radius: 8px;
`;

const ListCard = styled(FormCard)``;

const FormTitle = styled.h3`
  margin: 0 0 1.5rem 0;
`;

const InputGroup = styled.div`
  margin-bottom: 1rem;
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }
  input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #4a627a;
    border-radius: 4px;
    background-color: #1c2833;
    color: white;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.7rem;
  background-color: #27ae60;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  &:hover { background-color: #229954; }
`;

const ResolutionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ResolutionItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem;
  border-bottom: 1px solid #34495e;
  &:last-child { border-bottom: none; }
`;

const DeleteButton = styled.button`
  background-color: #c0392b;
  color: white;
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  &:hover { background-color: #a93226; }
`;

export const ResolutionManager = () => {
  const { canvasResolutions, fetchCanvasResolutions } = useEditorStore();
  const [name, setName] = useState('');
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);

  useEffect(() => {
    // 컴포넌트 마운트 시 데이터가 없으면 불러오기
    if (canvasResolutions.length === 0) {
      fetchCanvasResolutions();
    }
  }, [canvasResolutions, fetchCanvasResolutions]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !width || !height) {
      alert('모든 필드를 입력해주세요.');
      return;
    }
    try {
      await axiosInstance.post('/canvas-resolutions', { name, width, height });
      await fetchCanvasResolutions(); // 목록 다시 불러오기
      setName('');
      setWidth(1920);
      setHeight(1080);
    } catch (error) {
      alert('해상도 추가에 실패했습니다. 이름이 중복되지 않는지 확인해주세요.');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('정말로 이 해상도를 삭제하시겠습니까?')) {
      try {
        await axiosInstance.delete(`/canvas-resolutions/${id}`);
        await fetchCanvasResolutions(); // 목록 다시 불러오기
      } catch (error) {
        alert('해상도 삭제에 실패했습니다.');
      }
    }
  };

  return (
    <ManagerWrapper>
      <FormCard>
        <FormTitle>새 해상도 추가</FormTitle>
        <form onSubmit={handleAdd}>
          <InputGroup>
            <label htmlFor="name">이름 (예: 1920x1080)</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </InputGroup>
          <InputGroup>
            <label htmlFor="width">너비 (px)</label>
            <input id="width" type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} />
          </InputGroup>
          <InputGroup>
            <label htmlFor="height">높이 (px)</label>
            <input id="height" type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} />
          </InputGroup>
          <SubmitButton type="submit">추가하기</SubmitButton>
        </form>
      </FormCard>
      <ListCard>
        <FormTitle>해상도 목록</FormTitle>
        <ResolutionList>
          {canvasResolutions.map(res => (
            <ResolutionItem key={res.id}>
              <span>{res.name} ({res.width}x{res.height})</span>
              <DeleteButton onClick={() => handleDelete(res.id)}>삭제</DeleteButton>
            </ResolutionItem>
          ))}
        </ResolutionList>
      </ListCard>
    </ManagerWrapper>
  );
};