import {Alert, Box, Button} from '@mui/material';
import CustomDialog from '@/components/CustomDialog'
import {renderCellExpand} from '@/components/CustomCellExpand'


const CurrentPositonDialog = (props) => {
  const { open, onClose, data, location } = props;

  //  内容
  const renderContent = () => {
    return <Alert severity="info">
      {data.nickname}当前在：{ location }
    </Alert>
  }

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
  return (
      <CustomDialog
          open={open}
          title="当前位置"
          content={renderContent()}
          actions={renderAction()}
      />
  )
}
export default CurrentPositonDialog;