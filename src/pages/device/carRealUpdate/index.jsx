import {useEffect} from 'react';
import MapGL3D from '@/components/mapGL3D'

const CarRealUpdate = () => {

  return (
      <div style={{ height: "600px" }}>
        <MapGL3D
            center={{ lng: 116.404, lat: 39.915 }}
            zoom={16}
            tilt={60}
            heading={45}
        />
      </div>
  )
}
export default CarRealUpdate