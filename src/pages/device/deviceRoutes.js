import CarRegister from './carManage'
import CarLogisticsRoute from '@/pages/control/carLogisticsRoute'
import CarTraffic from './carTraffic'
import DriveEtaOutlinedIcon from '@mui/icons-material/DriveEtaOutlined';

export const deviceRoutes = [
  {
    path: '/vehicle',
    handle: {
      hideSide: false,
      title: '设备管理',
      icon: <DriveEtaOutlinedIcon />,
      role: ['admin', 'root']
    },
    children: [
      {
        path: 'manage',
        Component: CarRegister,
        handle: {
          hideSide: false,
          title: '无人机管理',
          // icon: <DriveEtaOutlinedIcon />,
          role: ['admin', 'root']
        }
      },
      {
        path: 'traffic',
        Component: CarTraffic,
        handle: {
          hideSide: false,
          title: '机巢管理',
          // icon: <LocalShippingOutlinedIcon />,
          role: ['admin', 'root']
        }
      },
    ]
  }
]