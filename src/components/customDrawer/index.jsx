import {AppBar, Box, Divider, Drawer, IconButton, Toolbar, Typography} from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";

const CustomDrawer = (props) => {
  const {open, onClose, w = 40, title, children, actions} = props

  const handleClose = () => {
    onClose()
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
              width: `${w}%`
            },
          }}>
        <AppBar elevation={0} component="nav" sx={{ position: 'sticky', width: '100%'}}>
          <Toolbar>
            <Typography
                variant="p"
                component="div"
                align="center"
                sx={{ flexGrow: 1 }}
            >
              {title}
            </Typography>
            <IconButton aria-label="close" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Toolbar>
          <Divider />
        </AppBar>
        <Box component="main" sx={{ p: 3, flex: 1 }}>
          {children}
        </Box>
        {actions && actions}
      </Drawer>
  )
}
export default CustomDrawer