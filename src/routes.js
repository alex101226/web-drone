import {createBrowserRouter, Navigate} from 'react-router';
import Login from './pages/user/login';
import Layout from './layout';
import { dashboardRoutes } from '@/pages/dashboard/dashboardRoutes.js'
import { deviceRoutes } from '@/pages/device/deviceRoutes.js'
import { earlyRoutes } from '@/pages/earlyWarning/earlyRoutes.js'
import { peopleRoutes } from '@/pages/people/peopleRoutes.js'
import { controlRoutes } from '@/pages/control/controlRoutes'
import UserInfo from "@/pages/user/userInfo/index.jsx";

const routes = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
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
    element: <Navigate to="/dashboard/hashrate" replace />,
  },
]);

export default routes;