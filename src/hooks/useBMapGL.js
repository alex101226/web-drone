import { useState } from 'react';

//  创建地图
export const useBMapGL = () => {

  const [isBMapLoaded, setIsBMapLoaded] = useState(false);
  const loadBMapGL = () => {
    return new Promise((resolve, reject) => {
      if (isBMapLoaded) {
        return false
      }
      try {
        const script = document.createElement('script')
        script.src = `https://api.map.baidu.com/api?v=1.0&type=webgl&ak=${globalThis.CONSTANTS.MAP_AK}&callback=initialize`
        document.body.appendChild(script)
        window.initialize = function () {
          setIsBMapLoaded(true)
          setTimeout(() => {
            resolve(BMapGL)
          }, 1000)
        }
      } catch(e) {
        setIsBMapLoaded(false)
        console.error('看戏报错', e)
      }
    })
  }
  return { loadBMapGL }
}