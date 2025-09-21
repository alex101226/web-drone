import {useState, useEffect} from 'react';
import {Box, Autocomplete, Stack, TextField, Typography, Grid} from '@mui/material'
import { renderCellExpand } from '@/components/CustomCellExpand'
import TodayInfo from './components/todayInfo'
import Hour24Info from './components/hour24Info'
import WeekInfo from './components/weekInfo'
import { getWeather }from '@/services'
import {weatherIconFilter} from "@/filters";
import {coverDateString} from "@/utils/index.js";


const PAGE_SIZE = 5
const weatherOptions = [
  {
    value: '410100',
    label: '郑州',
    lng: '113.6319',
    lat: '34.7529'
  },
  {
    value: '410102',
    label: '郑州/中原',
    lng: '113.611576',
    lat: '34.748286'
  },
  {
    value: '410103',
    label: '郑州/二七区',
    lng: '113.645422',
    lat: '34.730936'
  },
  {
    value: '410104',
    label: '郑州/管城',
    lng: '113.685313',
    lat: '34.746453'
  },
  {
    value: '410105',
    label: '郑州/金水',
    lng: '113.686037',
    lat: '34.775838'
  },
  {
    value: '410106',
    label: '郑州/上街',
    lng: '113.298282',
    lat: '34.808689'
  },
  {
    value: '410108',
    label: '郑州/惠济',
    lng: '113.61836',
    lat: '34.828591'
  },
  {
    value: '410122',
    label: '郑州/中牟',
    lng: '114.022521',
    lat: '34.721976'
  },
  {
    value: '410181',
    label: '郑州/巩义',
    lng: '112.98283',
    lat: '34.75218'
  },
  {
    value: '410182',
    label: '郑州/荥阳',
    lng: '113.391523',
    lat: '34.789077'
  },
  {
    value: '410183',
    label: '郑州/新密',
    lng: '113.380616',
    lat: '34.537846'
  },
  {
    value: '410184',
    label: '郑州/新郑',
    lng: '113.73967',
    lat: '34.394219'
  },
  {
    value: '410185',
    label: '郑州/登封',
    lng: '113.037768',
    lat: '34.459939'
  }
]
const ProjectFireDevice = () => {
  const getColumn = [
    { headerName: '设备ID', field: 'id', width: 150, renderCell: renderCellExpand },
    { headerName: '设备名称', field: 'name', minWidth: 150, flex: 1, renderCell: renderCellExpand },
    {headerName: '设备型号', field: 'model', minWidth: 150, flex: 1, renderCell: renderCellExpand },
    { headerName: '序列号', field: 'serialNumber', minWidth: 150, flex: 1, renderCell: renderCellExpand },
    {headerName: '安装位置', field: 'location', minWidth: 150, flex: 1, renderCell: renderCellExpand},
    { headerName: '所属部门', field: 'department', minWidth: 150, flex: 1, renderCell: renderCellExpand },
    { headerName: '负责人', field: 'manager', minWidth: 150, flex: 1, renderCell: renderCellExpand },
  ]

  //  今日天气
  const [todayData, setTodayData] = useState({})
  //  forecast_hours
  const [hourList, setHourList] = useState([])
  const [weekList, setWeekList] = useState([])

  const [searchParams, setSearchParams] = useState({
    page: 1,
    city: '410100'
  })

  const { renderWeatherIcon } = weatherIconFilter()
  const fetchWeather = () => {
    const params = {
      ...searchParams,
      pageSize: PAGE_SIZE
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

  useEffect(() => {
    fetchWeather()
  }, [searchParams])

  //  状态搜索
  const handleSearch = (event, row) => {
    setSearchParams({ ...searchParams, city: row.value})
  }

  //  重置
  const resetSearch = () => {
    setSearchParams({ ...searchParams, city: '410100' })
  }

  return (
      <Box>
        <Stack spacing={2} direction="row" alignItems="center" sx={{my: 2}}>
          <Typography component="p" variant="p">选择调度状态：</Typography>
          <Autocomplete
              freeSolo
              disableClearable
              sx={{ width: 300 }}
              options={weatherOptions}
              getOptionKey={(option) => option.value}
              getOptionLabel={(option) => option.label || ''}
              isOptionEqualToValue={(option, value) => option.value === value.value}
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
        <Box sx={{ height: 'calc(100vh - 150px)' }}>
          {/*<CustomTable*/}
          {/*    column={getColumn}*/}
          {/*    tableData={tableData}*/}
          {/*    rowKeyProp="id"*/}
          {/*    hideFooter*/}
          {/*/>*/}
        </Box>
      </Box>
  )
}
export default ProjectFireDevice