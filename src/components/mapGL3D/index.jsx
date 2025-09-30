import React, {useEffect, useRef} from 'react';
import { Box } from "@mui/material";
import { useBMapGL } from '@/hooks/useBMapGL'
import {message} from "@/utils/index.js";


// 标准化点对象（兼容多种字段名）
const normalizePoint = (p) => {
  return {
    id: p.id || `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    lng: p.lng ?? p.longitude ?? p.lon ?? p.longitude,
    lat: p.lat ?? p.latitude ?? p.lat,
    name: p.name ?? p.title ?? '',
    address: p.address ?? ''
  };
};

// 生成带序号的自定义图标
const createNumberIcon = (bMap, number) => {
  // 一个红色圆形背景 + 白色数字
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
        anchor: new bMap.Size(16, 32), // 锚点在底部中间
      }
  );
};

/**
 * props:
 *  - center, zoom, tilt, heading, style （保持和你原来一样）
 *  - data: 单点模式时是 { longitude, latitude, ... }，
 *          多点模式时可传入初始数组 [{ lng, lat, name?, address?, id? }, ...]
 *  - savePosition: 回调函数。single 模式回传 geocoder 的 res（和你原来一样）
 *                  multiple 模式回传 pointsArray: [{ id, lng, lat, name, address }]
 *  mode: nest | area | route
 *  radius: 可选区域半径
 */
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
    radius = '500',
    disabled = false,
  } = props

  const containerRef = useRef(null);  //  渲染地图容器

  // 存放一些不需要触发组件重渲染的实例和状态
  const bMapRef = useRef(null);         // BMapGL d对象
  const mapRef = useRef(null);       // 地图实例
  const centerMarkerRef = useRef(null); //  中心点的标注
  const circleMarkerRef = useRef(null); //  可选区域
  const geocoderRef = useRef(null);     // 地址解析对象
  const markersRef = useRef(new Map()); // 存放 marker（id -> marker）
  const routePointsRef = useRef([]);    // 路线的数组 [{id, lng, lat, name, address}]
  const polylineRef = useRef(null);     // 折线覆盖物


  const radiusRef = useRef(radius); //  当前区域半径的ref，解决监听事件无法获取到新值的问题
  const centerRef = useRef(center); //  center数据的ref，解决监听事件无法获取到新值的问题

  //  设置标注点
  const setMarker = (c) => {
    const setMap = () => mapRef.current
    if (!setMap()) return;
    const bMap = bMapRef.current;
    const {Point, Marker} = bMap;

    const {lng, lat} = c

    const point = new Point(lng, lat)
    centerRef.current = c
    // 复用 marker
    if (!centerMarkerRef.current) {
      // 第一次创建
      centerMarkerRef.current = new Marker(point);
      setMap().addOverlay(centerMarkerRef.current, zoom);
    } else {
      // 更新位置
      centerMarkerRef.current.setPosition(point);
    }
    setMap().centerAndZoom(point, zoom);
  }

  //  设置区域范围
  const setCircle = (c) => {
    const setMap = () => mapRef.current
    if (!setMap()) return;

    const bMap = bMapRef.current;
    const {Point, Circle} = bMap;
    const {lng, lat} = c
    const point = new Point(lng, lat)

    radiusRef.current = radius

    // 先清除
    if (circleMarkerRef.current) {
      setMap().removeOverlay(circleMarkerRef.current)
      circleMarkerRef.current = null
    }

    circleMarkerRef.current = new Circle(point, radiusRef.current, {
      strokeColor: "blue",
      strokeWeight: 2,
      strokeOpacity: 0.5,
      fillColor: "#blue",
      fillOpacity: 0.1
    });
    setMap().addOverlay(circleMarkerRef.current);
  }

  //  信息窗口
  const showWindowInfo = (bMap, map, data) => {
    const {InfoWindow} = bMap
    const sContent = `
            <h4 style="margin:0 0 5px 10px;">${data.name}</h4>
            <h5 style="margin:0 0 5px 10px;">地址：${data.address}</h5>`;
    const getGeocoder = new InfoWindow(sContent);
    map.openInfoWindow(getGeocoder, data.point);
  }
  
  // 获取解析的地址
  const getGeocoder = (pt) => {
    const setMap = () => mapRef.current
    const geocoder = () => geocoderRef.current
    if (!setMap()) return;
    const bMap = bMapRef.current;
    const {Point} = bMap
    const point = new Point(pt.lng, pt.lat);
    geocoder().getLocation(point, (res) => {
      if (res) {
        const name = res && res.surroundingPois && res.surroundingPois[0] ? res.surroundingPois[0].title : '';
        const address = res ? res.address : '';

        const params = {  ...res, name, address }

        if (mode === 'route') {
          addPoint(params)
        } else {
          showWindowInfo(bMap, setMap(), params)
        }
      }
    });
  };

  //  当center和radius发生变化，地图坐标点和中心位置修改
  useEffect(() => {
    if (centerRef.current !== center) {
      routePointsRef.current.forEach(point => {
        removePoint(point.id)
      })
    }

    // radiusRef.current = radius
    // centerRef.current = center
    setMarker(center)
    setCircle(center)
  }, [center, radius])

  // 绘制或刷新折线
  const redrawPolyline = (map) => {
    const bMap = bMapRef.current;
    // 移除旧的折线
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

  /**
   * 重新给剩余的 marker 生成序号 label
   */
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

  /**
   * 为点创建 marker 并绑定事件（右键删除、拖拽更新）
   * 注意：markersRef 存储的是 { marker, label }
   */
  const createMarkerForPoint = (map, pointObj, index) => {
    if (!map) return;
    const bMap = bMapRef.current;

    const {Point, Marker} = bMap

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

    //  右键删除标注点
    marker.addEventListener('rightclick', () => handleRightClick(map, pointObj.id))

    map.addOverlay(marker);
    markersRef.current.set(pointObj.id, marker);
  };

  //  添加多个标注点
  const addPoint = (data) => {
    const setMap = () => mapRef.current
    if (!setMap()) return;
    const { point, name, address } = data
    const normalize = normalizePoint({ lng: point.lng, lat: point.lat, name, address });
    routePointsRef.current.push(normalize);
    createMarkerForPoint(setMap(), normalize, routePointsRef.current.length - 1);
    redrawPolyline(setMap());
    refreshMarkerIcons()
    savePosition(routePointsRef.current.slice());
  }

  //  标注点验证通过
  const handlePoint = (point) => {
    if (mode !== 'route') {
      savePosition(point)
      setMarker(point);
      if (mode === 'area') {
        setCircle(point);
      }
    }

    getGeocoder(point);
  };

  //  判断标注点是否超出区域
  const getDistance = (map, point) => {
    if (mode === 'area') {
      handlePoint(point);
    } else {
      const distance = map.getDistance(centerRef.current, point);
      if (distance <= radius) {
        handlePoint(point);
      } else {
        message.warning('定位点已超出区域')
      }
    }
  }

  // 多路线，删除路线点
  const removePoint = (id) => {
    const setMap = () => mapRef.current
    const marker = markersRef.current.get(id);
    if (marker) {
      setMap().removeOverlay(marker);
      markersRef.current.delete(id);
    }
    routePointsRef.current = routePointsRef.current.filter(p => p.id !== id);
    redrawPolyline(setMap());
    refreshMarkerIcons(); // 更新序号
    savePosition(routePointsRef.current.slice());
  };

  //  点击事件
  const handleClick = (e) => {
    //  禁用的话，阻止任何事件
    if (disabled) return
    getDistance(mapRef.current, e.latlng)
  }

  //  右键点击
  const handleRightClick = (map, id) => {
    removePoint(map, id)
  }

  const { loadBMapGL } = useBMapGL()
  // 初始化地图
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

        const {Map, TileLayer, Geocoder} = bMap
        const map = new Map(containerRef.current, { enableIconClick: true });
        mapRef.current = map;
        // 禁用浏览器右键菜单，便于右键删除标注
        const container = map.getContainer && map.getContainer();
        if (container && container.addEventListener) {
          container.addEventListener('contextmenu', (e) => e.preventDefault());
        }
        //  开启鼠标滚轮
        map.enableScrollWheelZoom(true);
        map.setHeading(heading);
        map.setTilt(tilt);
        setMarker(center)
        setCircle(center)
        // 自定义图层
        const tLayer = new TileLayer({ transparentPng: true });
        map.addTileLayer(tLayer);
        // 👇 最关键：打开矢量图层，否则 Marker/Circle/Polyline 不显示
        map.setDisplayOptions({
          poi: true,        // 是否显示POI点
          building: true,   // 是否显示3D建筑
          skyColors: true,  // 天空背景
          overlay: true     // ⚠️ 覆盖物层
        });

        // 地址解析对象
        geocoderRef.current = new Geocoder();

        if (mode === 'route') {
          const isArr = Array.isArray(data)
          if (isArr && data.length > 0) {
            routePointsRef.current = data.map(normalizePoint);
            routePointsRef.current.forEach((p, idx) => {
              createMarkerForPoint(map, p, idx);
            });
            redrawPolyline(map);
          }
        } else {
          getGeocoder(data);
        }
        map.addEventListener('click', handleClick)
      } catch (err) {
        console.error('initMap err', err);
      }
    }

    return () => {
      mounted = false;
      // 清理覆盖物和监听器
      try {
        const map = mapRef.current;
        if (map && bMapRef.current) {
          try {
            map.clearOverlays();
            map.removeEventListener('click', handleClick)
          } catch(e) {}
        }
      } catch (e) {
        /* 忽略清理错误 */
      }
    };
  }, []); // 只在组件挂载时执行一次

  return <Box ref={containerRef} sx={{ width: style.width, height: style.height, border: '1px solid #ccc' }} />
}
