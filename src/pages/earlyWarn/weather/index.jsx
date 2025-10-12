import {useState, useEffect} from 'react';
import {Box, Autocomplete, Stack, TextField, Typography, Grid} from '@mui/material'
import TodayInfo from './components/todayInfo'
import Hour24Info from './components/hour24Info'
import WeekInfo from './components/weekInfo'
import { getWeather, getRegion }from '@/services'
import {weatherIconFilter} from "@/filters";
import {coverDateString} from "@/utils/index.js";

const ProjectFireDevice = () => {

  //  今日天气
  const [todayData, setTodayData] = useState({})
  //  24小时天气
  const [hourList, setHourList] = useState([])
  //  未来一周的天气
  const [weekList, setWeekList] = useState([])
  const [currentRegion, setCurrentRegion] = useState({})

  const [weatherOptions, setWeatherOptions] = useState([])
  const fetchRegion = () => {
    getRegion().then(res => {
      if (res.code === 0) {
        setWeatherOptions(res.data)
        if (res.data.length) {
          const origin = res.data[0]
          setCurrentRegion(origin)
          fetchWeather(origin.district_id)
        }
      }
    })
  }
  useEffect(() => {
    fetchRegion()
  }, [])

  const { renderWeatherIcon } = weatherIconFilter()
  const fetchWeather = (city) => {
    const params = {
      city,
      type: 'weather',
    }
    getWeather(params).then((res) => {
      if (res.code === 0) {
        const hours = res.data.forecast_hours ? JSON.parse(res.data.forecast_hours) : []
        setHourList(hours)

        const sevens = res.data.forecast ? JSON.parse(res.data.forecast) : []
        setWeekList(sevens)
        setTodayData({
          city_name: res.data.city_name,
          temperature: res.data.temperature,
          wind: res.data.wind_dir,
          wind_class: res.data.wind_class,
          humidity: res.data.humidity,
          icon: renderWeatherIcon(res.data.weather_text, 80),
          forecast: sevens,
          weather_text: res.data.weather_text,
          uptime: coverDateString(res.data.uptime, '12'),
          wind_angle: res.data.wind_angle,
          pressure: res.data.pressure,
          vis: res.data.vis,
        })
      }
    })
  }

  //  状态搜索
  const handleSearch = (event, row) => {
    setCurrentRegion(row)
    fetchWeather(row.district_id)
  }

  //  重置
  const resetSearch = () => {
    setCurrentRegion(weatherOptions[0])
  }

  return (
      <Box>
        <Stack spacing={2} direction="row" alignItems="center" sx={{my: 2}}>
          <Typography component="p" variant="p">选择区域：</Typography>
          <Autocomplete
              freeSolo
              disableClearable
              sx={{ width: 300 }}
              options={weatherOptions}
              getOptionKey={(option) => option.district_id}
              getOptionLabel={(option) => option.name || ''}
              isOptionEqualToValue={(option, value) => option.district_id === value.district_id}
              value={currentRegion}
              onChange={handleSearch}
              onInputChange={resetSearch}
              renderInput={(params) => (
                  <TextField
                      {...params}
                      size="small"
                      label=""
                      placeholder="请选择调度状态"
                      slotProps={{
                        input: {
                          ...params.InputProps,
                          type: 'search',
                        },
                      }}
                  />
              )}
          />
        </Stack>
        <Grid container spacing={2}>
          <Grid size={3}>
            <TodayInfo data={ todayData } />
          </Grid>
          <Grid size={9} display="flex" flexDirection="row" gap={2}>
            <WeekInfo list={weekList} />
          </Grid>
        </Grid>

        <Box sx={{ mb: 2 }}/>
        <Hour24Info list={hourList} />
      </Box>
  )
}
export default ProjectFireDevice