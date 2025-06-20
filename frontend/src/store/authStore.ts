// frontend/src/store/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';

interface User {
  userId: number;
  username: string;
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (loginData: any) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,

      login: async (loginData: any) => {
        try {
          const response = await axios.post('http://localhost:3002/auth/login', loginData);
          const { accessToken } = response.data;
          const payload = JSON.parse(atob(accessToken.split('.')[1]));
          const user = { userId: payload.sub, username: payload.username };
          set({ accessToken, user, isAuthenticated: true });
        } catch (error) {
          console.error('Login failed:', error);
          throw error;
        }
      },

      logout: () => {
        // [수정] 상태를 초기화하고, 즉시 로그인 페이지로 이동시킵니다.
        set({ accessToken: null, user: null, isAuthenticated: false });
        // Next.js의 router 대신 window.location을 사용하면,
        // 모든 상태를 깨끗하게 초기화하며 페이지를 새로고침하므로 더 확실한 로그아웃이 가능합니다.
        window.location.href = '/login';
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);