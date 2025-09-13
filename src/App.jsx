import React, { useEffect } from 'react'
import {ThemeProvider, CssBaseline} from '@mui/material';
import { RouterProvider } from 'react-router';
import routes from './routes.js';
import { useThemeStore, useUserStore } from '@/store'
import { getMuiTheme } from './theme';
import './utils/constant.js';
import './assets/less/index.less';

const App = () => {
  //  主题
  const { theme, setTheme } = useThemeStore()
  const muiTheme = getMuiTheme(theme);
  useEffect(() => {
    setTheme(theme)
  }, [])

  //  获取用户信息
  const { userInfo, fetchUserInfo } = useUserStore()
  useEffect(() => {
    if (userInfo.token) {
      fetchUserInfo()
    }
  }, [userInfo.token]);

  return (
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <RouterProvider router={ routes } />
      </ThemeProvider>
  );
};
export default App;
