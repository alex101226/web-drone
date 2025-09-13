import ControlCameraOutlinedIcon from '@mui/icons-material/ControlCameraOutlined';
import Manager from './manager';
import Pilot from "@/pages/people/pilot";

export const peopleRoutes = [
  {
    path: 'user',
    handle: {
      hideSide: false,
      title: '飞手管理',
      icon: <ControlCameraOutlinedIcon />,
    },
    children: [
      {
        path: 'manager',
        element: <Manager />,
        handle: {
          hideSide: false,
          title: '管理员',
        },
      },
      {
        path: 'pilot',
        Component: Pilot,
        handle: {
          hideSide: false,
          title: '飞手信息',
        }
      },
    ]
  },
]