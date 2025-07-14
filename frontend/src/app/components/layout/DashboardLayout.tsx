'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuthStore } from '@/store/authStore';
import Modal from '../common/Modal';
import axiosInstance from '@/lib/axios';

const Header = styled.header`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 0 1rem 0;
  margin-bottom: 1rem;
  border-bottom: 1px solid #34495e;
`;

const UserInfo = styled.span`
  color: #ecf0f1;
  margin-right: 1rem;
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  margin-left: 10px;
  background-color: #3498db;
  &:hover {
    background-color: #2980b9;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  margin-bottom: 1rem;
`;

interface DashboardLayoutProps {
  $bgColor?: string;
  $padding?: string;
}

const LayoutContainer = styled.div<DashboardLayoutProps>`
  width: 100%;
  min-height: 100%;
  background-color: ${props => props.$bgColor || '#1c2833'};
  padding: ${props => props.$padding || '2rem'};
  border-radius: 1rem;
`;

interface LayoutProps extends DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({ children, $bgColor, $padding }: LayoutProps) {
  const { user, logout } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handlePasswordChange = async () => {
    setError('');
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    if (passwords.newPassword.length < 4) {
      setError('새 비밀번호는 4자 이상이어야 합니다.');
      return;
    }

    try {
      await axiosInstance.patch('/userinfo/change-password', {
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      alert('비밀번호가 성공적으로 변경되었습니다.');
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.message || '비밀번호 변경에 실패했습니다.');
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <LayoutContainer $bgColor={$bgColor} $padding={$padding}>
        <Header>
          {user && <UserInfo>{user.username}님, 환영합니다.</UserInfo>}
          <ActionButton onClick={() => setIsModalOpen(true)}>비밀번호 변경</ActionButton>
          <ActionButton onClick={logout}>로그아웃</ActionButton>
        </Header>
        {children}
      </LayoutContainer>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handlePasswordChange}
        title="비밀번호 변경"
      >
        <Input
          type="password"
          name="currentPassword"
          placeholder="현재 비밀번호"
          onChange={onInputChange}
        />
        <Input
          type="password"
          name="newPassword"
          placeholder="새 비밀번호"
          onChange={onInputChange}
        />
        <Input
          type="password"
          name="confirmPassword"
          placeholder="새 비밀번호 확인"
          onChange={onInputChange}
        />
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      </Modal>
    </>
  );
}