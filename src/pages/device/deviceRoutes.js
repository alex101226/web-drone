import Drones from './drones'
import Nest from './nest'
import DriveEtaOutlinedIcon from '@mui/icons-material/DriveEtaOutlined';

export const deviceRoutes = [
  {
    path: '/device',
    handle: {
      hideSide: false,
      title: '设备管理',
      icon: <DriveEtaOutlinedIcon />,
    },
    children: [
      {
        path: 'drones',
        Component: Drones,
        handle: {
          hideSide: false,
          title: '无人机管理',
          // icon: <DriveEtaOutlinedIcon />,
        }
      },
      {
        path: 'nest',
        Component: Nest,
        handle: {
          hideSide: false,
          title: '机巢管理',
          // icon: <LocalShippingOutlinedIcon />,
        }
      },
    ]
  }
]