import Hashrate from './hashrate'
import Task from './task'
import Resource from './resource'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';


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
        Component: Hashrate,
        handle: {
          hideSide: false,
          title: '仪表盘',
        },
      },
      {
        path: 'resource',
        Component: Resource,
        handle: {
          hideSide: false,
          title: '资源开销',
        },
      },
      {
        path: 'task',
        Component: Task,
        handle: {
          hideSide: false,
          title: '任务管理',
        },
      },
    ]
  },
]