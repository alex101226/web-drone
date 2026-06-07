import {useState, useEffect} from "react";
import {Box, Grid, Stack, Typography} from '@mui/material'
import NorthEastRoundedIcon from '@mui/icons-material/NorthEastRounded';
import Count1 from './components/count1'
import Count3 from './components/count3'
import Count6 from './components/count6'
// import Count2 from './components/count2'
// import Count4 from './components/count4'
// import Count5 from './components/count5'

import {droneInfoCount, flightMileageCount, getDronePosition, getFlightCount} from '@/services'

const DroneCount = () => {
  //	无人机的统计
  const [droneCount, setDroneCount] = useState({})
  const fetchDroneCount = () => {
	droneInfoCount().then(res => {
	  if (res.code === 0) {
		setDroneCount(res.data)
	  }
	})
  }

  //	飞行时长	actual
  const [historyDate, setHistoryDate] = useState([])
  const [historyMileage, setHistoryMileage] = useState([])
  const [historyActual, setHistoryActual] = useState([])
  const fetchFlightMileageCount = () => {
	flightMileageCount().then(res => {
	  if (res.code === 0) {
		setHistoryDate(res.data.xAxis)
		setHistoryMileage(res.data.mileage)
		setHistoryActual(res.data.actual)
	  }
	})
  }

  //	查询所有无人机的位置
  const [dronePosition, setDronePosition] = useState([])
  const fetchDronePosition = () => {
	getDronePosition().then(res => {
	  if (res.code === 0) {
		setDronePosition(res.data)
	  }
	})
  }

  //	飞行统计
  const [flightCount, setFlightCount] = useState({})
  const fetchFlightCount = () => {
	getFlightCount().then(res => {
	  if (res.code === 0) {
		setFlightCount(res.data)
	  }
	})
  }
  const initFetch = () => {
	fetchDroneCount()
	// fetchFlightMileageCount()
	fetchDronePosition()
	fetchFlightCount()
  }
  useEffect(() => {
	initFetch()
  }, [])
  return (
	<Box sx={{ width: '100%', pb: 2 }}>
	  <Stack
		direction={{ xs: 'column', sm: 'row' }}
		justifyContent="space-between"
		alignItems={{ xs: 'flex-start', sm: 'center' }}
		spacing={1}
		sx={{ mb: 3, pt: 0.5 }}
	  >
		<Box>
		  <Typography
			sx={{
			  fontSize: { xs: 28, md: 34 },
			  lineHeight: 1.15,
			  fontWeight: 750,
			  color: '#102A43',
			  letterSpacing: -0.5,
			}}
		  >
			低空智航中心
		  </Typography>
		  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.85 }}>
			全域感知 · 智能调度 · 安全飞行
		  </Typography>
		</Box>
		<Stack direction="row" spacing={1} alignItems="center" sx={{ color: '#486581' }}>
		  <Typography variant="caption" sx={{ letterSpacing: 1.2 }}>LIVE OPERATION</Typography>
		  <Box sx={{ width: 36, height: 36, display: 'grid', placeItems: 'center', borderRadius: '50%', border: '1px solid #D9E2EC' }}>
			<NorthEastRoundedIcon sx={{ fontSize: 18 }} />
		  </Box>
		</Stack>
	  </Stack>

	  <Count1 data={droneCount} />

	  <Grid container spacing={2.5} sx={{ mt: 0 }}>
		<Grid size={{ xs: 12, lg: 8.5 }}>
		  <Count6 list={dronePosition} />
		</Grid>
		<Grid size={{ xs: 12, lg: 3.5 }}>
		  <Count3 data={flightCount} />
		</Grid>
	  </Grid>
	</Box>
  )
}
export default DroneCount
