import 'weather-icons/css/weather-icons.css';

export const weatherIconFilter = () => {
  // 中文天气 → Weather Icons 类名映射表
  const weatherMap = {
    '晴': 'wi-day-sunny',
    '多云': 'wi-day-cloudy',
    '阴': 'wi-cloudy',
    '阵雨': 'wi-day-rain',
    '雷阵雨': 'wi-thunderstorm',
    '雷阵雨伴有冰雹': 'wi-hail',
    '雨夹雪': 'wi-sleet',
    '小雨': 'wi-sprinkle',
    '中雨': 'wi-rain',
    '大雨': 'wi-rain-wind',
    '暴雨': 'wi-showers',
    '大暴雨': 'wi-storm-showers',
    '特大暴雨': 'wi-tornado',
    '阵雪': 'wi-day-snow',
    '小雪': 'wi-snow',
    '中雪': 'wi-sleet',
    '大雪': 'wi-snow-wind',
    '暴雪': 'wi-snowflake-cold',
    '雾': 'wi-fog',
    '浮尘': 'wi-dust',
    '扬沙': 'wi-sandstorm',
    '强沙尘暴': 'wi-dust',
    '霾': 'wi-smog',
    '浓雾': 'wi-fog',
    '特强浓雾': 'wi-fog',
    '冻雨': 'wi-rain-mix',
    '沙尘暴': 'wi-sandstorm',
    '龙卷风': 'wi-tornado',
    '轻雾': 'wi-fog',
    '强浓雾': 'wi-fog',
    '雪': 'wi-snow',
    '雨': 'wi-rain',
  };

  const WeatherIcon = ({ type, size = 24, color = 'white' }) => {
    const className = weatherMap[type] || 'wi-na';
    return <i className={`wi ${className}`} style={{ fontSize: size, color }} />;
  };

  const renderWeatherIcon = (text, size, color) => {
    if (!text) {
      return ''
    }
    return <WeatherIcon type={text} size={size} color={color} />
  }

  return { renderWeatherIcon }
}