import { Badge, styled } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
// import avatarImage from "@/assets/images/video8.jpeg";

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const CustomAvatar = () => {
  return (
      <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          variant="dot">
        {/*<Avatar*/}
        {/*    alt="avatar"*/}
        {/*    sizes="10px"*/}
        {/*    src={avatarImage}*/}
        {/*/>*/}
        <AccountCircle />
      </StyledBadge>
  )
}
export default CustomAvatar;