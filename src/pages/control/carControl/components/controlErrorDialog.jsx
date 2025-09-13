import CustomDialog from '@/components/CustomDialog/index.jsx'
import {Button, Typography} from '@mui/material';

const ControlErrorDialog = (props) => {
  const { onClose, open, data } = props;
  //  关闭按钮
  const handleClose = () => {
    onClose(false)
  }

  //  底部
  const renderAction = () => {
    return <Button variant="contained" onClick={handleClose}>
      关闭
    </Button>
  }

  const renderContent = () => {
    return <Typography component="p" variant="body2" textAlign="center">
      {data}
    </Typography>
  }
  return (
      <CustomDialog
          open={open}
          maxWidth="xs"
          title="提示"
          content={renderContent()}
          actions={renderAction()}
      />
  )
}
export default ControlErrorDialog