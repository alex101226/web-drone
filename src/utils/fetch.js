import { useNavigate } from 'react-router';
import { useUserStore } from '@/store/userStore'
import {message} from "@/utils";

const getToken = () => {
  return localStorage.getItem('token') || ''
}

const DEFAULT_TIMEOUT = 10000; // 默认超时 10s

async function request(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || DEFAULT_TIMEOUT);
  try {
    const token = getToken();
    const response = await fetch(`/api${url}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        token,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // 这里可以做全局错误处理
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    const data = await response.json();
    // 这里统一处理 token 失效
    if (data.code === 401) {
      message.error('登录已过期，请重新登录');
      useUserStore.getState().clearUserInfo();
      // setTimeout(() => {
      //   history.replaceState(null, '', '/login');
      //   history.go(0);
      // }, 2000)
    }
    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('请求超时，请稍后重试');
    }
    throw error;
  }
}


// 封装常用方法
export const http = {
  get: (url, options) => {
    return request(url, { ...options, method: 'GET' })
  },
  post: (url, body, options) => {
    return request(url,
        {
          ...options,
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(body),
        }
    )
  },
  put: (url, body, options) =>
      request(url, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  delete: (url, options) =>
      request(url, { ...options, method: 'DELETE' }),
  upload: (url, body, options) =>
      request(url, { ...options, method: 'POST', body: body }),
};