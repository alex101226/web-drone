import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginTypeCheck } from '@rsbuild/plugin-type-check';
import { pluginLess } from '@rsbuild/plugin-less';
import path from 'node:path';

export default defineConfig({
  plugins: [
    pluginReact(),
    pluginTypeCheck({
      enable: true,
    }),
    pluginLess({
      // include: /src[\\/]assets[\\/]less/,
      include: /src[\\/].*\.less$/, // ✅ 只匹配 src 下的 .less 文件
      parallel: true,
      lessLoaderOptions: {
        lessOptions: {
          javascriptEnabled: false,
        },
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  html: {
    title: '',
    // title: '越泰低空无人机与算力管理系统',
    // favicon: './src/assets/images/logo-1.svg', // 或者 public/favicon.ico
  },
  server: {
    proxy: {
      '/api': 'http://localhost:4000'
    }
  },
  output: {
	distPath: {
	  root: 'drone'
	}
  }
});
