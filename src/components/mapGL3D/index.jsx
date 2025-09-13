import { useEffect, useRef } from 'react';
import { useBMapGL } from '@/hooks/useBMapGL'
import {Box} from "@mui/material";

const styleJson = [
  {
    "featureType": "land",
    "elementType": "geometry",
    "stylers": {
      "visibility": "on",
      "color": "#091220ff"
    }
  }, {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": {
      "visibility": "on",
      "color": "#113549ff"
    }
  }
]

export default function MapGL3D(props) {
  const {
    center = { lng: 116.404, lat: 39.915 },
    zoom = 15,
    tilt = 60,
    heading = 45,
    style = { width: "100%", height: 500 }
  } = props;

  //  初始化地图
  const { loadBMapGL } = useBMapGL()

  const initMap = () => {
    loadBMapGL().then(res => {
      var map = new res.Map('container');
      map.centerAndZoom(new res.Point(116.280190, 40.049191), 19);
      map.setMapStyleV2({
        styleId: globalThis.CONSTANTS.MAP_STYLE_ID
      });
      map.enableScrollWheelZoom(true);
      map.setHeading(64.5);
      map.setTilt(73)
    }).catch(err => {
      console.log('err', err)
    })
  }
  useEffect(() => {
    initMap()
  }, [])

  return <Box id="container" sx={{ width: "100%", height: '100%' }} />;
}
