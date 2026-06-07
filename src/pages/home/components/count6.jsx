import {Box, Stack, Typography} from '@mui/material'
import MapRoundedIcon from '@mui/icons-material/MapRounded';
import LocationSearchingRoundedIcon from '@mui/icons-material/LocationSearchingRounded';
import MapGL3D from "@/components/mapGL3D/index.jsx";
import React from "react";

const Count6 = (props) => {
  const {list} = props;
  return (
	<Box
	  sx={{
		height: '100%',
		minHeight: 590,
		overflow: 'hidden',
		borderRadius: 3,
		background: '#fff',
		border: '1px solid rgba(16, 42, 67, 0.07)',
		boxShadow: '0 16px 44px rgba(24, 55, 84, 0.07)',
	  }}
	>
	  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2.75, py: 2.25 }}>
		<Box>
		  <Typography variant="h6" fontWeight={750} color="#102A43">
			实时空域态势
		  </Typography>
		  <Typography variant="body2" sx={{ mt: 0.25, color: '#829AB1', display: 'block' }}>
			无人机位置与航线动态
		  </Typography>
		</Box>
		<Stack direction="row" spacing={0.75} alignItems="center">
		  <LocationSearchingRoundedIcon sx={{ fontSize: 17, color: '#08A88A' }} />
		  <Typography variant="caption" sx={{ color: '#486581' }}>{list.length} 架在线</Typography>
		</Stack>
	  </Stack>
	  <Box sx={{ height: 500, mx: 1.5, mb: 1.5, overflow: 'hidden', borderRadius: 2 }}>
		{list.length > 0 ? (
		  <MapGL3D
			center={{ lng: '113.631900', lat: '34.752900'}}
			zoom={10}
			tilt={60}
			heading={45}
			mode="drone"
			disabled
			data={list}
		  />
		) : (
		  <Box
			sx={{
			  width: '100%',
			  height: '100%',
			  display: 'flex',
			  flexDirection: 'column',
			  alignItems: 'center',
			  justifyContent: 'center',
			  color: '#7899A9',
			  backgroundColor: '#EAF2F7',
			  backgroundImage: `
				radial-gradient(circle at 72% 34%, rgba(39,94,255,0.10), transparent 22%),
				radial-gradient(circle at 24% 72%, rgba(8,168,138,0.12), transparent 24%),
				linear-gradient(rgba(60,102,130,0.06) 1px, transparent 1px),
				linear-gradient(90deg, rgba(60,102,130,0.06) 1px, transparent 1px)
			  `,
			  backgroundSize: '100% 100%, 100% 100%, 42px 42px, 42px 42px',
			}}
		  >
			<Box sx={{ width: 72, height: 72, display: 'grid', placeItems: 'center', borderRadius: '50%', background: 'rgba(255,255,255,0.82)', boxShadow: '0 14px 32px rgba(40,83,113,0.14)' }}>
			  <MapRoundedIcon sx={{ fontSize: 30, color: '#1F5EFF' }} />
			</Box>
			<Typography fontWeight={650} color="#243B53" sx={{ mt: 1.75 }}>
			  等待飞行目标接入
			</Typography>
			<Typography variant="caption" sx={{ mt: 0.5, color: '#829AB1' }}>
			  无人机上线后将实时呈现于地图
			</Typography>
		  </Box>
		)}
	  </Box>
	</Box>
  )
}
export default Count6
