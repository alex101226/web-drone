import { useState, useEffect, Fragment } from 'react';
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from '@mui/material';
import {ExpandLess, ExpandMore} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router';
import { useSidebar, useUserStore } from '@/store';

const SidebarItem = ({list = []}) => {
  // 记录哪些菜单展开
  const [openMenu, setOpenMenu] = useState({});

  //  打开下级
  const onToggle = (menu) => {
    setOpenMenu((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const { openSidebar } = useSidebar();

  const { userInfo } = useUserStore();

  useEffect(() => {
    if (!openSidebar) {
      setOpenMenu({})
    }
  }, [openSidebar])


  // 辅助函数
  function buildPath(parentPath, childPath, isIndex = false) {
    if (isIndex) return parentPath; // index 路由
    if (!childPath) return parentPath;
    return `${parentPath}/${childPath}`.replace(/\/+/g, '/');
  }

  //  跳转
  const location = useLocation();
  const navigate = useNavigate();
  const onRouter = (path) => {
    navigate(path)
  }

  const isAdmin = (handle) => {
    const { roles, hideSide } = handle
    if (hideSide) return true;
    return userInfo.role_name === 'admin' && !roles.includes('admin')
  };

  // 递归渲染函数
  const renderMenuItems = (items, openMenu, onToggle, onRouter, parentPath = '', level = 0) => {
    return items.map((item, index) => {
      const hasChild = item.children?.length > 0;

      const fullPath = buildPath(parentPath, item.path, item.index);
      return (
        <Fragment key={index}>
          {
            isAdmin(item.handle)
              ? null
                : <ListItemButton
                    selected={location.pathname.includes(item.path)}
                    onClick={() => hasChild ? onToggle(item.path) : onRouter(fullPath)}
                    sx={{
                      pl: 2 + level * 2,
                      '&.Mui-selected': {
                        backgroundColor: 'var(--custom-sidebar-background)',
                        '&:hover': {
                          backgroundColor: 'var(--custom-sidebar-background)',
                        },
                      },
                    }}
                >
                  <ListItemIcon sx={{ color: 'var(--custom-menu-icon-color)', minWidth: '40px' }}>
                    {item.handle.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.handle.title} />
                  {hasChild ? openMenu[item.path] ? <ExpandLess /> : <ExpandMore /> : null}
                </ListItemButton>
          }
          {hasChild && (
            <Collapse in={openMenu[item.path]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renderMenuItems(item.children, openMenu, onToggle, onRouter, fullPath, level + 1)}
              </List>
            </Collapse>
          )}
        </Fragment>
      );
    });
  };

  return renderMenuItems(list, openMenu, onToggle, onRouter, '');
}
export default SidebarItem;