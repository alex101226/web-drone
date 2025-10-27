import {Box, Stack, Typography} from '@mui/material'
import { PieChart } from '@mui/x-charts/PieChart';
import CustomCard from "@/components/customCard/index.jsx";

const data = [
  { label: '已完成', value: 400, color: '#0088FE' },
  { label: '执飞中', value: 300, color: '#00C49F' },
  { label: '空闲', value: 300, color: '#FFBB28' },
];
const Count5 = () => {

  const renderHeader = () => {
	return (
	  <Stack direction="row" spacing={1} alignItems="center">
		<Box sx={{width: 4, height: 16, background: 'var(--custom-input-border-color)'}}/>
		<Stack direction="row" alignItems="baseline">
		  <Typography component="p" variant="body2">
			飞行任务状态
		  </Typography>
		</Stack>
	  </Stack>
	)
  }

  return (
	<CustomCard
	  cardType="outlined"
	  actionChildren={renderHeader()}>
	  <PieChart
		slotProps={{
		  legend: {
			direction: 'horizontal',
			position: {
			  vertical: 'middle',
			  horizontal: 'center'
			}
		  }
		}}
		series={[
		  {
			data: data,
			innerRadius: 30,
			outerRadius: 70,
			paddingAngle: 5,
			cornerRadius: 5,
			startAngle: -45,
			endAngle: 225,
		  }
		]}
	  />
	</CustomCard>
  )
}
export default Count5