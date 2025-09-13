import {useState} from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  FormHelperText,
  Box, OutlinedInput
} from "@mui/material";
import {savePassword} from '@/services/index.js';
import { useUserStore } from '@/store/index.js'
import { message } from '@/utils/index.js'
import { useFormValidate } from '@/hooks/useFormValidate.js'

const SavePasswordDialog = (props) => {
  const { open, onClose } = props
  const [password, setPassword] = useState('')

  const { errors, setErrors, handleSaveUserFormValidate} = useFormValidate()

  //  修改字段
  const handleChange = (event) => {
    const value = event.target.value
    setPassword(value)
    handleSaveUserFormValidate('password', value);
  }

  //  提交
  const [loading, setLoading] = useState(false);
  const { setUserInfo, userInfo } = useUserStore()
  //  执行修改
  const onEdit = () => {
    const params = {
      userId: userInfo.id,
      password,
    }
    setLoading(true)
    savePassword(params).then(res => {
      if (res.code === 0) {
        message.success('修改成功')
        setUserInfo({ token: res.data.token })
        handleClose()
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
  const handleSubmit = () => {
    if (!password || password.length < 6) {
      setErrors({ password: '密码不能为空或不能小于6位' })
      return false;
    }
    onEdit()
  }

  //  重置
  const handleClose = () => {
    setErrors({})
    onClose(false)
  }

  return (
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>修改密码</DialogTitle>
        <DialogContent dividers>
          <Box component="form">
            <FormControl fullWidth error={!!errors.password} margin="normal">
              <InputLabel htmlFor="password-input">密码</InputLabel>
              <OutlinedInput
                  id="password-input"
                  type="password"
                  aria-describedby="password-helper-text"
                  value={password}
                  onChange={handleChange}
                  label="密码"
              />
              <FormHelperText id="password-helper-text" sx={{ height: '20px', }}>
                {errors.password}
              </FormHelperText>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            取消
          </Button>
          <Button
              loading={loading}
              variant="contained"
              onClick={handleSubmit}>
            保存
          </Button>
        </DialogActions>
      </Dialog>
  )
}
export default SavePasswordDialog