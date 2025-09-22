import DriveEtaOutlinedIcon from "@mui/icons-material/DriveEtaOutlined";
import Route from "@/pages/control/route";
import Control from "@/pages/control/control";
import Area from './area'

export const controlRoutes = [
  {
    path: 'control',
    handle: {
      hideSide: false,
      title: 'AI智巡管理',
      icon: <DriveEtaOutlinedIcon />,
    },
    children: [
      {
        path: 'route',
        Component: Route,
        handle: {
          hideSide: false,
          title: '路线管理',
          // icon: <AddRoadOutlinedIcon />,
        }
      },
      {
        path: 'dispatch',
        Component: Control,
        handle: {
          hideSide: false,
          title: '智能调度',
          // icon: <EditCalendarOutlinedIcon />,
        }
      },
      {
        path: 'area',
        Component: Area,
        handle: {
          hideSide: false,
          title: '区域规划',
          // icon: <AddRoadOutlinedIcon />,
        }
      },
    ]
  }
]