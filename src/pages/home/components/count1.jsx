import {Box, Grid, Typography, Paper, styled, Stack} from '@mui/material'
import DroneCount1 from '@/assets/images/drone-count-1.svg'
import DroneCount2 from '@/assets/images/drone-count-2.svg'
import DroneCount3 from '@/assets/images/drone-count-3.svg'
import DroneCount4 from '@/assets/images/drone-count-4.svg'
import DroneCount5 from '@/assets/images/drone-count-5.svg'
import DroneCount6 from '@/assets/images/drone-count-6.svg'
import DroneCount7 from '@/assets/images/drone-count-7.svg'

const IconBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'backColor' ,
})(({ theme, backColor }) => ({
  width: 40,
  height: 40,
  borderRadius: '50%',
  background: backColor,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: theme.spacing(2),
}))

const Item = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'backColor' ,
})((props) => {
  const { theme, backColor } = props
  return {
	backgroundColor: theme.palette.grey[100],
	padding: theme.spacing(1),
	position: 'relative',
	display: 'flex',
	alignItems: 'center',
	['&::before']: {
	  position: 'absolute',
	  left: 0,
	  top: 0,
	  content: '""',
	  width: '2px',
	  height: '100%',
	  backgroundColor: backColor,
	}
  }
})
const Count1 = (props) => {
	const { data } = props
  return (
	<Grid container flexWrap="wrap" spacing={2} columns={12}>
	  <Grid size={3}>
		<Item elevation={0} backColor="#FFD54F">
		  <IconBox backColor="#FFD54F">
			<Box component="img" src={DroneCount1} sx={{width: 20, height: 20}} />
		  </IconBox>
		  <Box>
			<Typography component="p" variant="body2" noWrap>
			  无人机总量
			</Typography>
			<Stack direction="row" alignItems="baseline">
			  <Typography component="h6" variant="h6">
				{data?.droneTotal}
			  </Typography>
			  <Typography component="p" variant="subtitle2">
				架
			  </Typography>
			</Stack>
		  </Box>
		</Item>
	  </Grid>
	  <Grid size={3}>
		<Item elevation={0} backColor="#26C6DA">
		  <IconBox backColor="#26C6DA">
			<Box component="img" src={DroneCount2} sx={{width: 20, height: 20}}/>
		  </IconBox>
		  <Box>
			<Typography component="p" variant="body2" noWrap>
			  在线无人机数量
			</Typography>
			<Stack direction="row" alignItems="baseline">
			  <Typography component="h6" variant="h6">
				{data?.droneOnline}
			  </Typography>
			  <Typography component="p" variant="subtitle2">
				架
			  </Typography>
			</Stack>
		  </Box>
		</Item>
	  </Grid>
	  <Grid size={3}>
		<Item elevation={0} backColor="#81C784">
		  <IconBox backColor="#81C784">
			<Box component="img" src={DroneCount3} sx={{width: 20, height: 20}}/>
		  </IconBox>
		  <Box>
			<Typography component="p" variant="body2" noWrap>
			  机巢数量
			</Typography>
			<Stack direction="row" alignItems="baseline">
			  <Typography component="h6" variant="h6">
				{data?.nestTotal}
			  </Typography>
			  <Typography component="p" variant="subtitle2">
				座
			  </Typography>
			</Stack>
		  </Box>
		</Item>
	  </Grid>
	  <Grid size={3}>
		<Item elevation={0} backColor="#00B0FF">
		  <IconBox backColor="#00B0FF">
			<Box component="img" src={DroneCount4} sx={{width: 20, height: 20}}/>
		  </IconBox>
		  <Box>
			<Typography component="p" variant="body2" noWrap>
			  在线机巢数量
			</Typography>
			<Stack direction="row" alignItems="baseline">
			  <Typography component="h6" variant="h6">
				{data?.nestOnline}
			  </Typography>
			  <Typography component="p" variant="subtitle2">
				座
			  </Typography>
			</Stack>
		  </Box>
		</Item>
	  </Grid>
	  <Grid size={3}>
		<Item elevation={0} backColor="#FF80AB">
		  <IconBox backColor="#FF80AB">
			<Box component="img" src={DroneCount5} sx={{width: 20, height: 20}}/>
		  </IconBox>
		  <Box>
			<Typography component="p" variant="body2" noWrap>
			  飞行总架次
			</Typography>
			<Stack direction="row" alignItems="baseline">
			  <Typography component="h6" variant="h6">
				{data?.flightTotal}
			  </Typography>
			  <Typography component="p" variant="subtitle2">
				次
			  </Typography>
			</Stack>
		  </Box>
		</Item>
	  </Grid>
	  <Grid size={3}>
		<Item elevation={0} backColor="#00B0FF">
		  <IconBox backColor="#00B0FF">
			<Box component="img" src={DroneCount6} sx={{width: 20, height: 20}}/>
		  </IconBox>
		  <Box>
			<Typography component="p" variant="body2" noWrap>
			  航线总数量
			</Typography>
			<Stack direction="row" alignItems="baseline">
			  <Typography component="h6" variant="h6">
				{data?.routeTotal}
			  </Typography>
			  <Typography component="p" variant="subtitle2">
				条
			  </Typography>
			</Stack>
		  </Box>
		</Item>
	  </Grid>
	  <Grid size={3}>
		<Item elevation={0} backColor="#64B5F6">
		  <IconBox backColor="#64B5F6">
			<Box component="img" src={DroneCount1} sx={{width: 20, height: 20}}/>
		  </IconBox>
		  <Box>
			<Typography component="p" variant="body2" noWrap>
			  飞手总人数
			</Typography>
			<Stack direction="row" alignItems="baseline">
			  <Typography component="h6" variant="h6">
				{data?.operatorTotal}
			  </Typography>
			  <Typography component="p" variant="subtitle2">
				人
			  </Typography>
			</Stack>
		  </Box>
		</Item>
	  </Grid>
	  <Grid size={3}>
		<Item elevation={0} backColor="#81C784">
		  <IconBox backColor="#81C784">
			<Box component="img" src={DroneCount7} sx={{width: 20, height: 20}}/>
		  </IconBox>
		  <Box>
			<Typography component="p" variant="body2" noWrap>
			  在线飞手人数
			</Typography>
			<Stack direction="row" alignItems="baseline">
			  <Typography component="h6" variant="h6">
				{data?.operatorOnline}
			  </Typography>
			  <Typography component="p" variant="subtitle2">
				人
			  </Typography>
			</Stack>
		  </Box>
		</Item>
	  </Grid>
	</Grid>
  )
}
export default Count1