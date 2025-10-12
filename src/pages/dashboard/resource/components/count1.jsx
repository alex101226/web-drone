import { useMemo } from 'react';
import {Box, Grid, styled, Typography} from '@mui/material';
import CustomCard from '@/components/customCard'
import CustomRate from '@/components/customRate'
import { getUsageRate } from '@/utils'
import { hashRateFilter } from '@/filters'

const Text = styled(Typography)(() => ({
  maxWidth: '176px',
  whiteSpace: 'nowrap',
  fontSize: '14px',
}))
const Count1 = (props) => {
  const { data, list } = props

  const tableData = useMemo(() => {
    return list.map((item) => {
      return {
        ...item,
        node_use_rate: getUsageRate(item.nodes, data.total_nodes),
        cpu_use_rate: getUsageRate(item.cpu_number, data.total_cpu),
        gpu_use_rate: getUsageRate(item.gpu_number, data.total_gpu),
        nodeColor: '#80D8FF',
        cpuColor: '#00B0FF',
        gpuColor: '#0091EA',
      }
    })
  }, [data, list])

  const {renderTaskStatus} = hashRateFilter()

  const renderCardAction = (item) => {
    return (
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          flex: 1,
          p: 0.5,
        }}>
          <Typography component="p" variant="p" fontWeight="700">
            { item.task_name }
          </Typography>
        </Box>
    )
  }
  return (
      <Grid container spacing={2}>
        {
          tableData.map((item, index) => (
              <Grid size={4} key={index}>
                <CustomCard
                    variant="outlined"
                    actionChildren={renderCardAction(item)}>
                  <Box sx={{ mb: 4, display: 'flex' }}>
                    <Text>节点使用率：</Text>
                    <CustomRate color={item.nodeColor} rate={item.node_use_rate} />
                  </Box>
                  <Box sx={{ mb: 4, display: 'flex' }}>
                    <Text>CPU使用率：</Text>
                    <CustomRate color={item.cpuColor} rate={item.cpu_use_rate} />
                  </Box>
                  <Box sx={{ mb: 4, display: 'flex' }}>
                    <Text>GPU使用率：</Text>
                    <CustomRate color={item.gpuColor} rate={item.gpu_use_rate} />
                  </Box>
                  <Box sx={{  display: 'flex', justifyContent: 'space-between' }}>
                    <Text>使用节点数：{item.nodes}</Text>
                    { renderTaskStatus(item.status) }
                  </Box>
                </CustomCard>
              </Grid>
          ))
        }
      </Grid>
  )
}
export default Count1;