import HashrateCpu from './hashrateCpu'
import HashrateUserManage from './hashrateUserManage'
import HashrateTaskStatus from './hashrateTaskStatus'
import HashrateTaskResource from './hashrateTaskResource'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import {Navigate} from "react-router";

export const dashboardRoutes = [
  {
    path: 'dashboard',
    handle: {
      icon: <AccessTimeOutlinedIcon />,
      title: '算力管理',
      hideSide: false,
    },
    children: [
      {
        path: 'hashrate',
        Component: HashrateCpu,
        handle: {
          hideSide: false,
          title: '仪表盘',
        },
      },
      {
        path: 'resource',
        Component: HashrateTaskResource,
        handle: {
          hideSide: false,
          title: '资源开销',
        },
      },
      {
        path: 'task',
        Component: HashrateTaskStatus,
        handle: {
          hideSide: false,
          title: '任务管理',
        },
      },
    ]
  },
]