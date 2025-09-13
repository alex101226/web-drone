import {
  AppBar,
  Box,
  Drawer,
  Toolbar,
  Typography,
  IconButton,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {renderRadiusContained, hashRateFilter} from '@/filters';
import {Fragment} from "react";

function DetailsDrawer(props) {
  const { open, data, onClose } = props;
  const { renderTaskStatus } = hashRateFilter()
  const handleClose= () => onClose()

  const renderContent = () => {
    return (
        <Fragment>
          <Stack direction="row" spacing={2} sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                任务ID：
              </Typography>
              <Typography>{ data.id }</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                任务名称：
              </Typography>
              <Typography>{ data.taskName }</Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                任务状态：
              </Typography>
              <Typography>
                {renderTaskStatus(data.status)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                用户名：
              </Typography>
              <Typography>
                { data.username }
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                分区：
              </Typography>
              <Typography>
                {renderRadiusContained(data.region)(data.region === 'gpu' ? 'red' : 'green')()}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                QOS：
              </Typography>
              <Typography>
                { data.qos }
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                CPU核心数：
              </Typography>
              <Typography>
                {data.cpuCores}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                节点数：
              </Typography>
              <Typography>
                { data.nodes }
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                GPU卡数：
              </Typography>
              <Typography>
                {data.gpuCards}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                任务时间限制：
              </Typography>
              <Typography>
                { data.timeLimit }
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
                开始时间：
              </Typography>
              <Typography>
                { data.startTime }
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                结束时间：
              </Typography>
              <Typography>
                {data.endTime}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                运行时间：
              </Typography>
              <Typography>
                { data.runTime }
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
              查看资源详情
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