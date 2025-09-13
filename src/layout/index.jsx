import React from 'react';
import { Outlet, useLocation } from 'react-router';
import {Box, Stack, Toolbar} from '@mui/material'
import Header from './components/header'
import Sidebar from './components/sidebar';
import SidebarItem from './components/sidebarItem';
import CustomServiceDrawer from "@/components/customServiceDrawer";
import {useServiceDrawer} from '@/store';
import serviceImage from "@/assets/images/service.png";
import routes from '@/routes'


const Layout = () => {
  const getMenuList = () => {
    const newRoutes = routes.routes.filter(route => route.path === '/')
    return newRoutes[0].children || []
  }

  //  客服
  const location = useLocation();
  const showButton = () => location.pathname !== '/login';
  const { setServiceDrawer, } = useServiceDrawer()
  const renderFixedButton = () => {
    return (
        <Box
            component="img"
            sx={{ width: '56px', height: '56px', position: 'fixed', bottom: '200px', right: '16px', cursor: 'pointer', }}
            src={serviceImage}
            alt=""
            onClick={() => setServiceDrawer(true)}
        />
    )
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--custom-body-background)'
    }}>
      <Toolbar>
        <Header />
      </Toolbar>
      <Stack direction="row" flexGrow={1}>
        <Sidebar><SidebarItem list={getMenuList()}/></Sidebar>
        <Box
            component="main"
            sx={{
              width: 'calc(100% - 240px)',
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              flex: 1 }}>
          <Outlet />
        </Box>
      </Stack>

      {showButton() && renderFixedButton()}
      <CustomServiceDrawer />
    </Box>
  )
}
export default Layout;