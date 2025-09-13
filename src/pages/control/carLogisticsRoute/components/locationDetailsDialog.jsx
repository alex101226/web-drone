import {useEffect, useState} from 'react';
import CustomDialog from '@/components/CustomDialog/index.jsx'
import {Typography, Stepper, Step, StepLabel, Button} from '@mui/material';
import { getCurrentTransport } from '@/services/index.js'

const LocationDetailsDialog = ({ onClose, open, data }) => {

  const [logistics, setLogistics] = useState([])
  const fetchCurrentTransport = () => {
    const params = {
      route_id: data.id,
    }

    getCurrentTransport(params).then((res) => {
      if (res.code === 0) {
        setLogistics(res.data)
      }
    })
  }

  useEffect(() => {
    if (open) {
      fetchCurrentTransport()
    }
  }, [open])
  //  当前的步数
  const activeStep = () => {
    return logistics.length
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

  //  内容
  const renderContent = () => {
    return <Stepper activeStep={activeStep()} orientation="vertical">
      {logistics.map((item, index) => {
        return (
            <Step key={index}>
              <StepLabel
                  optional={
                    <Typography component="p" variant="caption">{item.address}</Typography>}
              >{item.name}</StepLabel>
            </Step>
        );
      })}
    </Stepper>
  }

  return (
      <CustomDialog
          open={open}
          title="路线轨迹"
          maxWidth="xs"
          content={renderContent()}
          actions={renderAction()}
      />
  )
}
export default LocationDetailsDialog;