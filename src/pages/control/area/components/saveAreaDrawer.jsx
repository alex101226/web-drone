import React, {useEffect, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {
  Box, AppBar, Button, Toolbar, Divider, FormControl, InputAdornment,
  FormHelperText, InputLabel, OutlinedInput, styled, Select, MenuItem,
} from "@mui/material";
import CustomDrawer from "@/components/customDrawer";
import MapGL3D from '@/components/mapGL3D'
import {addArea, getRegion} from '@/services'
import {message} from "@/utils";

const initialState = {
  zone_name: '',
  center_lng: 113.631900,
  center_lat: 34.752900,
  radius: '5000',
  area: 1
}

const InputHelp = styled(FormHelperText)({
  height: '20px'
})
const SaveAreaDrawer = props => {
  const { open, onClose, type, data } = props;

  const isAdd = () => type === 'add'
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    control,
    getValues,
  } = useForm({
    defaultValues: initialState,
    mode: 'onChange',
  });

  // const lng = watch('center_lng')
  // const lat = watch('center_lat')
  const radius = watch('radius')

  const area = watch('area')

  /// 区域接口
  const [areaOptions, setAreaOptions] = useState([]);
  const fetchRegion = () => {
    getRegion().then(res => {
      if (res.code === 0) {
        setAreaOptions(res.data)
      }
    })
  }
  useEffect(() => {
    if (open) {
      fetchRegion()
    }
  }, [open])

  //  更新经纬度
  const updateArea = (data) => {
    setValue('center_lng', data.lng)
    setValue('center_lat', data.lat)
  }

  //  修改经纬度
  const savePosition = (data) => {
    updateArea(data)
  }

  useEffect(() => {
    if (areaOptions.length) {
      const find = areaOptions.find(item => item.id === area)
      if (find) {
        updateArea({
          lng: find.lng,
          lat: find.lat,
        })
      }
    }
  }, [area, areaOptions])

  const getCenter = () => {
    return {
      lng: getValues('center_lng'),
      lat: getValues('center_lat')
    }
  }

  //  关闭
  const handleClose = (flag) => {
    reset(initialState)
    onClose(flag);
  }

  const [loading, setLoading] = useState(false)
  //  执行添加
  const onAdd = (data) => {
    if (loading) return false;
    setLoading(true)
    addArea(data).then((res) => {
      if (res.code === 0) {
        message.success(res.message)
        handleClose(true)
      } else {
        message.error(res.message)
      }
      setLoading(false)
    }).catch(() => {
      message.error('添加失败')
      setLoading(false)
    })
  }
  //  提交
  const onSubmit = (data) => {
    onAdd(data)
  }

  //  底部按钮
  const renderActions = () => {
    return (
        <AppBar
            elevation={0}
            component="nav"
            sx={{ position: 'sticky', width: '100%', bottom: '0', left: '0'}}>
          <Divider />
          <Toolbar sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => handleClose(false)}>
              { isAdd() ? '取消' : '关闭' }
            </Button>
            <Box sx={{ml: 2}} />
            {
              isAdd() ?
                  <Button
                      loading={loading}
                      variant="contained"
                      onClick={handleSubmit(onSubmit)}>
                    保存
                  </Button>
                  : null
            }
          </Toolbar>
        </AppBar>
    )
  }

  const handleRadius = (event) => {
    setValue('radius', event.target.value)
  }
  //  内容
  const renderContent = () => {
    return (
        <Box component="form" sx={{ flex: 1 }}>
          <FormControl fullWidth error={!!errors.zone_name} margin="normal">
            <InputLabel htmlFor="route_name">区域名称</InputLabel>
            <OutlinedInput
                label="区域名称"
                id="zone_name"
                disabled={!isAdd()}
                aria-describedby="zone_name-helper-text"
                {...register("zone_name", {
                  required: '请输入路线名称',
                })}
            />
            <InputHelp id="zone_name-helper-text">
              {errors.zone_name?.message}
            </InputHelp>
          </FormControl>
          <FormControl fullWidth error={!!errors.expect_complete_time} margin="normal">
            <InputLabel htmlFor="radius">可选区域半径</InputLabel>
            <OutlinedInput
                label="可选区域半径"
                id="radius"
                disabled={!isAdd()}
                aria-describedby="radius-helper-text"
                {...register("radius", {
                  required: '请输入可选区域半径',
                })}
                endAdornment={<InputAdornment position="end">米</InputAdornment>}
                onBlur={handleRadius}
            />
            <InputHelp id="radius-helper-text">
              {errors.radius?.message}
            </InputHelp>
          </FormControl>
          <Controller
              name="area"
              control={control}
              render={({ field}) => (
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="area-label">市区选择</InputLabel>
                    <Select
                        labelId="area-label"
                        id="area"
                        label="市区选择"
                        value={field.value}
                        onChange={(event) => field.onChange(event.target.value)}>
                      {
                        areaOptions.map((item) => (
                            <MenuItem key={item.id} value={item.id}>
                              { item.name }
                            </MenuItem>
                        ))
                      }
                    </Select>
                  </FormControl>
              )}
          />

          <Box sx={{height: '500px', position: 'relative'}}>
            <MapGL3D
                mode="area"
                center={getCenter()}
                zoom={ 14 }
                tilt={60}
                heading={45}
                disabled={!isAdd()}
                radius={radius}
                savePosition={savePosition}
            />
          </Box>
        </Box>
    )
  }
  return (
      <CustomDrawer
          open={open}
          title={isAdd() ? '添加可选区域' : '查看数据'}
          w={100}
          onClose={() => handleClose(false)}
          anchor="top"
          actions={renderActions()}
          children={renderContent()}
      />
  )
}
export default SaveAreaDrawer