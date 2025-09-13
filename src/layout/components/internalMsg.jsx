import {Badge, IconButton, styled} from "@mui/material";
import { badgeClasses } from '@mui/material/Badge';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';

const CartBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -8px;
    right: -4px;
  }
`;

const InternalMsg = () => {
  return (
      <IconButton>
        <ChatBubbleOutlineOutlinedIcon />
        <CartBadge
            variant="dot"
            color="error"
            overlap="circular"
        />
      </IconButton>
  )
}
export default InternalMsg;