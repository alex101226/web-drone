import {useState} from 'react'
import { useForm } from 'react-hook-form';
import {
  Box,
  FormControl,
  Typography,
  FormHelperText,
  Button,
  OutlinedInput,
  InputLabel,
  styled
} from '@mui/material'
import { useNavigate } from 'react-router';
import { loginUser } from '@/services/index.js'
import {message} from '@/utils/index.js'
import { useUserStore } from '@/store/index.js'
import LoginBackImage from '@/assets/images/login-bg2.webp'

const Text = styled(Typography)({
  color: 'white',
  textAlign: 'center',
  fontWeight: 'bold'
});

const FormInputLabel = styled(InputLabel)({
  color: 'rgba(255, 255, 255, 0.6)',
})

const FormInput = styled(OutlinedInput)({
  color: 'rgba(255, 255, 255, 0.8)',
})
const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const { setUserInfo, setToken } = useUserStore();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const onSubmit = (data) => {
    if (loading) {
      return;
    }
    setLoading(true)
    loginUser(data).then(res => {
      if (res.code === 0) {
        setToken(res.data.token)
        message.success('登录成功')
        setUserInfo(res.data)
        navigate('/')
      } else {
        message.error(res.message)
      }
      setLoading(false)
    }).catch((err) => {
      message.error('登录失败')
      setLoading(false)
    })
  };

  const renderForm = () => {
    return  <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%' }}>
      <FormControl fullWidth error={!!errors.username} margin="normal">
        <FormInputLabel htmlFor="username-input">用户名</FormInputLabel>
        <FormInput
            id="username-input"
            aria-describedby="username-helper-text"
            label="用户名"
            {...register("username", {
              required: '请输入登录账户',
            })}
        />
        <FormHelperText id="username-helper-text" sx={{ height: '20px', }}>
          {errors.username?.message}
        </FormHelperText>
      </FormControl>
      {/* 密码 */}
      <FormControl fullWidth error={!!errors.password} margin="normal">
        <FormInputLabel htmlFor="password-input">密码</FormInputLabel>
        <FormInput
            id="password-input"
            aria-describedby="password-helper-text"
            label="密码"
            {...register("password", {
              required: '请输入登录密码',
              minLength: {
                value: 6,
                message: "登录密码不能低于6位"
              }
            })}
        />
        <FormHelperText id="password-helper-text" sx={{ height: '20px', }}>
          {errors.password?.message}
        </FormHelperText>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <Button
            type="submit"
            variant="contained"
            color="info"
            size="large"
            loading={loading}>
          登录
        </Button>
      </FormControl>
    </Box>
  }

  return (
      <Box component="div" sx={{
        // background: 'var(--custom-palette-background-paper)',
        background: `url(${LoginBackImage})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: '100vh',
        overflow: 'hidden',
      }}>
        <Box sx={{
          width: '500px',
          backgroundColor: 'rgba(22, 56, 108, 0.8)',
          border: '1px solid #19659f',
          // backgroundColor: 'var(--custom-card-background)',
          // borderRadius: 2,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mr: 30
        }}>
          {/*<Box*/}
          {/*    component="img"*/}
          {/*    src={globalThis.CONSTANTS.SYSTEM_LOGO}*/}
          {/*    sx={{ width: '50px', height: '50px' , display: 'flex', justifyContent: 'center' }}*/}
          {/*/>*/}
          {/*<Text component="h5" variant="h5">*/}
          {/*  {globalThis.CONSTANTS.SYSTEM_NAME}*/}
          {/*</Text>*/}
          <Box sx={{ height: '8px'}}/>
          <Text component="p" variant="subtitle1">
            登录您的账户！
          </Text>
          {renderForm()}
        </Box>
      </Box>
  );
}
export default Login;