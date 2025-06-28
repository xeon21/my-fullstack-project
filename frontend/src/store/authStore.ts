// frontend/src/store/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import axios from 'axios';

// [수정] User 인터페이스에 permissions 추가
interface User {
  userId: number;
  username: string;
  permissions: string[];
}

// [수정] AuthState 인터페이스에 hasPermission 함수 시그니처 추가
interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (loginData: any) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

export const useAuthStore = create(
  persist<AuthState>(
    // [수정] set과 함께 get을 사용하도록 변경
    (set, get) => ({
      accessToken: null,
      user: null,
      isAuthenticated: false,

      login: async (loginData: any) => {
        try {
          const response = await axios.post('http://localhost:3002/auth/login', loginData);
          const { accessToken } = response.data;
          const payload = JSON.parse(atob(accessToken.split('.')[1]));
          
          // [수정] JWT payload에서 permissions를 포함하여 user 객체 생성
          const user = {
            userId: payload.sub,
            username: payload.username,
            permissions: payload.permissions || [], // 권한 정보가 없으면 빈 배열
          };
          
          set({ accessToken, user, isAuthenticated: true });
        } catch (error) {
          console.error('Login failed:', error);
          throw error;
        }
      },

      logout: () => {
        set({ accessToken: null, user: null, isAuthenticated: false });
        window.location.href = '/login';
      },

      // [추가] hasPermission 함수 구현
      hasPermission: (permission: string) => {
        const user = get().user; // get()을 사용해 최신 상태의 user 객체를 가져옵니다.
        if (!user || !user.permissions) {
          return false; // 사용자가 없거나 권한 정보가 없으면 false를 반환합니다.
          //return true;
        }
        // 사용자가 해당 권한을 가지고 있는지 확인합니다.
        return user.permissions.includes(permission);
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);