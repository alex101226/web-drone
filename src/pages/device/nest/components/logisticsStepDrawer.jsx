import {useEffect, useState} from 'react';
import {Box, Stepper, Step, Typography, StepLabel} from '@mui/material';
import CustomDrawer from '@/components/customDrawer'
import { getCurrentTransport } from '@/services'

const LogisticsStepDrawer = (props) => {
  const { open, data, onLogisticsClose } = props;

  const [logistics, setLogistics] = useState([])
  const fetchCurrentTransport = () => {
    const params = {
      route_id: data.route_id,
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
    const length = logistics.length
    return data.status === '4' ? length + 1 : length - 1;
  }

  const handleClose= () => onLogisticsClose()

  const renderContent = () => {
    return (
        <Box>
          <Stepper activeStep={activeStep()} orientation="vertical">
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
        </Box>
    )
  }

  return (
      <CustomDrawer
          title="查看车辆位置"
          w={30}
          open={open}
          onClose={handleClose}
          children={renderContent()}
      />
  )
}

export default LogisticsStepDrawer;