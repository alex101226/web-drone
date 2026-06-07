import {Box, Grid, Typography, Stack} from '@mui/material'
import DroneCount1 from '@/assets/images/drone-count-1.svg'
import DroneCount2 from '@/assets/images/drone-count-2.svg'
import DroneCount3 from '@/assets/images/drone-count-3.svg'
import DroneCount4 from '@/assets/images/drone-count-4.svg'
import DroneCount5 from '@/assets/images/drone-count-5.svg'
import DroneCount6 from '@/assets/images/drone-count-6.svg'
import DroneCount7 from '@/assets/images/drone-count-7.svg'

const metrics = [
  { label: '无人机总量', field: 'droneTotal', unit: '架', icon: DroneCount1, color: '#1F5EFF' },
  { label: '在线无人机', field: 'droneOnline', unit: '架', icon: DroneCount2, color: '#08A88A' },
  { label: '飞行总架次', field: 'flightTotal', unit: '次', icon: DroneCount5, color: '#E99A2C' },
  { label: '航线总数量', field: 'routeTotal', unit: '条', icon: DroneCount6, color: '#7257D9' },
]

const Count1 = (props) => {
  const { data } = props
  const secondaryMetrics = [
	{ label: '机巢总量', value: data?.nestTotal, unit: '座', icon: DroneCount3 },
	{ label: '在线机巢', value: data?.nestOnline, unit: '座', icon: DroneCount4 },
	{ label: '飞手总人数', value: data?.operatorTotal, unit: '人', icon: DroneCount1 },
	{ label: '在线飞手', value: data?.operatorOnline, unit: '人', icon: DroneCount7 },
  ]
  return (
	<Box
	  sx={{
		mb: 2.5,
		p: { xs: 1.5, md: 2 },
		borderRadius: 3,
		background: '#fff',
		border: '1px solid rgba(16, 42, 67, 0.07)',
		boxShadow: '0 16px 44px rgba(24, 55, 84, 0.07)',
	  }}
	>
	<Grid container spacing={1}>
	  {metrics.map((item) => (
		<Grid size={{ xs: 12, sm: 6, md: 3 }} key={item.field}>
		  <Box
			sx={{
			  position: 'relative',
			  overflow: 'hidden',
			  px: 2,
			  py: 2.25,
			  minHeight: 126,
			  borderRadius: 2.25,
			  background: '#F8FAFC',
			  transition: 'transform 180ms ease',
			  '&:hover': {
				transform: 'translateY(-2px)',
			  },
			  '&::after': {
				content: '""',
				position: 'absolute',
				width: 70,
				height: 70,
				right: -28,
				top: -28,
				borderRadius: '50%',
				border: `14px solid ${item.color}10`,
			  },
			}}
		  >
			<Stack direction="row" alignItems="center" justifyContent="space-between">
			  <Typography variant="body2" color="#627D98">{item.label}</Typography>
			  <Box sx={{ width: 32, height: 32, display: 'grid', placeItems: 'center', borderRadius: 1.25, background: item.color }}>
				<Box component="img" src={item.icon} sx={{ width: 17, height: 17 }} />
			  </Box>
			</Stack>
			<Stack direction="row" spacing={0.75} alignItems="baseline" sx={{ mt: 1.5 }}>
			  <Typography sx={{ fontSize: 30, lineHeight: 1, fontWeight: 750, color: '#102A43' }}>
				{data?.[item.field] ?? '--'}
			  </Typography>
			  <Typography variant="caption" color="text.secondary">{item.unit}</Typography>
			</Stack>
		  </Box>
		</Grid>
	  ))}
	</Grid>
	<Stack
	  direction={{ xs: 'column', md: 'row' }}
	  divider={<Box sx={{ width: '1px', alignSelf: 'stretch', background: '#E9EFF4' }} />}
	  sx={{ mt: 1.25, px: 1 }}
	>
	  {secondaryMetrics.map((item) => (
		<Stack
		  key={item.label}
		  direction="row"
		  alignItems="center"
		  justifyContent="space-between"
		  sx={{ flex: 1, px: 1.5, py: 1.25 }}
		>
		  <Stack direction="row" spacing={1} alignItems="center">
			<Box component="img" src={item.icon} sx={{ width: 16, height: 16, filter: 'brightness(0) saturate(100%) invert(42%) sepia(16%) saturate(783%) hue-rotate(165deg)' }} />
			<Typography variant="caption" color="text.secondary">{item.label}</Typography>
		  </Stack>
		  <Typography variant="body2" fontWeight={700} color="#243B53">
			{item.value ?? '--'} <Typography component="span" variant="caption" color="text.secondary">{item.unit}</Typography>
		  </Typography>
		</Stack>
	  ))}
	</Stack>
	</Box>
  )
}
export default Count1
