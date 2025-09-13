import {Box, Typography} from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';
import CustomCard from '@/components/customCard';
import { getYesTodayLineData } from '../../mock'

const length = 24;

export default function LiveLineChartNoSnap() {

  //  card action
  const cardAction = () => {
    return (
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          flex: 1,
          p: 0.5,
        }}>
          <Typography component="p" variant="p" fontWeight="700">
            昨日风险区域数据
          </Typography>
        </Box>
    )
  }

  const seriesData =  [
    {
      data: getYesTodayLineData(length, 30),
      showMark: false,
      label: '油品区',
      color: '#C5CAE9',
      area: true,
    },
    {
      data: getYesTodayLineData(length, 30),
      showMark: false,
      label: '电仪修区',
      color: '#9FA8DA',
      area: true,
    },
    {
      data: getYesTodayLineData(length, 30),
      showMark: false,
      label: 'LNG存储罐区',
      color: '#5C6BC0',
      area: true,
    },
    {
      data: getYesTodayLineData(length, 30),
      showMark: false,
      label: '冷剂罐区',
      color: '#3949AB',
      area: true,
    },
    {
      data: getYesTodayLineData(length, 30),
      showMark: false,
      label: 'LNG装车站',
      color: '#283593',
      area: true,
    },
  ]
  return (
      <CustomCard  actionChildren={cardAction()}>
        {/* position: 'none',去除坐标的  hideLegend: 是否隐藏 */}
        <LineChart
            height={400}
            skipAnimation
            series={seriesData}
            xAxis={[
              {
                scaleType: 'point',
                data: Array.from({ length }).map((_, i) => i),
                valueFormatter: (value) => `${value}时`
              },
            ]}
            yAxis={[{ width: 0 }]}
        />
      </CustomCard>
  );
}