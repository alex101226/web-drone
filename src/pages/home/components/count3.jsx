import {Box, Stack, styled, Typography} from '@mui/material'
import CustomCard from "@/components/customCard/index.jsx";

const Item = styled(Box, {
  shouldForwardProp: (props) => props !== 'borderColor'
})(({theme, borderColor}) => ({
  border: `2px solid ${borderColor}`,
  padding: theme.spacing(2.55),
  borderRadius: 4,
  backgroundColor: borderColor,
  color: 'white',
}))
const Count3 = (props) => {
	const {data} = props
  const renderHeader = () => {
	return (
	  <Stack direction="row" spacing={1} alignItems="center">
		<Box sx={{width: 4, height: 16, background: 'var(--custom-input-border-color)'}}/>
		<Stack direction="row" alignItems="baseline">
		  <Typography component="p" variant="body2">
			飞行统计
		  </Typography>
		</Stack>
	  </Stack>
	)
  }

  return (
	<CustomCard
	  cardType="outlined"
	  actionChildren={renderHeader()}>
	  <Item borderColor="#7986CB">
		<Stack direction="row" justifyContent="space-between" alignItems="center">
		  <Typography variant="body2">飞行时间</Typography>
		  <Typography fontSize={18} color="#FFAB00">
			{data?.actualTotal}小时
		  </Typography>
		</Stack>
	  </Item>
	  <Box sx={{mb: 2}} />
	  <Item borderColor="#5C6BC0">
		<Stack direction="row" justifyContent="space-between" alignItems="center">
		  <Typography variant="body2">平均飞行速度</Typography>
		  <Typography fontSize={18} color="#FFAB00">
			{data?.avgPpeed}m/s
		  </Typography>
		</Stack>
	  </Item>
	  <Box sx={{mb: 2}} />
	  <Item borderColor="#3F51B5">
		<Stack direction="row" justifyContent="space-between" alignItems="center">
		  <Typography variant="body2">里程数</Typography>
		  <Typography fontSize={18} color="#FFAB00">
			{data?.mileageTotal}千米
		  </Typography>
		</Stack>
	  </Item>
	  <Box sx={{mb: 2}} />
	  <Item borderColor="#3949AB">
		<Stack direction="row" justifyContent="space-between" alignItems="center">
		  <Typography variant="body2">已完成任务</Typography>
		  <Typography fontSize={18} color="#FFAB00">
			{data?.dispatchTotal}条
		  </Typography>
		</Stack>
	  </Item>
	  <Box sx={{mb: 2}} />
	  <Item borderColor="#303F9F">
		<Stack direction="row" justifyContent="space-between" alignItems="center">
		  <Typography variant="body2">任务总数</Typography>
		  <Typography fontSize={18} color="#FFAB00">
			{data?.taskTotal}条
		  </Typography>
		</Stack>
	  </Item>
	</CustomCard>
  )
}
export default Count3