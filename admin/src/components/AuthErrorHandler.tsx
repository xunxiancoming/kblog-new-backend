import React, { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { apiService } from '../services/api';

interface AuthErrorHandlerProps {
  children: React.ReactNode;
}

const AuthErrorHandler: React.FC<AuthErrorHandlerProps> = ({ children }) => {
  const { logout } = useAuthStore();

  useEffect(() => {
    // 添加响应拦截器来处理认证错误
    const responseInterceptor = apiService.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logout();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

    return () => {
      // 清理：移除拦截器
      apiService.api.interceptors.response.eject(responseInterceptor);
    };
  }, [logout]);

  return <>{children}</>;
};

export default AuthErrorHandler;