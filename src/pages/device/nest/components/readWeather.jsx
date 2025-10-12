import {useEffect, useState} from "react";
import { useNavigate } from "react-router";
import {Box, Button, Typography, styled, Stack, Grid} from "@mui/material";
import CustomDialog from "@/components/CustomDialog";
import {getWeather} from "@/services";
import {coverDateString} from "@/utils";
import {renderEmptyFilter, weatherIconFilter} from "@/filters";

const LeftText = styled(Typography)({
  fontSize: 16,
  color: '#333',
  lineHeight: '30px',
})
const RightText = styled(Typography)({
  fontSize: 16,
  color: 'rgba(0, 0, 0, 0.6)',
  lineHeight: '30px',
})

const ReadWeather = (props) => {
  const { open, onClose, data } = props;

  const navigate = useNavigate();
  //  今日天气
  const [todayData, setTodayData] = useState({})
  const { renderWeatherIcon } = weatherIconFilter()
  const fetchWeather = (location) => {
    const params = {
      city: location,
      type: 'nest'
    }
    getWeather(params).then((res) => {
      if (res.code === 0) {
        setTodayData({
          city_name: res.data.city_name,
          temperature: res.data.temperature,
          wind: res.data.wind_dir,
          wind_class: res.data.wind_class,
          humidity: res.data.humidity,
          icon: renderWeatherIcon(res.data.weather_text, 80, 'var(--custom-input-border-color)'),
          weather_text: res.data.weather_text,
          uptime: coverDateString(res.data.uptime, '12'),
          wind_angle: res.data.wind_angle,
          pressure: res.data.pressure,
          vis: res.data.vis,
        })
      }
    })
  }

  useEffect(() => {
    if (open) {
      console.log('data', data)
      const location = `${data.longitude},${data.latitude}`
      fetchWeather(location)
    }
  }, [open]);

  const handleClose = () => {
    onClose()
  }

  const handleRoute = () => {
    handleClose()
    navigate('/warn/weather')
  }
  //  底部
  const renderAction = () => {
    return <Stack direction="row" spacing={2}>
      <Button variant="outlined" onClick={handleClose}>
        关闭
      </Button>
      <Button variant="contained" onClick={handleRoute}>
        查看更多
      </Button>
    </Stack>
  }

  const renderContent = () => {
    return (
        <Grid container spacing={2}>
          <Grid size={6}>
            <Stack direction="row">
              <LeftText>天气：</LeftText>
              <RightText>{renderEmptyFilter({value: todayData.weather_text}, false)}</RightText>
            </Stack>
            <Stack direction="row">
              <LeftText>温度：</LeftText>
              <RightText>{renderEmptyFilter({value: todayData.temperature}, false)}℃</RightText>
            </Stack>
            <Stack direction="row">
              <LeftText>湿度：</LeftText>
              <RightText>{renderEmptyFilter({value: todayData.humidity}, false)}%</RightText>
            </Stack>
            <Stack direction="row">
              <LeftText>风向：</LeftText>
              <RightText>{renderEmptyFilter({value: todayData.wind}, false)}</RightText>
            </Stack>
            <Stack direction="row">
              <LeftText>风向角度：</LeftText>
              <RightText>{renderEmptyFilter({value: todayData.wind_angle}, false)}°</RightText>
            </Stack>

          </Grid>
          <Grid size={6}>
            {todayData.icon}
            <Stack direction="row">
              <LeftText>气压：</LeftText>
              <RightText>{renderEmptyFilter({value: todayData.pressure}, false)}</RightText>
            </Stack>
            <Stack direction="row">
              <LeftText>能见度：</LeftText>
              <RightText>{renderEmptyFilter({value: todayData.vis}, false)}</RightText>
            </Stack>
          </Grid>
        </Grid>
    )
  }
  return (
      <CustomDialog
          open={open}
          maxWidth="xs"
          title={`${data?.nest_name} 实时天气`}
          content={renderContent()}
          actions={renderAction()}
      />
  )
}
export default ReadWeather