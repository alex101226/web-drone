import { useNavigate, useLocation } from 'react-router';
import {Typography, IconButton, Box} from '@mui/material';
import {MenuOpen, Menu} from '@mui/icons-material';
import {useSidebar} from '@/store';
// import avatarImage from '@/assets/images/logo-1.svg'

const SystemLogo = ({ show }) => {
  const { openSidebar, setSidebar } = useSidebar();

  // const menuIconElement = () => {
  //   return (
  //       <IconButton
  //           edge="start"
  //           color="inherit"
  //           aria-label="menu"
  //           sx={{ mr: 2, p: 1 }}
  //           onClick={ () => setSidebar(!openSidebar) }
  //       >
  //         { openSidebar ? <MenuOpen /> : <Menu /> }
  //       </IconButton>
  //   )
  // }

  const navigator = useNavigate()
  const location = useLocation()
  const onRouter = () => {
    if (location.pathname !== '/') {
      navigator('/')
    }
  }

  return (
      <Box sx={{ display: 'flex', alignItems: 'self-end', justifyContent: 'center', cursor: 'pointer' }}  onClick={onRouter}>
        <Box
            component="img"
            src={globalThis.CONSTANTS.SYSTEM_LOGO}
            sx={{height: '37px' }}
        />
        <Box component="div" sx={{ml: 1}} />
        <Typography variant="h6" component="h6" fontWeight="600">
          {globalThis.CONSTANTS.LOGO_TITLE}
        </Typography>
      </Box>
  )
}
export default SystemLogo