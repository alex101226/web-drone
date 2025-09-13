import {Fragment} from 'react';
import {Toolbar, AppBar, Box, Typography} from '@mui/material';
import ThemeButton from "./components/theme";
import UserStatus from './components/user'
import SystemLogo from './components/systemLogo'
import InternalMsg from './components/internalMsg'
import '@/assets/less/index.less'

const Header = () => {

  const renderLoginHeaderRight = () => {
    return <Fragment>

      {/* 修改主题  */}
      <ThemeButton />
      <InternalMsg />
      {/* 用户  */}
      <UserStatus />
    </Fragment>
  }
  return (
      <AppBar position="fixed" elevation={0} component="header">
        <Toolbar>
          <SystemLogo />
          <Box sx={{ ml: 14 }} />
          <Typography component="div" noWrap fontWeight="600">
            {globalThis.CONSTANTS.SYSTEM_NAME}
          </Typography>

          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'right' }}>
            { renderLoginHeaderRight() }
          </Box>
        </Toolbar>
      </AppBar>
  );
}
export default Header;




