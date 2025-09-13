import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// theme Store
export const useThemeStore = create(
    persist(
        (set) => ({
          theme: 'light',
          setTheme: (theme) => {
            document.documentElement.setAttribute('data-theme', theme);
            set({ theme })
          },
        }),
        {
          name: 'theme', // localStorage key
          partialize: (state) => {
            return { theme: state.theme }
          }, // 保存的字段
        }
    )
);