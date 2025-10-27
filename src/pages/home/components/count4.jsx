import {Box, Stack, Typography} from '@mui/material'
import { LineChart } from '@mui/x-charts/LineChart';
// import dayjs from 'dayjs';

import CustomCard from "@/components/customCard/index.jsx";

const Count4 = (props) => {
  const {xAxis = [], totalData = []} = props
  // 生成24小时折线图数据
  // const last7Days = Array.from({ length: 7 }).map((_, i) =>
	// dayjs().subtract(6 - i, "day").format("MM/DD")
  // );

  const renderHeader = () => {
	return (
	  <Stack direction="row" spacing={1} alignItems="center">
		<Box sx={{width: 4, height: 16, background: 'var(--custom-input-border-color)'}}/>
		<Stack direction="row" alignItems="baseline">
		  <Typography component="p" variant="body2">
			飞行里程
		  </Typography>
		  <Typography component="p" variant="caption" color="textSecondary">
			（千米/日）
		  </Typography>
		</Stack>
	  </Stack>
	)
  }
  return (
	<CustomCard
	  cardType="outlined"
	  actionChildren={renderHeader()}>
	  <LineChart
		skipAnimation
		series={[
		  { data: totalData, showMark: false },
		]}
		xAxis={[
		  { scaleType: 'point', data: xAxis },
		]}
		yAxis={[{ width: 16 }]}
		margin={{ left: 0 }}
	  />
	</CustomCard>
  )
}
export default Count4