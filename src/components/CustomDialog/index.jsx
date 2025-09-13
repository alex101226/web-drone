import {Dialog, DialogActions, DialogContent, DialogTitle} from '@mui/material';

const CustomDialog = (props) => {
  const { content, open, title, actions, ...resetProps } = props;
  //  渲染dialog内容
  const renderContent = () => {
    return content
  }

  //  渲染dialog底部
  const renderActions = () => {
    return actions;
  }
  return (
      <Dialog
          open={open}
          onClose={() => handleClose(false)}
          fullWidth
          {...resetProps}>
        <DialogTitle>{ title }</DialogTitle>
        <DialogContent dividers>
          { renderContent() }
        </DialogContent>
        <DialogActions>
          { renderActions() }
        </DialogActions>
      </Dialog>
  )
}
export default CustomDialog;