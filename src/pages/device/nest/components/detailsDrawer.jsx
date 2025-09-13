import {Fragment} from 'react';
import {Box, Typography, Stack, styled} from '@mui/material';
import {transportStatusFilter} from '@/filters'
import CustomDrawer from '@/components/customDrawer'


const CustomStack = styled(Stack)(({ theme}) => ({
  marginBottom: 40,
  flexDirection: 'row',
  gap: theme.spacing(2),
}))

const CustomBox = styled(Box)({
  display: 'flex',
  alignItems: 'baseline',
  width: '50%'
})

const CustomTypography = styled(Typography, (prop => (
    <CustomTypography component="p" variant="p" />
)))({
  fontSize: '14px',
  color: 'var(--custom-palette-color-1)',
  // minWidth: '100px',
  // textAlign: 'left',
})
const DetailsDrawer = (props) => {
  const { open, data, onClose } = props;

  const { renderTransportStatus } = transportStatusFilter()

  const handleClose= () => onClose()

  const renderContent = () => {
    return (
        <Fragment>
          <CustomStack>
            <CustomBox>
              <CustomTypography>物流ID：</CustomTypography>
              <Typography>{ data.task_id }</Typography>
            </CustomBox>
            <CustomBox>
              <CustomTypography>订单号：</CustomTypography>
              <Typography>
                { data.order_ids ? data.order_ids.join(', ') : '--' }
              </Typography>
            </CustomBox>
          </CustomStack>
          <CustomStack>
            <CustomBox>
              <CustomTypography>运输状态：</CustomTypography>
              {renderTransportStatus(data.status)}
            </CustomBox>
            <CustomBox>
              <CustomTypography>货物信息：</CustomTypography>
              <Typography>
                {data.cargoes}
              </Typography>
            </CustomBox>
          </CustomStack>
          <CustomStack>
            <CustomBox>
              <CustomTypography>起点：</CustomTypography>
              <Typography>{data.start_location}</Typography>
            </CustomBox>
            <CustomBox>
              <CustomTypography>终点：</CustomTypography>
              <Typography>{data.end_location}</Typography>
            </CustomBox>
          </CustomStack>
          <CustomStack>
            <CustomBox>
              <CustomTypography>发车时间：</CustomTypography>
              <Typography>{ data.start_time }</Typography>
            </CustomBox>
            <CustomBox>
              <CustomTypography>预计到达时间：</CustomTypography>
              <Typography>
                {data.expected_end_time}
              </Typography>
            </CustomBox>
          </CustomStack>
          <CustomStack>
            <CustomBox>
              <CustomTypography>实际到达时间：</CustomTypography>
              <Typography>{ data.end_time }</Typography>
            </CustomBox>
          </CustomStack>
          {
            (data.drivers || []).map((item, index) => (
                <CustomStack key={index}>
                  <CustomBox>
                    <CustomTypography>司机姓名：</CustomTypography>
                    <Typography>
                      {item.name}
                    </Typography>
                  </CustomBox>
                  <CustomBox>
                    <CustomTypography>手机号：</CustomTypography>
                    <Typography>{item.phone}</Typography>
                  </CustomBox>
                </CustomStack>
            ))
          }
        </Fragment>
    )
  }

  return (
      <CustomDrawer
          open={open}
          onClose={handleClose}
          title="查看物流详情"
          children={renderContent()}
      />
  )
}

export default DetailsDrawer;