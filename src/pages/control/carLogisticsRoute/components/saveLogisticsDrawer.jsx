import React, {useState, useEffect} from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  AppBar, Box, Toolbar, FormControl, FormHelperText, InputLabel, InputAdornment,
  Select, MenuItem, OutlinedInput, Button, styled,
} from '@mui/material';
import CustomDrawer from '@/components/customDrawer/index.jsx'
import {coverDateObj, message} from '@/utils/index.js'
import { postLogistics, updateVehicle, getLocations } from '@/services/index.js'

const initialState = {
  route_name: '',
  start_station_id: '',
  end_station_id: '',
  distance_km: '',
  estimated_time: '',
  stations: []
}

const InputHelp = styled(FormHelperText)({
  height: '20px'
})
const SaveLogisticsDrawer = (props) => {
  const { open, onClose, data, type } = props

  const isAdd = () =>  type === 'add';
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: initialState,
    mode: 'onChange',
  });

  useEffect(() => {
    if (open) {
      fetchLocation()
      if (data) {
        reset({
          ...data,
          manufacture_year: coverDateObj(data.manufacture_year.toString(), '5'),
          purchase_date: coverDateObj(data.purchase_date, '1'),
          insurance_expiry: coverDateObj(data.insurance_expiry, '1'),
        })
      }
    }
  }, [open])

  //  关闭窗口
  const handleClose = (flag) => {
    onClose(flag)
    reset()
  }

  //  查询所有的地址
  const [locationOptions, setLocationOptions] = useState([])
  const fetchLocation = (p = 1) => {
    getLocations().then((res) => {
      setLocationOptions(res.code === 0 ? res.data.data : [])
    })
  }


  const [loading, setLoading] = useState(false)
  const onAdd = (data) => {
    if (loading) return;
    setLoading(true)
    postLogistics(data).then(res => {
      if (res.code === 0) {
        message.success('添加成功')
      } else {
        message.error(res.message)
      }
      setLoading(false)
      handleClose(true)
    }).catch(() => {
      message.error('添加失败')
      setLoading(false)
    })
  }

  //  执行修改
  const onEdit = (data) => {
    const params = {
      ...data,
      vehicle_id: data.id,
    }
    if (loading) return;
    setLoading(true)
    // updateVehicle(params).then(res => {
    //   if (res.code === 0) {
    //     message.success('修改成功')
    //   } else {
    //     message.error(res.message)
    //   }
    //   setLoading(false)
    //   handleClose(true)
    // }).catch(() => {
    //   message.error('修改失败')
    //   setLoading(false)
    // })
  }

  const onSubmit = (data) => {
    if (type === 'add') {
      onAdd(data)
    }
    if (type === 'edit') {
      onEdit(data)
    }
  }

  const renderForm = () => {
    return (
        <Box component="form" sx={{ flex: 1 }}>
          <FormControl fullWidth error={!!errors.route_name} margin="normal">
            <InputLabel htmlFor="route_name">路线名称</InputLabel>
            <OutlinedInput
                label="路线名称"
                id="route_name"
                aria-describedby="route_name-helper-text"
                {...register("route_name", {
                  required: '请输入路线名称',
                })}
            />
            <InputHelp id="route_name-helper-text">
              {errors.route_name?.message}
            </InputHelp>
          </FormControl>
          <Controller
              name="start_station_id"
              control={control}
              rules={{ required: '请选择起点' }}
              render={({ field, fieldState }) => (
                  <FormControl fullWidth error={!!fieldState.error} margin="normal">
                    <InputLabel id="start_station_id-label">起点</InputLabel>
                    <Select
                        labelId="start_station_id-label"
                        id="start_station_id"
                        label="起点"
                        {...field}>
                      {
                        locationOptions.map((option, index) => (
                            <MenuItem key={index} value={option.id}>
                              { option.address }
                            </MenuItem>
                        ))
                      }
                    </Select>
                    <InputHelp id="fuel_type-helper-text">
                      {fieldState.error?.message}
                    </InputHelp>
                  </FormControl>
              )}
          />

          <Controller
              name="end_station_id"
              control={control}
              rules={{ required: '请选择终点' }}
              render={({ field, fieldState }) => (
                  <FormControl fullWidth error={!!fieldState.error} margin="normal">
                    <InputLabel id="end_station_id-label">终点</InputLabel>
                    <Select
                        labelId="end_station_id-label"
                        id="end_station_id"
                        label="终点"
                        aria-describedby="end_station_id-helper-text"
                        { ...field }>
                      {
                        locationOptions.map((option, index) => (
                            <MenuItem key={index} value={option.id}>
                              { option.address }
                            </MenuItem>
                        ))
                      }
                    </Select>
                    <InputHelp id="status-helper-text">
                      {fieldState.error?.message}
                    </InputHelp>
                  </FormControl>
              )}
          />

          <Controller
              name="stations"
              control={control}
              rules={{ required: '请选择途径点' }}
              render={({ field, fieldState }) => (
                  <FormControl fullWidth error={!!fieldState.error} margin="normal">
                    <InputLabel htmlFor="stations-label">途径点</InputLabel>
                    <Select
                        multiple
                        labelId="stations-label"
                        id="stations"
                        aria-describedby="stations-helper-text"
                        label="途径点"
                        { ...field }>
                      {
                        locationOptions.map((item, index) => (
                            <MenuItem key={index} value={item.id}>
                              { item.address }
                            </MenuItem>
                        ))
                      }
                    </Select>
                    <InputHelp id="stations-helper-text">
                      {fieldState.error?.message}
                    </InputHelp>
                  </FormControl>
              )}
          />
          <FormControl fullWidth error={!!errors.distance_km} margin="normal">
            <InputLabel htmlFor="distance_km">公里数</InputLabel>
            <OutlinedInput
                {...register("distance_km", {
                  required: '请输入公里数',
                })}
                label="公里数"
                id="distance_km"
                aria-describedby="distance_km-helper-text"
            />
            <InputHelp id="distance_km-helper-text">
              {errors.distance_km?.message}
            </InputHelp>
          </FormControl>
          <FormControl fullWidth error={!!errors.estimated_time} margin="normal">
            <InputLabel htmlFor="estimated_time">预计时长</InputLabel>
            <OutlinedInput
                {...register("estimated_time", {
                  required: '请输入预计时长',
                  // validate: validate,
                })}
                label="预计时长"
                id="estimated_time"
                aria-describedby="estimated_time-helper-text"
                endAdornment={<InputAdornment position="end">小时</InputAdornment>}
            />
            <InputHelp id="estimated_time-helper-text">
              {errors.estimated_time?.message}
            </InputHelp>
          </FormControl>
        </Box>
    )
  }

  return (
      <CustomDrawer
          open={open}
          onClose={handleClose}
          title={isAdd() ? '添加路线' : '修改路线'}
          children={renderForm()}
          actions={<AppBar
              elevation={0}
              component="footer"
              sx={{ position: 'sticky', width: '100%', bottom: '0', left: 0 }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="outlined" onClick={() => handleClose(false)}>
                取消
              </Button>
              <Box sx={{ml: 2}} />
              <Button
                  loading={loading}
                  variant="contained"
                  onClick={handleSubmit(onSubmit)}>
                保存
              </Button>
            </Toolbar>
          </AppBar>
          }/>
  )
}
export default SaveLogisticsDrawer