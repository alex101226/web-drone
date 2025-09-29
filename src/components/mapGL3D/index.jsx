import React, { useEffect, useRef } from 'react';
import { Box } from "@mui/material";
import { useBMapGL } from '@/hooks/useBMapGL'
import {message} from "@/utils/index.js";

/**
 * props:
 *  - center, zoom, tilt, heading, style （保持和你原来一样）
 *  - data: 单点模式时是 { longitude, latitude, ... }，
 *          多点模式时可传入初始数组 [{ lng, lat, name?, address?, id? }, ...]
 *  - savePosition: 回调函数。single 模式回传 geocoder 的 res（和你原来一样）
 *                  multiple 模式回传 pointsArray: [{ id, lng, lat, name, address }]
 *  - multiple: boolean, 默认 false
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
    multiple = false,
    mode = 'nest',
    radius = '500',
    disabled = false,
  } = props

  const mapRef = useRef(null);  //  渲染地图容器

  // 存放一些不需要触发组件重渲染的实例和状态
  const bMapRef = useRef(null);         // BMapGL 命名空间
  const mapInsRef = useRef(null);       // 地图实例
  const geocoderRef = useRef(null);     // 地址解析对象
  const markersRef = useRef(new Map()); // 存放 marker（id -> marker）
  const routePointsRef = useRef([]);    // 路径点数组 [{id, lng, lat, name, address}]
  const polylineRef = useRef(null);     // 折线覆盖物
  // const tileLayerRef = useRef(null);    // 自定义图层
  const centerMarkerRef = useRef(null); //  中心点的标注
  const radiusMarkerRef = useRef(null); //  可选区域

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

  // 绘制或刷新折线
  const redrawPolyline = (bMap, map) => {
    // 移除旧的折线
    if (polylineRef.current) {
      try { map.removeOverlay(polylineRef.current); } catch(e) {}
      polylineRef.current = null;
    }
    const pts = routePointsRef.current.map(p => new bMap.Point(p.lng, p.lat));
    if (pts.length >= 2) {
      const pl = new bMap.Polyline(pts, {
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
  const refreshMarkerIcons = (bMap) => {
    routePointsRef.current.forEach((p, idx) => {
      const marker = markersRef.current.get(p.id);
      if (marker) {
        const icon = createNumberIcon(bMap, idx + 1);
        marker.setIcon(icon);
      }
    });
  };

  // 删除某个点
  const removePoint = (bMap, map, id) => {
    const marker = markersRef.current.get(id);
    if (marker) {
      map.removeOverlay(marker);
      markersRef.current.delete(id);
    }
    routePointsRef.current = routePointsRef.current.filter(p => p.id !== id);
    redrawPolyline(bMap, map);
    refreshMarkerIcons(bMap); // 更新序号
    savePosition(routePointsRef.current.slice());
  };

  /**
   * 为点创建 marker 并绑定事件（右键删除、拖拽更新）
   * 注意：markersRef 存储的是 { marker, label }
   */
  const createMarkerForPoint = (bMap, map, pointObj, index) => {
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
        redrawPolyline(bMap, map);
      }
    });

    //  右键删除标注点
    marker.addEventListener('rightclick', () => {
      removePoint(bMap, map, pointObj.id);
    });

    map.addOverlay(marker);
    markersRef.current.set(pointObj.id, marker);
  };

  // 添加新点（地图点击时调用，multiple 模式）
  const addPoint = (bMap, map, clickedPoint) => {
    const point = new bMap.Point(clickedPoint.lng, clickedPoint.lat);
    geocoderRef.current.getLocation(point, (res) => {
      const name = res && res.surroundingPois && res.surroundingPois[0] ? res.surroundingPois[0].title : '';
      const address = res ? res.address : '';
      const p = normalizePoint({ lng: clickedPoint.lng, lat: clickedPoint.lat, name, address });
      routePointsRef.current.push(p);

      // 创建 marker 并重绘
      createMarkerForPoint(bMap, map, p, routePointsRef.current.length - 1);
      redrawPolyline(bMap, map);
      refreshMarkerIcons(bMap)

      // 通知父组件
      savePosition(routePointsRef.current.slice());
    });
  };

  // 单点模式的信息窗口（保持和你之前的一致）
  const showInfoWindowSingle = ( pt) => {
    if (mode === 'nest') {
      const setMap = () => mapInsRef.current
      if (!setMap()) return;
      const bMap = bMapRef.current;

      const {Point, InfoWindow} = bMap
      const point = new Point(pt.lng, pt.lat);

      geocoderRef.current.getLocation(point, (res) => {
        if (res) {
          const current = res.surroundingPois && res.surroundingPois[0] ? res.surroundingPois[0] : null;
          const sContent = `
          <h4 style="margin:0 0 5px 10px;">${current ? (current.title || '') : ''}</h4>
          <h5 style="margin:0 0 5px 10px;">地址：${res.address || ''}</h5>
        `;
          const infoWindow = new InfoWindow(sContent);
          map.openInfoWindow(infoWindow, pt);
          // savePosition(res); // 和原来保持一致
        }
      });
    }
  };

  //  可选区域半径,只有区域规划才可以
  const setRadius = (point, flag) => {
    const setMap = () => mapInsRef.current
    if (!setMap()) return;
    const bMap = bMapRef.current;
    const { Circle } = bMap
    // 先清除
    if (radiusMarkerRef.current) {
      setMap().removeOverlay(radiusMarkerRef.current)
      radiusMarkerRef.current = null
    }

    radiusMarkerRef.current = new Circle(point, radius, {
      strokeColor: "blue",
      strokeWeight: 2,
      strokeOpacity: 0.5,
      fillColor: "#blue",
      fillOpacity: 0.1
    });
    setMap().addOverlay(radiusMarkerRef.current);
  }

  //  标注
  const addOverlay = (bMap, map, point) => {
    // 复用 marker
    if (!centerMarkerRef.current) {
      // 第一次创建
      centerMarkerRef.current = new bMap.Marker(point);
      map.addOverlay(centerMarkerRef.current);
    } else {
      // 更新位置
      centerMarkerRef.current.setPosition(point);
    }
  }

  //  设置中心标注点
  const setMarker = (c) => {
    const map = mapInsRef.current
    if (!map) return;
    const bMap = bMapRef.current;

    const {Point} = bMap;
    const point = new Point(c.lng, c.lat)
    addOverlay(bMap, map, point);
    map.centerAndZoom(point, zoom);
  }

  //  更新标注点
  useEffect(() => {
    if (mapInsRef.current) {
      setMarker(center)
      setRadius(center)
    }
  }, [center, radius])

  //  初始化多标注点
  const initMultiple = (bMap, map) => {

    // 如果传入了点数组，先渲染出来
    if (data.length > 0) {
      routePointsRef.current = data.map(normalizePoint);
      routePointsRef.current.forEach((p, idx) => {
        createMarkerForPoint(bMap, map, p, idx);
      });
      redrawPolyline(bMap, map);
    }
    // 地图点击添加点  34.72691508, 113.61436508
    map.addEventListener('click', (e) => {
      if (disabled) {
        e.preventDefault();
      }
      const point = e.latlng
      const distance = map.getDistance(center, point);
      if (distance <= radius) {
        addPoint(bMap, map, point);
      } else {
        message.warning('定位点已超出区域')
      }
    });
  }

  //  初始化单个标注点
  const initSingle = (bMap, map) => {
    // 单点模式：有传入数据时直接展示
    if (data) {
      const lng = data.longitude;
      const lat = data.latitude;
      showInfoWindowSingle({lng, lat});
    }
    // 地图点击时展示信息窗口
    map.addEventListener('click', (e) => {
      if (disabled) {
        e.preventDefault();
      }
      const point = e.latlng
      const distance = map.getDistance(center, point);
      const handlePoint = () => {
        setMarker(point);
        if (mode === 'area') {
          setRadius(point);
        }
        savePosition(point);
        showInfoWindowSingle(point);
      };

      if (mode === 'area') {
        handlePoint();
      } else {
        if (distance <= radius) {
          handlePoint();
        } else {
          message.warning('定位点已超出区域')
        }
      }
    });
  }

  const { loadBMapGL } = useBMapGL()
  // 初始化地图
  useEffect(() => {
    if (!mapRef.current) return;

    let mounted = true;
    load();

    async function load() {
      try {
        const bMap = await loadBMapGL();
        if (!mounted) return;
        bMapRef.current = bMap;

        const map = new bMap.Map(mapRef.current, { enableIconClick: true });
        mapInsRef.current = map;

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
        setRadius(center)
        // 自定义图层
        const isTilesPng = true;
        // const ts = 'pl';
        // const udtV = '20190102';
        const tLayer = new bMap.TileLayer({ transparentPng: isTilesPng });
        // tLayer.zIndex = 110;
        // tLayer.getTilesUrl = function (point, level) {
        //   if (!point || level < 0) return null;
        //   const x = point.x, y = point.y;
        //   return `//mapsv0.bdimg.com/tile/?udt=${udtV}&qt=tile&styles=${ts}&x=${x}&y=${y}&z=${level}`;
        // };
        map.addTileLayer(tLayer);
        // tileLayerRef.current = tLayer;

        // 必须开启 overlay 才能显示信息窗口
        // map.setDisplayOptions({
        //   overlay: true,
        //   layer: false,
        //   building: true,
        //   // skyColors: ['rgba(186, 0, 255, 0)', 'rgba(186, 0, 255, 0.2)']
        // });

        // 👇 最关键：打开矢量图层，否则 Marker/Circle/Polyline 不显示
        map.setDisplayOptions({
          poi: true,        // 是否显示POI点
          building: true,   // 是否显示3D建筑
          skyColors: true,  // 天空背景
          overlay: true     // ⚠️ 覆盖物层
        });

        // 地址解析对象
        const geocoder = new bMap.Geocoder();
        geocoderRef.current = geocoder;

        // 初始数据处理
        if (multiple) {
          // 如果传入了点数组，先渲染出来
          initMultiple(bMap, map);
        } else {
          initSingle(bMap, map);
        }
      } catch (err) {
        console.error('initMap err', err);
      }
    }

    return () => {
      mounted = false;
      // 清理覆盖物和监听器
      try {
        const map = mapInsRef.current;
        if (map && bMapRef.current) {
          // 移除所有 marker
          markersRef.current.forEach(mk => {
            try { map.removeOverlay(mk); } catch (e) {}
          });
          markersRef.current.clear();
          // 移除折线
          if (polylineRef.current) {
            try { map.removeOverlay(polylineRef.current); } catch (e) {}
            polylineRef.current = null;
          }
          // 移除图层
          // if (tileLayerRef.current) {
          //   try { map.removeTileLayer(tileLayerRef.current); } catch (e) {}
          //   tileLayerRef.current = null;
          // }
          // 清空覆盖物
          try { map.clearOverlays(); } catch(e) {}
        }
      } catch (e) {
        /* 忽略清理错误 */
      }
    };
  }, []); // 只在组件挂载时执行一次

  return (
      <Box sx={{ width: style.width, height: style.height, position: 'relative' }}>
        <Box ref={mapRef}
             sx={{ width: style.width, height: style.height }}/>
      </Box>
  );
}
