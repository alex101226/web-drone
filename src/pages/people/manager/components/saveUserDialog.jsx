import {Fragment, useEffect, useState} from 'react'
import { useForm, Controller } from 'react-hook-form';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
  Box, OutlinedInput, styled
} from "@mui/material";
import {userStatusFilter} from '@/filters'
import {updateUser, addUser, getRoles} from '@/services';
import { message } from '@/utils'

const initialState = {
  department: '',
  position: '',
  office_location: '',
  nickname: '',
  username: '',
  password: '',
  status: '1',
}

const InputHelp = styled(FormHelperText)({
  height: '20px'
})

const SaveUserDialog = (props) => {
  const { open, onClose, data, type } = props
  const {USER_STATUS_OPTIONS, renderUserStatus} = userStatusFilter()
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    defaultValues: initialState,
    mode: 'onChange',
  });

  //  获取角色列表
  const [roleOptions, setRoleOptions] = useState([]);
  const fetchRoles = () => {
    getRoles().then((res) => {
      if (res.code === 0) {
        setRoleOptions(res.data)
      }
    })
  }
  //  初始化赋值
  useEffect(() => {
    if (open) {
      fetchRoles()
      if (data) {
        reset({...data});
      }
    }
  }, [open])

  //  提交
  const [loading, setLoading] = useState(false);
  //  执行添加
  const onAdd = (data) => {
    if (loading) return;
    setLoading(true)
    addUser(data).then(res => {
      if (res.code === 0) {
        message.success('添加成功')
        handleClose(true)
      } else {
        message.error('添加失败')
      }
      setLoading(false)
    }).catch((err) => {
      setLoading(false)
      message.error('添加失败', err)
    })
  }

  //  执行修改
  const onEdit = (data) => {
    if (loading) return;
    setLoading(true)
    updateUser(data).then(res => {
      if (res.code === 0) {
        message.success('修改成功')
        handleClose(true)
      } else {
        message.error('修改失败')
      }
      setLoading(false)
    }).catch(() => {
      setLoading(false)
      message.error('修改失败')
    })
  }

  //  提交
  const onSubmit = (data) => {
    if (type === 'add') {
      onAdd(data)
    }
    if (type === 'edit') {
      onEdit(data)
    }
  }

  //  重置
  const handleClose = (flag) => {
    reset({ ...initialState });
    onClose(flag)
  }

  const isAdd = () => type === 'add'
  const renderForm = () => {
    return <Box component="form">
      {
          isAdd()
          && <Fragment>
            <FormControl fullWidth error={!!errors.username} margin="normal">
              <InputLabel htmlFor="username-input">用户名</InputLabel>
              <OutlinedInput
                  id="username-input"
                  aria-describedby="username-helper-text"
                  label="用户名"
                  {...register("username", {
                    required: '请输入用户名',
                  })}
              />
              <InputHelp id="username-helper-text">
                {errors.username?.message}
              </InputHelp>
            </FormControl>
            <FormControl fullWidth error={!!errors.password} margin="normal">
              <InputLabel htmlFor="password-input">密码</InputLabel>
              <OutlinedInput
                  id="password-input"
                  aria-describedby="password-helper-text"
                  label="密码"
                  type="password"
                  {...register("password", {
                    required: '请输入密码',
                    minLength: {
                      value: 6,
                      message: "密码不能低于6位"
                    }
                  })}
              />
              <InputHelp id="password-helper-text">
                {errors.password?.message}
              </InputHelp>
            </FormControl>
          </Fragment>
      }
      <FormControl fullWidth error={!!errors.nickname} margin="normal">
        <InputLabel htmlFor="nickname-input">用户昵称</InputLabel>
        <OutlinedInput
            id="nickname-input"
            aria-describedby="nickname-helper-text"
            label="用户昵称"
            {...register('nickname', {
              required: '请输入用户昵称',
            })}
        />
        <InputHelp id="nickname-helper-text">
          {errors.nickname?.message}
        </InputHelp>
      </FormControl>
      <FormControl fullWidth error={!!errors.department} margin="normal">
        <InputLabel htmlFor="department-input">部门</InputLabel>
        <OutlinedInput
            id="department-input"
            aria-describedby="department-helper-text"
            label="部门"
            {...register('department', {
              required: '请输入部门',
            })}
        />
        <InputHelp id="department-helper-text">
          {errors.department?.message}
        </InputHelp>
      </FormControl>
      <FormControl fullWidth error={!!errors.position} margin="normal">
        <InputLabel htmlFor="position-input">职位</InputLabel>
        <OutlinedInput
            id="position-input"
            aria-describedby="position-helper-text"
            label="职位"
            {...register('position', {
              required: '请输入职位',
            })}
        />
        <InputHelp id="position-helper-text">
          {errors.position?.message}
        </InputHelp>
      </FormControl>
      <Controller
          name="status"
          control={control}
          rules={{ required: '请选择状态' }}
          render={({ field, fieldState }) => (
              <FormControl fullWidth error={!!fieldState.error} margin="normal">
                <InputLabel id="status-input">状态</InputLabel>
                <Select
                    labelId="status-input"
                    label="状态"
                    aria-describedby="status-helper-text"
                    disabled={isAdd()}
                    {...field}
                >
                  {(USER_STATUS_OPTIONS || []).map((status, index) => (
                      <MenuItem value={status} key={index}>
                        {renderUserStatus(status)}
                      </MenuItem>
                  ))}
                </Select>
                <InputHelp id="status-helper-text">
                  {fieldState.error?.message}
                </InputHelp>
              </FormControl>
          )}
      />
      <Controller
          name="role_id"
          control={control}
          rules={{ required: '请选择角色' }}
          render={({ field, fieldState }) => (
              <FormControl fullWidth error={!!fieldState.error} margin="normal">
                <InputLabel id="role_id-input">角色</InputLabel>
                <Select
                    labelId="role_id-input"
                    label="角色"
                    aria-describedby="role_id-helper-text"
                    {...field}
                >
                  {roleOptions.map((role, index) => (
                      <MenuItem value={role.id} key={index}>
                        {role.role_description}
                      </MenuItem>
                  ))}
                </Select>
                <InputHelp id="role_id-helper-text">
                  {fieldState.error?.message}
                </InputHelp>
              </FormControl>
          )}
      />
    </Box>
  }
  return (
      <Dialog open={open} onClose={() => handleClose(false)} fullWidth maxWidth="sm">
        <DialogTitle>{ isAdd() ? '添加' : '修改'}用户</DialogTitle>
        <DialogContent dividers>
          {renderForm()}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose(false)} variant="outlined">
            取消
          </Button>
          <Button
              loading={loading}
              variant="contained"
              onClick={handleSubmit(onSubmit)}>
            保存
          </Button>
        </DialogActions>
      </Dialog>
  )
}
export default SaveUserDialog