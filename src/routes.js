import {createBrowserRouter, Navigate} from 'react-router';
import Login from './pages/user/login';
import Layout from './layout';
import Home from '@/pages/home';
import UserInfo from "@/pages/user/userInfo";
import { dashboardRoutes } from '@/pages/dashboard/dashboardRoutes.js'
import { deviceRoutes } from '@/pages/device/deviceRoutes.js'
import { earlyRoutes } from '@/pages/earlyWarn/earlyRoutes.js'
import { peopleRoutes } from '@/pages/people/peopleRoutes.js'
import { controlRoutes } from '@/pages/control/controlRoutes'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

const routes = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
	  {
		path: '/home',
		Component: Home,
		handle: {
		  title: '首页',
		  role: ['root', 'admin'],
		  icon: <HomeOutlinedIcon />,
		},
	  },
      ...dashboardRoutes,
      ...peopleRoutes,
      ...deviceRoutes,
      ...controlRoutes,
      ...earlyRoutes,
    ],
  },
  {
    path: '/login',
    Component: Login,
    handle: {
      hideSide: true,
      role: ['root', 'admin']
    },
  },
  {
    path: '/user-info',
    Component: UserInfo,
    handle: {
      hideSide: true,
      title: '个人中心',
      // icon: <DirectionsCarIcon />,
      role: ['root', 'admin']
    }
  },
  {
    index: true,
    element: <Navigate to="/home" replace />,
  },
]);

export default routes;