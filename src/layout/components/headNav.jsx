import { useNavigate } from 'react-router';
import { List, ListItemButton, ListItemText, styled} from '@mui/material'
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import AirplayOutlinedIcon from '@mui/icons-material/AirplayOutlined';
import { useSystem } from '@/store'

const pages = [
  {
    id: 1,
    name: '算力管理系统',
    link: '/',
    icon: <AirplayOutlinedIcon />,
    alias: 'hashrate',
  },
  {
    id: 2,
    name: '安全生产管理系统',
    link: '/project-monitor',
    icon: <ReportProblemRoundedIcon />,
    alias: 'project',
  },
  {
    id: 3,
    name: '运输车辆管理',
    link: '/car-manage',
    icon: <LocalShippingIcon />,
    alias: 'car',
  },
  {
    id: 4,
    name: '人员安全管理',
    link: '/people-position',
    icon: <GroupRoundedIcon />,
    alias: 'user',
  },
  // { id: 5, url: image4, title: '人工智能AI助手', link: '/ai-safety'},
]

const NavItem = styled(ListItemButton)(({theme}) => {
  return {
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      backgroundColor: 'var(--custom-sidebar-background)',
      color: 'var(--custom-menu-color)',
    },
    '&.Mui-selected': {
      backgroundColor: 'var(--custom-sidebar-background)',
      color: 'var(--custom-menu-color)',
      '&:hover': {
        backgroundColor: 'var(--custom-sidebar-background)',
        color: 'var(--custom-menu-color)',
      }
    },
  }
})

const HeadNav = () => {
  const { currentSystem } = useSystem()
  //  跳转
  const navigate = useNavigate();
  const onRouter = (link) => () => {
    navigate(link)
  }

  return (
      <List sx={{ display: 'flex', justifyContent: 'flex-start' }}  gap={4}>
        {pages.map((page, index) => (
            <NavItem
                dense
                key={index}
                selected={currentSystem === page.alias}
                onClick={onRouter(page.link)}>
              <ListItemText primary={page.name} sx={{ whiteSpace: 'nowrap' }} />
            </NavItem>
        ))}
      </List>
  )
}
export default HeadNav