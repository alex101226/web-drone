import {Typography, Box} from "@mui/material";
import UpcomingIcon from '@mui/icons-material/Upcoming';

const CustomEmpty = () => {
  return (
      <Box
          component="div"
          sx={{
            width: '100%',
            height: '100%',
            minHeight: '100px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
      }}>
        <UpcomingIcon fontSize="large" sx={{ color: 'rgba(0,0,0,.5)', mb: 1 }} />
        <Typography variant="body2" color="textSecondary">
          暂无数据
        </Typography>
      </Box>
  )
}
export default CustomEmpty