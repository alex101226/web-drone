import {Fragment, useState} from "react";
import {useLocation, useNavigate} from "react-router";
import {Button, Fade, IconButton, Menu, MenuItem} from "@mui/material";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import {useUserStore} from "@/store";

const actionData = [
  {path: '/user-info',label: '个人中心'},
  {path: '/login', label: '退出登录'}
]
const UserStatus = () => {
  const navigate = useNavigate()
  const location = useLocation()

  //  右侧下拉菜单
  const [actionEl, setActionEl] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const toggleAction = (flag) => (event) => {
    setActionEl(flag ? event.currentTarget : null)
    setOpenDropdown(flag)
  }

  //  个人中心
  const { clearUserInfo, token } = useUserStore()
  const onRouter = (path) => () => {
    toggleAction(false)(null)
    navigate(path)
    if (path === '/login') {
      clearUserInfo()
    }
  }
  const renderActionDropdown = () => {
    return <Menu
        id="action-dropdown"
        anchorEl={actionEl}
        open={openDropdown}
        onClose={toggleAction(false)}
        slots={{ transition: Fade }}
    >
      {
        actionData.map((item, index) => (
            <MenuItem
                key={index}
                selected={item.path === location.pathname}
                onClick={onRouter(item.path)}>
              {item.label}
            </MenuItem>
        ))
      }
    </Menu>
  }

  return (
     <Fragment>
       {
         token ?
             <IconButton
                 aria-haspopup="menu"
                 aria-expanded={openDropdown ? 'true' : undefined}
                 aria-controls="action-dropdown"
                 onClick={toggleAction(true)}>
               <AccountCircleOutlinedIcon />
             </IconButton>
             : <Button variant="contained" onClick={onRouter('/login')}>
               登录
             </Button>
       }
       { renderActionDropdown() }
     </Fragment>
  )
}
export default UserStatus