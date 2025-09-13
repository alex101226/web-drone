import ControlCameraOutlinedIcon from '@mui/icons-material/ControlCameraOutlined';
import UserInfo from "../user/userInfo";
import PeoplePosition from './peoplePosition';
import PeopleTraffic from "@/pages/people/PeopleTraffic/index.jsx";
import PeopleSos from "@/pages/people/peopleSos/index.jsx";

export const peopleRoutes = [
  {
    path: 'user',
    handle: {
      hideSide: false,
      title: '飞手管理',
      icon: <ControlCameraOutlinedIcon />,
      role: ['admin', 'root']
    },
    children: [
      {
        path: 'index',
        element: <PeoplePosition />,
        handle: {
          hideSide: false,
          title: '管理员',
          role: ['admin', 'root']
        },
      },
      {
        path: 'traffic',
        Component: PeopleTraffic,
        handle: {
          hideSide: false,
          title: '飞手信息',
          role: ['admin', 'root']
        }
      },
      {
        path: 'sos',
        Component: PeopleSos,
        handle: {
          hideSide: false,
          title: '飞行数据',
          role: ['admin', 'root']
        }
      },
    ]
  },
]