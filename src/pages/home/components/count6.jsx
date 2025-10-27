import {Box} from '@mui/material'
import MapGL3D from "@/components/mapGL3D/index.jsx";
import React from "react";

const Count6 = (props) => {
  const {list} = props;
  return (
	<Box sx={{height: '500px'}}>
	  {
		list.length > 0
		? <MapGL3D
			center={{ lng: '113.631900', lat: '34.752900'}}
			zoom={ 10 }
			tilt={60}
			heading={45}
			mode="drone"
			disabled
			data={list}
		  />
		  : null
	  }
	</Box>
  )
}
export default Count6