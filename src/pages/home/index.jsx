import {useState, useEffect} from "react";
import {Box, Grid} from '@mui/material'
import CustomCard from "@/components/customCard";
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
	<Box>
	  <CustomCard cardContentStyle={{
		p: 0,
		['&:last-child']: {
		  paddingBottom: 0,
		}
	  }}>
		<Box sx={{p: 2}}>
		  {/*<CustomTabs*/}
		  {/*activeTabValue={activeTab}*/}
		  {/*tabs={tabs}*/}
		  {/*fields={{ label: 'label', value: 'id' }}*/}
		  {/*saveTab={setTab}*/}
		  {/*/>*/}
		  <Box sx={{mb: 2}} />
		  <Count1 data={droneCount} />
		  <Box sx={{mb: 2}} />
		  <Grid container spacing={1}>
			{/*<Grid size={3}>*/}
			{/*  <Count2 xAxis={historyDate} totalData={historyMileage} />*/}
			{/*  <Box sx={{mb: 2}} />*/}
			{/*  <Count4 xAxis={historyDate} totalData={historyActual} />*/}
			{/*</Grid>*/}
			<Grid size="grow">
			  <Count6 list={dronePosition} />
			</Grid>
			<Grid size={3}>
			  <Count3 data={flightCount} />
			  {/*<Box sx={{mb: 2}} />*/}
			  {/*<Count5 />*/}
			</Grid>
		  </Grid>
		</Box>
	  </CustomCard>
	</Box>
  )
}
export default DroneCount