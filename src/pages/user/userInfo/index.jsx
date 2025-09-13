import {useState} from 'react';
import {Box, Button, Divider, Grid, styled, Typography} from '@mui/material'
import CustomCard from '@/components/customCard/index.jsx'
import SavePasswordDialog from './components/savePasswordDialog.js'
import { useUserStore } from '@/store/index.js'
import { userStatusFilter } from '@/filters/index.js'

const Text = styled(Typography)({
  color: 'var(--custom-palette-color-3)',
  fontWeight: 'bold',
  marginBottom: 5
})

const UserInfo = () => {
  const { userInfo } = useUserStore()

  const [open, setOpen] = useState(false)
  const handleOpen = (flag) => {
    setOpen(flag)
  }

  const {renderUserStatus} = userStatusFilter()
  return (
      <Box sx={{ width: '1200px', margin: '0 auto' }}>
        <CustomCard>
          <Text variant="h4" component="h4">用户信息</Text>
          <Divider />
          <Box sx={{ mb: 6 }}/>
          <Grid container sx={{ mb: 3 }}>
            <Grid>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                用户昵称：
              </Typography>
            </Grid>
            <Grid>
              {userInfo.nickname}
            </Grid>
          </Grid>
          <Grid container sx={{ mb: 3 }}>
            <Grid>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                用户名：
              </Typography>
            </Grid>
            <Grid>
              {userInfo.username}
            </Grid>
          </Grid>
          <Grid container sx={{ mb: 3 }}>
            <Grid>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                用户角色：
              </Typography>
            </Grid>
            <Grid>
              {userInfo.role_description}
            </Grid>
          </Grid>
          <Grid container sx={{ mb: 3 }}>
            <Grid>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                所在部门：
              </Typography>
            </Grid>
            <Grid>
              {userInfo.department}
            </Grid>
          </Grid>
          <Grid container sx={{ mb: 3 }}>
            <Grid>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                用户职位：
              </Typography>
            </Grid>
            <Grid>
              {userInfo.position}
            </Grid>
          </Grid>
          <Grid container sx={{ mb: 3 }}>
            <Grid>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                当前位置：
              </Typography>
            </Grid>
            <Grid>
              {userInfo.location}
            </Grid>
          </Grid>
          <Grid container sx={{ mb: 3 }}>
            <Grid>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                用户状态：
              </Typography>
            </Grid>
            <Grid>
              {renderUserStatus(userInfo.status || '1')}
            </Grid>
          </Grid>
          <Box sx={{ mb: 10 }}/>

          <Text variant="h4" component="h4">修改密码</Text>
          <Divider />
          <Box sx={{ mb: 6 }}/>
          <Grid container alignItems="center">
            <Grid>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                登录密码：
              </Typography>
            </Grid>
            <Grid>
              <Typography variant="h6" component="h6" sx={{ color: 'var(--custom-palette-color-1)' }}>
                ******
              </Typography>
            </Grid>
            <Grid size={1} />
            <Grid>
              <Button variant="contained" onClick={() => handleOpen(true)}>
                修改密码
              </Button>
            </Grid>
          </Grid>
          <SavePasswordDialog open={open} onClose={(flag) => handleOpen(flag) } />
        </CustomCard>
      </Box>
  )
}
export default UserInfo