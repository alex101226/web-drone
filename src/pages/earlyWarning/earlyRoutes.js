import Counter from './counter';
import Weather from './weather';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';

export const earlyRoutes = [
  {
    path: 'project',
    handle: {
      hideSide: false,
      title: '预警管理',
      icon: <VideocamOutlinedIcon />,
    },
    children: [
      {
        path: 'fire-device',
        Component: Weather,
        handle: {
          hideSide: false,
          title: '气象预警',
          // icon: <FireHydrantAltOutlinedIcon />,
        }
      },
      {
        path: 'ups',
        Component: Counter,
        handle: {
          hideSide: false,
          title: '反制预警',
          // icon: <Battery4BarOutlinedIcon />,
        }
      },
    ]
  }
]