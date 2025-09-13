import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {message} from '@/utils';
import { getUserInfo } from '@/services';

const initialState = {
  username: '',
  nickname: '',
  status: '',
  position: '',
  department: '',
  location: '',
  role_id: 1,
  role_name: 'root',
  role_description: '超级管理员',
  token: '',
}
export const useUserStore = create(persist((set, get) => ({
  userInfo: initialState,
  token: localStorage.getItem('token') || '',
  //  设置用户信息
  setUserInfo: (payload) => {
    set({ userInfo: { ...get().userInfo, ...payload } })
  },
  //  设置token
  setToken: (payload) => {
    localStorage.setItem('token', payload)   // 单独存储
    set({ token: payload })
  },
  // 清空用户信息
  clearUserInfo: () => {
    set({ userInfo: initialState });
    localStorage.removeItem('userInfo')
    localStorage.removeItem('token')   // 单独存储
  },
  //  获取用户信息
  fetchUserInfo: async () => {
    const { token, id } = get().userInfo;
    if (!token) {
      message.error('用户未登录');
      return;
    }
    const res = await getUserInfo({ userId: id })
    if (res.code === 0) {
      set({ userInfo: { ...get().userInfo, ...res.data }, });
    }
  }
}), {
  name: 'userInfo',
  partialize: (state) => {
    return ({ userInfo: state.userInfo })
  },
}));
