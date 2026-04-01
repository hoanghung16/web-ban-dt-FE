import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,
      isAuthenticated: false,

      // Đăng nhập
      login: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post('/auth/login', { email, password });
          // Backend return format: { message, user, token, token_type }
          const user = response.user || response;
          const token = response.token;
          localStorage.setItem('auth_token', token);
          set({ 
            user, 
            token, 
            isAuthenticated: true,
            loading: false 
          });
          return { success: true, user };
        } catch (error) {
          const errorMsg = error.response?.data?.message || error.message;
          set({ error: errorMsg, loading: false });
          throw error;
        }
      },

      // Đăng ký
      register: async (userData) => {
        set({ loading: true, error: null });
        try {
          const response = await api.post('/auth/register', userData);
          // Backend return format: { message, user, token }
          const user = response.user || response;
          const token = response.token;
          localStorage.setItem('auth_token', token);
          set({ 
            user, 
            token, 
            isAuthenticated: true,
            loading: false 
          });
          return { success: true, user };
        } catch (error) {
          const errorMsg = error.response?.data?.message || error.message;
          set({ error: errorMsg, loading: false });
          throw error;
        }
      },

      // Lấy thông tin user hiện tại
      fetchCurrentUser: async () => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return;
        }
        
        set({ loading: true });
        try {
          const response = await api.get('/auth/me');
          const userData = response.user || response.data || response;
          set({ 
            user: userData,
            isAuthenticated: true,
            loading: false 
          });
        } catch (error) {
          localStorage.removeItem('auth_token');
          set({ 
            isAuthenticated: false, 
            user: null, 
            token: null,
            loading: false 
          });
        }
      },

      // Đăng xuất
      logout: () => {
        localStorage.removeItem('auth_token');
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false 
        });
      },

      // Cập nhật profil
      updateProfile: async (profileData) => {
        set({ loading: true, error: null });
        try {
          const response = await api.put('/auth/profile', profileData);
          // Backend return format: { message, user: {...} }
          const userData = response.user || response.data || response;
          set({ 
            user: userData,
            loading: false 
          });
          return { success: true };
        } catch (error) {
          const errorMsg = error.response?.data?.message || error.message;
          set({ error: errorMsg, loading: false });
          throw error;
        }
      },

      // Đặt lại lỗi
      clearError: () => set({ error: null }),
    }),
    { 
      name: 'king-auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      })
    }
  )
);
