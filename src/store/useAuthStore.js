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
          const { user, token } = response;
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
          const { user, token } = response;
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
          set({ 
            user: response.data || response,
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
          set({ 
            user: response.user || response.data || response,
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
