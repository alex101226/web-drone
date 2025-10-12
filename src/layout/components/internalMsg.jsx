import {Fragment, useState, useEffect} from "react";
import {
  Badge, IconButton, styled, Fade, Menu, MenuItem,
  Typography, Divider, ListItemText, Box
} from "@mui/material";
import { badgeClasses } from '@mui/material/Badge';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import CustomEmpty from "@/components/customEmpty";
import { getMessage, readMessage } from '@/services'
import {coverDateString, message} from '@/utils'

const CartBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -8px;
    right: -4px;
  }
`;

const Dot = styled(Box)({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: '#d32f2f',
  position: 'absolute',
  left: '5px',
  top: '50%',
  transform: 'translateY(-50%)',
})
const InternalMsg = () => {

  const [messageList, setMessageList] = useState([])
  const [total, setTotal] = useState(0)
  const fetchMessage = () => {
    getMessage().then(res => {
      if (res.code === 0) {
        setMessageList(res.data.data)
        setTotal(res.data.total)
      }
    })
  }
  useEffect(() => {
    fetchMessage()
  }, [])

  const [current, setCurrent] = useState('')
  const onRead = (id) => {
    readMessage({ message_id: id }).then(res => {
      if (res.code === 0) {
        message.success('消息已读')
        setMessageList((prev) => {
          return prev.map(item =>
              item.id === id ? { ...item, status: 1 } : item
          )
        })
      }
    })
  }

  const handleRead = (item) => {
    setCurrent(item.id)
    if (item.status) return
    onRead(item.id)
  }

  //  右侧下拉菜单
  const [actionEl, setActionEl] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const toggleAction = (flag) => (event) => {
    if (flag) {
      fetchMessage()
    }
    setActionEl(flag ? event.currentTarget : null)
    setOpenDropdown(flag)
  }

  const renderMessageContent = () => {
    return [
      <Typography
          key="header"
          component="div"
          variant="body2"
          textAlign="center"
          sx={{ mb: 1 }}
      >
        {total}条新消息
      </Typography>,
      <Divider key="divider" />,
      ...messageList.map((item, index) => (
          <MenuItem
              key={item.id || index}
              component="a"
              divider
              selected={current === item.id}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                flexDirection: 'column',
                py: 2,
                pl: 3,
                position: 'relative',
                '&.Mui-selected': {
                  backgroundColor: 'var(--custom-sidebar-background)',
                  '&:hover': {
                    backgroundColor: 'var(--custom-sidebar-background)',
                  },
                },
              }}
              onClick={() => handleRead(item)}
          >
            {!item.status && <Dot />}
            <ListItemText>
              <Typography variant="body2" component="h6">
                {item.title || '很长的标题'}
              </Typography>
            </ListItemText>
            <ListItemText>
              <Typography
                  variant="body2"
                  component="p"
                  sx={{ whiteSpace: 'break-spaces', color: 'rgba(0, 0, 0, 0.6)' }}
              >
                {item.content || '很长的内容...'}
              </Typography>
            </ListItemText>
            <ListItemText
            sx={{ position: 'absolute', bottom: '2px', right: '15px'}}>
              <Typography
                  variant="caption"
                  component="p"
                  sx={{ whiteSpace: 'break-spaces', color: 'rgba(0, 0, 0, 0.4)' }}
              >
                { coverDateString(item.created_at, '4') }
              </Typography>
            </ListItemText>
          </MenuItem>
      )),
    ]
  }

  const renderActionDropdown = () => {
    return (
        <Menu
            id="message-dropdown"
            anchorEl={actionEl}
            open={openDropdown}
            onClose={toggleAction(false)}
            slots={{ transition: Fade }}
            sx={{
              '.MuiPaper-root': {
                width: '320px',
                '.MuiList-root': {
                  minHeight: '100px',
                }
              }
            }}>
          {
            !total ? <CustomEmpty /> : renderMessageContent()
          }
        </Menu>
    )
  }

  return (
      <Fragment>
        <IconButton
            aria-haspopup="message"
            aria-expanded={openDropdown ? 'true' : undefined}
            aria-controls="message-dropdown"
            onClick={toggleAction(true)}>
          <ChatBubbleOutlineOutlinedIcon />
          {
            total ? <CartBadge
                  variant="dot"
                  color="error"
                  overlap="circular"
              /> : null
          }
        </IconButton>
        { renderActionDropdown() }
      </Fragment>
  )
}
export default InternalMsg;