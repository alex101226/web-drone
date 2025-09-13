import {Fragment} from 'react';
import {Box, Typography, Stack} from '@mui/material';
import {carStatusFilter} from '@/filters'
import {coverDateString} from "@/utils/index.js";
import CustomDrawer from '@/components/customDrawer'

const DetailsDrawer = (props) => {
  const { open, data, onDetailsClose } = props;
  const { renderCarStatus } = carStatusFilter()

  const handleClose= () => onDetailsClose()

  const renderContent = () => {
    return data
        ? <Fragment>
          <Stack direction="row" spacing={2} sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                车辆名称：
              </Typography>
              <Typography>{ data.vehicle_alias }</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                车辆品牌：
              </Typography>
              <Typography>
                { data.brand }
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                系列号：
              </Typography>
              <Typography>
                {data.series_number}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                VIN码：
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                <Typography>
                  {data.vin_code}
                </Typography>
              </Box>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                里程数/KG：
              </Typography>
              <Typography>
                {data.mileage}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                车牌号：
              </Typography>
              <Typography>
                { data.plate_number }
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                燃油类型：
              </Typography>
              <Typography>
                {data.fuel_type}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                发动机号：
              </Typography>
              <Typography>
                { data.engine_number }
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                所属部门：
              </Typography>
              <Typography>
                {data.department}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                负责人：
              </Typography>
              <Typography>
                { data.operator_nickname }
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                车辆状态：
              </Typography>
              { renderCarStatus(data.status.toString()) }
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                出厂年份：
              </Typography>
              <Typography>
                { data.manufacture_year }
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                保险到期日期：
              </Typography>
              <Typography>
                {coverDateString(data.insurance_expiry, '1')}
              </Typography>
            </Box>
            <Box component="div" sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                车辆购买时间：
              </Typography>
              <Typography>
                { coverDateString(data.purchase_date, '1') }
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                车辆位置：
              </Typography>
              <Typography>
                {data.location}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                司机：
              </Typography>
              <Typography>
                { data.driver_names ? data.driver_names.join(', ') : '' }
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mb: 12 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                车辆照片：
              </Typography>
              {
                data.vehicle_photo
                  ? <Box component="img" src={globalThis.CONSTANTS.STATIC_URL + data.vehicle_photo} />
                    : <Typography>暂无照片</Typography>
              }
            </Box>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mb: 12 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
              <Typography variant="p" component="p" sx={{ color: 'var(--custom-palette-color-1)' }}>
                备注：
              </Typography>
              <Typography>{ data.remark }</Typography>
            </Box>
          </Stack>
        </Fragment>
        : null
  }
  return (
      <CustomDrawer
          title="查看车辆详情"
          open={open}
          onClose={handleClose}
          children={renderContent()}
      />
  )
}

export default DetailsDrawer;