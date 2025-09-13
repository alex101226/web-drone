import { useEffect, useState } from 'react';
import {AppBar, Box, Drawer, IconButton, Toolbar, Typography, CircularProgress} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CustomDrawer from '@/components/customDrawer';
import { useServiceDrawer } from '@/store'

const CustomServiceDrawer = () => {
  const { openServiceDrawer, setServiceDrawer } = useServiceDrawer()

  const handleClose = () => {
    setServiceDrawer(false)
  }

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (openServiceDrawer) {
      setLoading(true)
    }
  }, [openServiceDrawer])

  const handleCloseLoading = () => {
    setLoading(false)
  }

  const renderContent = () => {
    return <Box
        component="iframe"
        src={globalThis.CONSTANTS.SERVICE_URL}
        width="100%"
        height="800px"
        frameBorder="0"
        onLoad={handleCloseLoading}
    />
  }
  return (
      <Drawer
          elevation={0}
          open={openServiceDrawer}
          variant="temporary"
          onClose={openServiceDrawer}
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
            />
            <IconButton aria-label="close" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box component="main" sx={{flex: 1, position: 'relative',}}>
          {loading && <CircularProgress sx={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }} />}
          { renderContent() }
        </Box>
      </Drawer>
  )
}
export default CustomServiceDrawer;