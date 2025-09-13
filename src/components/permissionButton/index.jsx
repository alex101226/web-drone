// PermissionButton.tsx
import { Button } from '@mui/material'
import {useUserStore} from '@/store'
import { rolePermissions } from '@/utils';

/**
 *
 * @returns {JSX.Element|null}
 * @constructor
 * @param props
 * page: 当前的页面
 * action: 操作
 * module: 模块
 * type: 按钮类型 "text" | "outlined" | "contained"
 */
const PermissionButton = (props) => {
  const { page, action, module = 'user', children, type='contained', ...resetProps } = props
  const role = useUserStore(state => state.userInfo.role_name)
  const perm = rolePermissions[module]?.[page]?.[role] ?? {};

  if (!perm[action]) return null;
  return <Button variant={type} { ...resetProps }>{children}</Button>;
};
export default PermissionButton;
