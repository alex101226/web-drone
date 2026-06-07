import {Box, Divider, LinearProgress, Stack, Typography} from '@mui/material'
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded';
import RouteRoundedIcon from '@mui/icons-material/RouteRounded';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';

const Count3 = (props) => {
  const {data} = props
  const taskTotal = Number(data?.taskTotal) || 0
  const dispatchTotal = Number(data?.dispatchTotal) || 0
  const completionRate = taskTotal ? Math.min(100, Math.round(dispatchTotal / taskTotal * 100)) : 0
  const statistics = [
	{ label: '平均飞行速度', value: data?.avgPpeed, unit: 'm/s', icon: SpeedRoundedIcon, color: '#0AAE8F' },
	{ label: '累计飞行里程', value: data?.mileageTotal, unit: 'km', icon: RouteRoundedIcon, color: '#4E6E8E' },
	{ label: '已完成任务', value: data?.dispatchTotal, unit: '条', icon: TaskAltRoundedIcon, color: '#D9822B' },
	{ label: '任务总数', value: data?.taskTotal, unit: '条', icon: AssignmentRoundedIcon, color: '#3679A8' },
  ]

  return (
	<Box
	  sx={{
		height: '100%',
		minHeight: 590,
		p: 2.75,
		borderRadius: 3,
		background: '#fff',
		border: '1px solid rgba(16, 42, 67, 0.07)',
		boxShadow: '0 16px 44px rgba(24, 55, 84, 0.07)',
	  }}
	>
	  <Typography variant="h6" fontWeight={750} color="#102A43">
		飞行运营
	  </Typography>
	  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.35, mb: 2.5, display: 'block' }}>
		任务执行与飞行效能
	  </Typography>

	  <Box
		sx={{
		  position: 'relative',
		  overflow: 'hidden',
		  p: 2.5,
		  mb: 2,
		  borderRadius: 2.5,
		  color: '#fff',
		  background: 'linear-gradient(145deg, #102A43 0%, #1D4D6D 100%)',
		  '&::after': {
			content: '""',
			position: 'absolute',
			width: 120,
			height: 120,
			right: -45,
			bottom: -55,
			borderRadius: '50%',
			border: '24px solid rgba(255,255,255,0.06)',
		  },
		}}
	  >
		<Stack direction="row" justifyContent="space-between" alignItems="flex-start">
		  <Box>
			<Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.65)' }}>
			  累计飞行时间
			</Typography>
			<Stack direction="row" spacing={0.75} alignItems="baseline" sx={{ mt: 0.75 }}>
			  <Typography variant="h3" fontWeight={750}>
				{data?.actualTotal ?? '--'}
			  </Typography>
			  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>小时</Typography>
			</Stack>
		  </Box>
		  <Box sx={{ p: 1, display: 'grid', placeItems: 'center', borderRadius: '50%', background: 'rgba(255,255,255,0.12)' }}>
			<AccessTimeRoundedIcon />
		  </Box>
		</Stack>
	  </Box>

	  <Box>
		{statistics.map((item, index) => {
		  const Icon = item.icon
		  return (
			<Box key={item.label}>
			  <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 1.65 }}>
				<Stack direction="row" spacing={1.25} alignItems="center">
				  <Icon sx={{ fontSize: 19, color: item.color }} />
				  <Typography variant="body2" color="#4F6072">{item.label}</Typography>
				</Stack>
				<Stack direction="row" spacing={0.4} alignItems="baseline">
				  <Typography variant="subtitle1" fontWeight={700} color="#172536">{item.value ?? '--'}</Typography>
				  <Typography variant="caption" color="text.secondary">{item.unit}</Typography>
				</Stack>
			  </Stack>
			  {index < statistics.length - 1 && <Divider />}
			</Box>
		  )
		})}
	  </Box>

	  <Box sx={{ mt: 2.25, p: 2, borderRadius: 2, background: '#F5F8FA' }}>
		<Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
		  <Typography variant="body2" fontWeight={600} color="#435669">任务完成率</Typography>
		  <Typography variant="body2" fontWeight={700} color="#172536">{completionRate}%</Typography>
		</Stack>
		<LinearProgress
		  variant="determinate"
		  value={completionRate}
		  sx={{
			height: 7,
			borderRadius: 8,
			backgroundColor: '#E5EBF3',
			'& .MuiLinearProgress-bar': {
			borderRadius: 8,
			background: '#20A37A',
			},
		  }}
		/>
	  </Box>
	</Box>
  )
}
export default Count3
