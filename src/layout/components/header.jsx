import {Fragment, useState} from 'react';
import {Menu, MenuItem, Fade, Toolbar, AppBar, Box, Typography, Button} from '@mui/material';
import BrightnessLowIcon from '@mui/icons-material/BrightnessLow';
import { useNavigate, useLocation } from 'react-router';
import { useThemeStore, useUserStore } from '@/store';
import CustomAvatar from '@/components/customAvatar'
import SystemLogo from './systemLogo'
import '@/assets/less/index.less'

const actionData = [
  {path: '/user-info',label: '个人中心'},
  {path: 'password'},
  {path: '/login', label: '退出登录'}
]
const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  //  切换主题
  const [openTheme, setOpenTheme] = useState(false);
  const { theme, setTheme } = useThemeStore();
  const [themeEl, setThemeEl] = useState(null);
  const toggleTheme = (flag) => (event) => {
    setOpenTheme(flag)
    setThemeEl(flag ? event.currentTarget : null)
  }
  const handleTheme = (mode) => () => {
    setTheme(mode)
    toggleTheme(false)(null)
  }
  const renderThemeDropdown = () => {
    return <Menu
        id="theme-dropdown"
        anchorEl={themeEl}
        open={openTheme}
        onClose={toggleTheme(false)}
        slots={{ transition: Fade }}
        role="menu"
    >
      {
        globalThis.CONSTANTS.THEME.map((item, index) => (
            <MenuItem key={index} selected={theme === item.mode} onClick={handleTheme(item.mode)}>
              { item.label }
            </MenuItem>
        ))
      }
    </Menu>
  }

  //  右侧下拉菜单
  const [actionEl, setActionEl] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const toggleAction = (flag) => (event) => {
    setActionEl(flag ? event.currentTarget : null)
    setOpenDropdown(flag)
  }

  //  个人中心
  const { clearUserInfo, token } = useUserStore()
  const onRouter = (path) => () => {
    toggleAction(false)(null)
    navigate(path)
    if (path === '/login') {
      clearUserInfo()
    }
  }
  const renderActionDropdown = () => {
    return <Menu
        id="action-dropdown"
        anchorEl={actionEl}
        open={openDropdown}
        onClose={toggleAction(false)}
        slots={{ transition: Fade }}
    >
      {
        actionData.map((item, index) => (
            <MenuItem
                key={index}
                selected={item.path === location.pathname}
                onClick={onRouter(item.path)}>
              {item.label}
            </MenuItem>
        ))
      }
    </Menu>
  }

  const renderLoginHeaderRight = () => {
    return <Fragment>
      <Typography component="div" noWrap fontWeight="600">
        {globalThis.CONSTANTS.SYSTEM_NAME}
      </Typography>
      {/* 修改主题  */}
      <Box
          component="span"
          aria-controls="theme-dropdown"
          aria-expanded={openTheme ? "true" : undefined}
          aria-haspopup="menu"
          onClick={ toggleTheme(true) }
          sx={{ml: 2, mr: 2, cursor: 'pointer', display: 'inline-flex'}}>
        <BrightnessLowIcon />
      </Box>
      { renderThemeDropdown() }

      {/* 用户  */}
      <Box
          sx={{ cursor: 'pointer' }}
          aria-haspopup="menu"
          aria-expanded={openDropdown ? 'true' : undefined}
          aria-controls="action-dropdown"
          onClick={toggleAction(true)}>
        <CustomAvatar />
      </Box>
      { renderActionDropdown() }
    </Fragment>
  }
  return (
      <AppBar position="fixed" elevation={0} component="header">
        <Toolbar>
          <SystemLogo />
          <Box sx={{ ml: 14 }} />
          {/*<HeadNav />*/}
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'right' }}>
            {
              token
                  ? renderLoginHeaderRight()
                  : <Button variant="contained" onClick={onRouter('/login')}>
                    登录
              </Button>
            }
          </Box>
        </Toolbar>
      </AppBar>
  );
}
export default Header;




