import {Fragment} from 'react';
import {AppBar, Box, Drawer, Toolbar, Typography, IconButton, Stack} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {deviceStatusFilter} from '@/filters'

const DetailsDrawer = (props) => {
  const { open, data, onClose } = props;
  const { renderFireStatus } = deviceStatusFilter()
  const handleClose= () => onClose()

  const renderContent = () => {
    return (
        <Fragment>
          <Stack direction="row" spacing={2} sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                设备ID：
              </Typography>
              <Typography>{ data.id }</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                设备名称：
              </Typography>
              <Typography>{ data.name }</Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                设备状态：
              </Typography>
              <Typography>
                {renderFireStatus(data.status)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                负责人：
              </Typography>
              <Typography>
                { data.manager }
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                设备类型：
              </Typography>
              <Typography>
                {data.type}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                生产厂家：
              </Typography>
              <Typography>
                { data.manufacturer }
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                额定功率（VA 或 kVA）：
              </Typography>
              <Typography>
                {data.power_capacity}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                序列号：
              </Typography>
              <Typography>
                { data.serialNumber }
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                安装位置：
              </Typography>
              <Typography>
                {data.location}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                出厂日期：
              </Typography>
              <Typography>
                { data.manufactureDate }
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                创建时间：
              </Typography>
              <Typography>
                {data.createTime}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                安装日期：
              </Typography>
              <Typography>
                { data.installDate }
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                最近维护日期：
              </Typography>
              <Typography>
                {data.lastCheckDate}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                剩余供电时间：
              </Typography>
              <Typography>
                { data.runtime_remaining }分钟
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                内部温度（℃）：
              </Typography>
              <Typography>
                {data.temperature}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                当前负载百分比：
              </Typography>
              <Typography>
                { data.load_percent }
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                所属部门：
              </Typography>
              <Typography>
                { data.department }
              </Typography>
            </Box>
          </Stack>
        </Fragment>
    )
  }
  return (
      <Drawer
          elevation={0}
          open={open}
          variant="temporary"
          onClose={handleClose}
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 2,
            '& .MuiDrawer-paper': {
              width: '40%'
            },
          }}
      >
        <AppBar elevation={0} component="nav" sx={{ position: 'sticky', width: '100%'}}>
          <Toolbar>
            <Typography
                variant="p"
                component="div"
                sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
            >
              查看UPS电源详情
            </Typography>
            <IconButton aria-label="close" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box component="main" sx={{ p: 3 }}>
          { renderContent() }
        </Box>
      </Drawer>
  );
}

export default DetailsDrawer;