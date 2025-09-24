import { useEffect, useRef } from 'react';
import { useBMapGL } from '@/hooks/useBMapGL'
import { Box } from "@mui/material";

/**
 * props:
 *  - center, zoom, tilt, heading, style （保持和你原来一样）
 *  - data: 单点模式时是 { longitude, latitude, ... }，
 *          多点模式时可传入初始数组 [{ lng, lat, name?, address?, id? }, ...]
 *  - savePosition: 回调函数。single 模式回传 geocoder 的 res（和你原来一样）
 *                  multiple 模式回传 pointsArray: [{ id, lng, lat, name, address }]
 *  - multiple: boolean, 默认 false
 */
export default function MapGL3D(props) {
  const {
    center = { lat: 34.752900, lng: 113.631900 },
    zoom = 15,
    tilt = 73,
    heading = 64.5,
    style = { width: '100%', height: '100%' },
    data,
    savePosition,
    multiple = false
  } = props;

  const mapRef = useRef(null);

  // 存放一些不需要触发组件重渲染的实例和状态
  const bMapRef = useRef(null);         // BMapGL 命名空间
  const mapInsRef = useRef(null);       // 地图实例
  const geocoderRef = useRef(null);     // 地址解析对象
  const pointMarkersRef = useRef(new Map()); // 存放 marker（id -> marker）
  const routePointsRef = useRef([]);    // 路径点数组 [{id, lng, lat, name, address}]
  const polylineRef = useRef(null);     // 折线覆盖物
  const tileLayerRef = useRef(null);    // 自定义图层
  const centerMarkerRef = useRef(null); //  中心点的标注

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
      const marker = pointMarkersRef.current.get(p.id);
      if (marker) {
        const icon = createNumberIcon(bMap, idx + 1);
        marker.setIcon(icon);
      }
    });
  };

  // 删除某个点
  const removePoint = (bMap, map, id) => {
    const marker = pointMarkersRef.current.get(id);
    if (marker) {
      map.removeOverlay(marker);
      pointMarkersRef.current.delete(id);
    }
    routePointsRef.current = routePointsRef.current.filter(p => p.id !== id);
    redrawPolyline(bMap, map);
    refreshMarkerIcons(bMap); // 更新序号
    if (typeof savePosition === "function") {
      savePosition(routePointsRef.current.slice());
    }
  };

  /**
   * 为点创建 marker 并绑定事件（右键删除、拖拽更新）
   * 注意：pointMarkersRef 存储的是 { marker, label }
   */
  const createMarkerForPoint = (bMap, map, pointObj, index) => {
    const pt = new bMap.Point(pointObj.lng, pointObj.lat);
    const icon = createNumberIcon(bMap, index + 1);
    const marker = new bMap.Marker(pt, { icon });

    marker.enableDragging && marker.enableDragging();
    marker.addEventListener('dragend', (ev) => {
      const pos = ev.point;
      const idx = routePointsRef.current.findIndex((p) => p.id === pointObj.id);
      if (idx !== -1) {
        routePointsRef.current[idx].lng = pos.lng;
        routePointsRef.current[idx].lat = pos.lat;
        if (typeof savePosition === "function") {
          savePosition(routePointsRef.current.slice());
        }
        redrawPolyline(bMap, map);
      }
    });

    //  右键删除标注点
    marker.addEventListener('rightclick', () => {
      removePoint(bMap, map, pointObj.id);
    });
    map.addOverlay(marker);
    pointMarkersRef.current.set(pointObj.id, marker);
  };

  // 添加新点（地图点击时调用，multiple 模式）
  const addPoint = (bMap, map, clickedPoint) => {
    geocoderRef.current.getLocation(clickedPoint, (res) => {
      const name = res && res.surroundingPois && res.surroundingPois[0] ? res.surroundingPois[0].title : '';
      const address = res ? res.address : '';
      const p = normalizePoint({ lng: clickedPoint.lng, lat: clickedPoint.lat, name, address });
      routePointsRef.current.push(p);

      // 创建 marker 并重绘
      createMarkerForPoint(bMap, map, p, routePointsRef.current.length - 1);
      redrawPolyline(bMap, map);
      refreshMarkerIcons(bMap)

      // 通知父组件
      if (typeof savePosition === 'function') {
        savePosition(routePointsRef.current.slice());
      }
    });
  };

  // 单点模式的信息窗口（保持和你之前的一致）
  const showInfoWindowSingle = (bMap, map, pt) => {
    geocoderRef.current.getLocation(pt, (res) => {
      if (res) {
        const current = res.surroundingPois && res.surroundingPois[0] ? res.surroundingPois[0] : null;
        const sContent = `
          <h4 style="margin:0 0 5px 10px;">${current ? (current.title || '') : ''}</h4>
          <h5 style="margin:0 0 5px 10px;">地址：${res.address || ''}</h5>
        `;
        const infoWindow = new bMap.InfoWindow(sContent);
        map.openInfoWindow(infoWindow, pt);
        if (typeof savePosition === 'function') {
          savePosition(res); // 和原来保持一致
        }
      }
    });
  };

  //  膝盖覆盖物和中心点
  const setMarker = () => {
    const map = mapInsRef.current
    if (!map) return;

    const bMap = bMapRef.current;

    const point = new bMap.Point(center.lng, center.lat)

    map.centerAndZoom(point, zoom);
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
    // 地图点击添加点
    map.addEventListener('click', (e) => {
      const pt = new bMap.Point(e.latlng.lng, e.latlng.lat);
      addPoint(bMap, map, pt);
    });
  }

  //  初始化单个标注点
  const initSingle = (bMap, map) => {
    // 单点模式：有传入数据时直接展示
    if (data && (data.longitude || data.latitude || data.lng || data.lat)) {
      const lng = data.longitude ?? data.lng;
      const lat = data.latitude ?? data.lat;
      const pt = new bMap.Point(lng, lat);
      showInfoWindowSingle(bMap, map, pt);
    }
    // 地图点击时展示信息窗口
    map.addEventListener('click', (e) => {
      const pt = new bMap.Point(e.latlng.lng, e.latlng.lat);
      showInfoWindowSingle(bMap, map, pt);
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
          container.addEventListener('contextmenu', (e) => {
            e.preventDefault();
          });
        }
        //  开启鼠标滚轮
        map.enableScrollWheelZoom(true);
        map.setHeading(heading);
        map.setTilt(tilt);
        setMarker()

        // 自定义图层
        const isTilesPng = true;
        const ts = 'pl';
        const udtV = '20190102';
        const tLayer = new bMap.TileLayer({ transparentPng: isTilesPng });
        tLayer.zIndex = 110;
        tLayer.getTilesUrl = function (point, level) {
          if (!point || level < 0) return null;
          const x = point.x, y = point.y;
          return `//mapsv0.bdimg.com/tile/?udt=${udtV}&qt=tile&styles=${ts}&x=${x}&y=${y}&z=${level}`;
        };
        map.addTileLayer(tLayer);
        tileLayerRef.current = tLayer;

        // 必须开启 overlay 才能显示信息窗口
        map.setDisplayOptions({
          overlay: true,
          layer: false,
          building: true,
          // skyColors: ['rgba(186, 0, 255, 0)', 'rgba(186, 0, 255, 0.2)']
        });

        // 地址解析对象
        const geocoder = new bMap.Geocoder();
        geocoderRef.current = geocoder;

        // 初始数据处理
        if (multiple) {
          initMultiple(bMap, map)
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
          pointMarkersRef.current.forEach(mk => {
            try { map.removeOverlay(mk); } catch (e) {}
          });
          pointMarkersRef.current.clear();
          // 移除折线
          if (polylineRef.current) {
            try { map.removeOverlay(polylineRef.current); } catch (e) {}
            polylineRef.current = null;
          }
          // 移除图层
          if (tileLayerRef.current) {
            try { map.removeTileLayer(tileLayerRef.current); } catch (e) {}
            tileLayerRef.current = null;
          }
          // 清空覆盖物
          try { map.clearOverlays(); } catch(e) {}
        }
      } catch (e) {
        /* 忽略清理错误 */
      }
    };
  }, []); // 只在组件挂载时执行一次

  //  更新标注点
  useEffect(() => {
    if (mapInsRef.current) {
      setMarker()
    }
  }, [center])

  return <Box
      ref={mapRef}
      sx={{ width: style.width, height: style.height }}
  />;
}
