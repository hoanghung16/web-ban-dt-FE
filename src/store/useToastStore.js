import { create } from 'zustand';

export const useToastStore = create((set) => ({
  toasts: [],
  
  addToast: (message, type = 'success', duration = 3000) => {
    const id = Date.now();
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, duration }]
    }));
    
    if (duration && duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter(t => t.id !== id)
        }));
      }, duration);
    }
    
    return id;
  },

  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter(t => t.id !== id)
  })),

  clearAll: () => set({ toasts: [] }),
}));

// Convenience functions
export const showSuccess = (message, duration = 3000) => 
  useToastStore.getState().addToast(message, 'success', duration);

export const showError = (message, duration = 4000) => 
  useToastStore.getState().addToast(message, 'error', duration);

export const showInfo = (message, duration = 3000) => 
  useToastStore.getState().addToast(message, 'info', duration);

export const showWarning = (message, duration = 3500) => 
  useToastStore.getState().addToast(message, 'warning', duration);
