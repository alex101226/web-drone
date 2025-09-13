import { create } from 'zustand';
import {persist} from 'zustand/middleware';

//  系统名称
export const useSystem = create(
    persist((set) => ({
      currentSystem: 'hashrate',
      setSystem: (currentSystem) => {
        set({ currentSystem: currentSystem })
      },
   }), {
      name: 'systemName',
      partialize: (state) => ({currentSystem: state.currentSystem,})
   }),
)




//  sidebar
export const useSidebar = create((set) => ({
  openSidebar: true,
  setSidebar: (flag) => {
    set({ openSidebar: flag })
  }
}))

//  客服 drawer
export const useServiceDrawer = create((set) => ({
  openServiceDrawer: false,
  setServiceDrawer: (flag) => {
    set({ openServiceDrawer: flag })
  },
}));
