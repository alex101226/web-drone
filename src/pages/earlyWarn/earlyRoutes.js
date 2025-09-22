import Anti from './anti';
import Weather from './weather';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';

export const earlyRoutes = [
  {
    path: 'warn',
    handle: {
      hideSide: false,
      title: '预警管理',
      icon: <VideocamOutlinedIcon />,
    },
    children: [
      {
        path: 'weather',
        Component: Weather,
        handle: {
          hideSide: false,
          title: '气象预警',
          // icon: <FireHydrantAltOutlinedIcon />,
        }
      },
      {
        path: 'anti',
        Component: Anti,
        handle: {
          hideSide: false,
          title: '反制预警',
          // icon: <Battery4BarOutlinedIcon />,
        }
      },
    ]
  }
]