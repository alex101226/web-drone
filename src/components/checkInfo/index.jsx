import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';

const PeopleCheck = ({ open, onClose, text, labelText, title }) => {

  //  取消
  const handleClose = () => {
    onClose();
  }

  return (
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{ title }</DialogTitle>
        <DialogContent dividers>
          <TextField
              label={labelText}
              value={text}
              fullWidth
              margin="normal"
              disabled
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained">
            关闭
          </Button>
        </DialogActions>
      </Dialog>
  );
};

export default PeopleCheck;
