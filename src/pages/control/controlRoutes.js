import DriveEtaOutlinedIcon from "@mui/icons-material/DriveEtaOutlined";
import CarLogisticsRoute from "@/pages/control/carLogisticsRoute/index.jsx";
import CarControl from "@/pages/control/carControl/index.jsx";

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
        path: 'logistics',
        Component: CarLogisticsRoute,
        handle: {
          hideSide: false,
          title: '路线管理',
          // icon: <AddRoadOutlinedIcon />,
        }
      },
      {
        path: 'control',
        Component: CarControl,
        handle: {
          hideSide: false,
          title: '智能调度',
          // icon: <EditCalendarOutlinedIcon />,
        }
      },
    ]
  }
]