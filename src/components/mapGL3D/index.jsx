import React, {useEffect, useRef} from 'react';
import { Box } from "@mui/material";
import { useBMapGL } from '@/hooks/useBMapGL'
import {message} from "@/utils/index.js";

const normalizePoint = (p) => {
  return {
	id: p.id || `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
	lng: p.lng ?? p.longitude ?? p.lon,
	lat: p.lat ?? p.latitude,
	name: p.name ?? p.title ?? '',
	address: p.address ?? ''
  };
};

// 路线标号图标
const createNumberIcon = (bMap, number) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">
      <circle cx="16" cy="16" r="14" fill="red" stroke="white" stroke-width="2" />
      <text x="16" y="21" text-anchor="middle" font-size="14" fill="white" font-weight="bold">${number}</text>
    </svg>
  `;
  return new bMap.Icon(
	"data:image/svg+xml;base64," + btoa(svg),
	new bMap.Size(32, 32),
	{
	  anchor: new bMap.Size(16, 32),
	}
  );
};

// 自定义 SVG HTML 字符串（注意 style 写法）
const svgIcon = `
    <div style="width:24px;height:24px;border-radius:50%;background:#FDD835;display:flex;align-items:center;justify-content:center;">
      <svg viewBox="0 0 1024 1024" width="16" height="16">
        <path d="M836.7 582.2c-43.3 13.1-483.6 140.5-483.6 140.5S231.2 763.5 141 653.5l100.1-41.6c17.4 5.9 33.6 5.4 55.1-1.5L410 582.2 239.3 329.4c0 0-34.6-54.9 85.3-28.1 0 0 216.9 166.1 256 196.6 0 0 20 11.4 56.9 0l170.7-56.2c0 0 115.6-35.3 142.2 28.1C978.4 536.3 879.9 569.1 836.7 582.2zM121.8 633.2c-44.6-49.8-53.1-79.1-53.1-79.1s9.2-60.9 85.3 0c22.2 17.8 45.8 30 60.8 40L121.8 633.2z"
          fill="#d81e06"></path>
      </svg>
    </div>
  `;

// ✈️ 无人机图标
const createDroneIcon = (bMap) => {
  const svg = `
  <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="32" height="32"><path d="M512 0a440 440 0 0 0-317.44 744.64C274.56 828.16 512 1024 512 1024s236.8-195.52 316.8-278.4A440 440 0 0 0 512 0z" fill="#FF0000"></path><path d="M369.28 384H384a172.8 172.8 0 0 0-42.88-67.2 20.48 20.48 0 0 1 0-32l14.4-10.24a19.52 19.52 0 0 1 28.48 0 168.32 168.32 0 0 0 64 42.24 29.12 29.12 0 0 0 2.24-14.08A81.6 81.6 0 1 0 369.28 384zM654.72 221.12a81.6 81.6 0 0 0-81.6 81.28A43.52 43.52 0 0 0 576 320a200.64 200.64 0 0 0 67.2-44.8 19.52 19.52 0 0 1 28.48 0l12.16 12.16a19.52 19.52 0 0 1 0 28.48A170.56 170.56 0 0 0 640 382.08a38.4 38.4 0 0 0 14.4 2.24 81.28 81.28 0 1 0 0-162.88zM384 620.48a24.64 24.64 0 0 1-28.48 0l-14.72-12.48a22.08 22.08 0 0 1 0-32A179.2 179.2 0 0 0 384 508.48a32 32 0 0 0-14.4-2.24 81.28 81.28 0 1 0 81.6 81.28 38.4 38.4 0 0 0-2.24-14.08A177.28 177.28 0 0 0 384 620.48z" fill="#FFFFFF"></path><path d="M669.12 589.76a205.12 205.12 0 0 1 0-288L656.96 288a201.28 201.28 0 0 1-288 2.24l-14.4 12.16a204.8 204.8 0 0 1 0 288l14.4 10.24a205.44 205.44 0 0 1 288 0zM512 488a42.56 42.56 0 1 1 42.88-42.56A41.92 41.92 0 0 1 512 488z" fill="#FFFFFF"></path><path d="M656.64 504c-4.16 0-10.24 2.24-14.4 2.24A165.76 165.76 0 0 0 685.44 576a19.52 19.52 0 0 1 0 28.48l-12.16 12.16a19.52 19.52 0 0 1-28.48 0A179.2 179.2 0 0 0 576 573.76a32 32 0 0 0-2.24 14.08 81.6 81.6 0 0 0 163.2 0 84.8 84.8 0 0 0-80.32-83.84z" fill="#FFFFFF"></path><path d="M512 0a440 440 0 0 0-317.44 744.64C274.56 828.16 512 1024 512 1024s236.8-195.52 316.8-278.4A440 440 0 0 0 512 0z m293.76 723.2c-64 66.56-234.88 209.92-293.76 259.2-59.2-49.28-230.08-192-294.4-259.84a408 408 0 1 1 588.16 0z" fill="#FFFFFF"></path></svg>
  `;
  return new bMap.Icon(
	"data:image/svg+xml;base64," + btoa(svg),
	new bMap.Size(24, 24), {
	  imageSize: new bMap.Size(24, 24),
	  anchor: new bMap.Size(24, 24),
	}
  );
};

export default function MapGL3D(props) {
  const {
	center = {lng: 116.404, lat: 39.915},
	zoom = 15,
	tilt = 73,
	heading = 64.5,
	style = {width: '100%', height: '100%'},
	data,
	savePosition,
	mode = 'nest',
	radius,
	disabled = false,
  } = props;

  const containerRef = useRef(null);
  const bMapRef = useRef(null);
  const mapRef = useRef(null);
  const centerMarkerRef = useRef(null);
  const circleMarkerRef = useRef(null);
  const geocoderRef = useRef(null);
  const markersRef = useRef(new Map());
  const routePointsRef = useRef([]);
  const polylineRef = useRef(null);
  const radiusRef = useRef(radius);
  const centerRef = useRef(center);

  const setMarker = (c) => {
	const setMap = () => mapRef.current
	if (!setMap()) return;
	const bMap = bMapRef.current;
	const {Point, Marker} = bMap;

	const {lng, lat} = c;
	centerRef.current = c;
	const point = new Point(lng, lat);

	if (!centerMarkerRef.current) {
	  centerMarkerRef.current = new Marker(point);
	  setMap().addOverlay(centerMarkerRef.current, zoom);
	} else {
	  centerMarkerRef.current.setPosition(point);
	}
	setMap().centerAndZoom(point, zoom);
  };

  const setCircle = (c) => {
	const setMap = () => mapRef.current
	if (!setMap()) return;
	const bMap = bMapRef.current;
	const {Point, Circle} = bMap;

	radiusRef.current = radius;
	const {lng, lat} = c;
	const point = new Point(lng, lat);

	if (circleMarkerRef.current) {
	  setMap().removeOverlay(circleMarkerRef.current);
	  circleMarkerRef.current = null;
	}

	circleMarkerRef.current = new Circle(point, radiusRef.current, {
	  strokeColor: "blue",
	  strokeWeight: 2,
	  strokeOpacity: 0.5,
	  fillColor: "#blue",
	  fillOpacity: 0.1
	});
	setMap().addOverlay(circleMarkerRef.current);
  };

  const showWindowInfo = (bMap, map, data) => {
	const {InfoWindow} = bMap;
	const sContent = `
      <h4 style="margin:0 0 5px 10px;">${data.name}</h4>
      <h5 style="margin:0 0 5px 10px;">地址：${data.address}</h5>`;
	const getGeocoder = new InfoWindow(sContent);
	map.openInfoWindow(getGeocoder, data.point);
  };

  const getGeocoder = (pt) => {
	const setMap = () => mapRef.current
	const geocoder = () => geocoderRef.current
	if (!setMap()) return;

	const bMap = bMapRef.current;
	const {Point} = bMap
	const point = new Point(pt.lng, pt.lat);
	geocoder().getLocation(point, (res) => {
	  if (!res) return;

	  const name = res?.surroundingPois?.[0]?.title ?? '';
	  const address = res?.address ?? '';
	  const params = { ...res, name, address };

	  if (mode === 'route') {
		addPoint(params);
	  } else {
		showWindowInfo(bMap, setMap(), params);
	  }
	});
  };

  const redrawPolyline = (map) => {
	const bMap = bMapRef.current;

	if (polylineRef.current) {
	  try { map.removeOverlay(polylineRef.current); } catch(e) {}
	  polylineRef.current = null;
	}

	const {Point, Polyline} = bMap;
	const pts = routePointsRef.current.map(p => new Point(p.lng, p.lat));
	if (pts.length >= 2) {
	  const pl = new Polyline(pts, {
		strokeColor: "#1976d2",
		strokeWeight: 4,
		strokeOpacity: 0.8
	  });
	  map.addOverlay(pl);
	  polylineRef.current = pl;
	}
  };

  const refreshMarkerIcons = () => {
	const bMap = bMapRef.current;
	routePointsRef.current.forEach((p, idx) => {
	  const marker = markersRef.current.get(p.id);
	  if (marker) {
		const icon = createNumberIcon(bMap, idx + 1);
		marker.setIcon(icon);
	  }
	});
  };

  const createMarkerForPoint = (map, pointObj, index) => {
	const bMap = bMapRef.current;
	const {Point, Marker} = bMap;
	const pt = new Point(pointObj.lng, pointObj.lat);

	const icon = createNumberIcon(bMap, index + 1);
	const marker = new Marker(pt, { icon });

	marker.enableDragging && marker.enableDragging();

	marker.addEventListener('dragend', (ev) => {
	  const pos = ev.point;
	  const idx = routePointsRef.current.findIndex((p) => p.id === pointObj.id);
	  if (idx !== -1) {
		routePointsRef.current[idx].lng = pos.lng;
		routePointsRef.current[idx].lat = pos.lat;
		savePosition(routePointsRef.current.slice());
		redrawPolyline(map);
	  }
	});

	marker.addEventListener('rightclick', () => handleRightClick(map, pointObj.id));

	map.addOverlay(marker);
	markersRef.current.set(pointObj.id, marker);
  };

  // ✈️ 无人机标记
  const createDroneMarker = (map, drone) => {
	const bMap = bMapRef.current;
	const { Point, Marker } = bMap;
	const pt = new Point(drone.lng, drone.lat);

	const icon = createDroneIcon(bMap);
	const marker = new Marker(pt, { icon });
	marker.disableDragging && marker.disableDragging();

	// marker.addEventListener('click', () => {
	//   showWindowInfo(bMap, map, {
	// 	point: pt,
	// 	name: drone.name ?? '',
	// 	address: drone.address ?? ''
	//   });
	// });

	map.addOverlay(marker);
  };

  const addPoint = (data) => {
	const setMap = () => mapRef.current;
	if (!setMap()) return;
	const { point, name, address } = data;
	const normalize = normalizePoint({ lng: point.lng, lat: point.lat, name, address });
	routePointsRef.current.push(normalize);
	createMarkerForPoint(setMap(), normalize, routePointsRef.current.length - 1);
	redrawPolyline(setMap());
	refreshMarkerIcons();
	savePosition(routePointsRef.current.slice());
  };

  const handleClick = (e) => {
	if (disabled) return;
	getDistance(mapRef.current, e.latlng);
  };

  const getDistance = (map, point) => {
	if (mode === 'area') {
	  getGeocoder(point);
	} else {
	  const distance = map.getDistance(centerRef.current, point);
	  if (distance <= radiusRef.current) {
		getGeocoder(point);
	  } else {
		message.warning('定位点已超出区域');
	  }
	}
  };

  const removePoint = (id) => {
	const setMap = () => mapRef.current;
	const marker = markersRef.current.get(id);
	if (marker) {
	  setMap().removeOverlay(marker);
	  markersRef.current.delete(id);
	}
	routePointsRef.current = routePointsRef.current.filter(p => p.id !== id);
	redrawPolyline(setMap());
	refreshMarkerIcons();
	savePosition(routePointsRef.current.slice());
  };

  const handleRightClick = (map, id) => {
	removePoint(id);
  };

  const { loadBMapGL } = useBMapGL();

  useEffect(() => {
	if (!center) return;
	if (!containerRef.current) return;
	let mounted = true;

	load();

	async function load() {
	  try {
		const bMap = await loadBMapGL();
		if (!mounted) return;
		bMapRef.current = bMap;

		const {Map, TileLayer, Geocoder} = bMap;
		const map = new Map(containerRef.current, { enableIconClick: true });
		mapRef.current = map;

		const container = map.getContainer && map.getContainer();
		if (container && container.addEventListener) {
		  container.addEventListener('contextmenu', (e) => e.preventDefault());
		}

		map.enableScrollWheelZoom(true);
		map.setHeading(heading);
		map.setTilt(tilt);

		setMarker(center);
		setCircle(center);

		const tLayer = new TileLayer({ transparentPng: true });
		map.addTileLayer(tLayer);

		map.setDisplayOptions({
		  poi: true,
		  building: true,
		  skyColors: true,
		  overlay: true
		});

		geocoderRef.current = new Geocoder();

		if (mode === 'route') {
		  if (Array.isArray(data) && data.length > 0) {
			routePointsRef.current = data.map(normalizePoint);
			routePointsRef.current.forEach((p, idx) => {
			  createMarkerForPoint(map, p, idx);
			});
			redrawPolyline(map);
		  }
		} else if (mode === 'drone') {
		  if (Array.isArray(data) && data.length > 0) {
			data.map(normalizePoint).forEach(d => {
			  createDroneMarker(map, d);
			});
		  }
		} else {
		  getGeocoder(data);
		}
		// map.addEventListener('click', handleClick);
		if (!disabled) {
		  map.addEventListener('click', handleClick);
		}

	  } catch (err) {
		console.error('initMap err', err);
	  }
	}

	return () => {
	  mounted = false;
	  try {
		const map = mapRef.current;
		if (map && bMapRef.current) {
		  map.clearOverlays();
		  map.removeEventListener('click', handleClick);
		}
	  } catch (e) {}
	};
  }, []);

  useEffect(() => {
	if (centerMarkerRef.current !== center) {
	  setMarker(center);
	  if (radius) {
		setCircle(center);
	  }
	}
  }, [center, radius]);

  return (
	<Box
	  ref={containerRef}
	  sx={{
		width: style.width,
		height: style.height,
		border: '1px solid #ccc'
	  }}
	/>
  );
}
