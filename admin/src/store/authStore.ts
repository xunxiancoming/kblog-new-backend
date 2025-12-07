import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  // 添加hasHydrated状态来追踪持久化是否完成
  hasHydrated: boolean;
  // 添加获取token的方法给API服务使用
  getToken: () => string | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      hasHydrated: false,
      getToken: () => get().token,
      login: (user, token) => {
        // 同时保存到localStorage作为备份
        localStorage.setItem('token', token);
        set({
          user,
          token,
          isAuthenticated: true,
        });
      },
      logout: () => {
        // 清理localStorage
        localStorage.removeItem('token');
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'auth-storage',
      // 添加onRehydrateStorage来追踪水合状态
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hasHydrated = true;
          // 确保token同步到localStorage
          if (state.token) {
            localStorage.setItem('token', state.token);
          }
        }
      },
    }
  )
);