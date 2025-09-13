import { useNavigate, useLocation } from 'react-router';
import {Typography, Box} from '@mui/material';

const SystemLogo = ({ show }) => {
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