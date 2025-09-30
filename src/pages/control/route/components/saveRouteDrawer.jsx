import React, {Fragment, useEffect, useMemo, useState} from "react";
import {Controller, useForm} from "react-hook-form";
import {
  Box, AppBar, Button, Toolbar, Divider, FormControl, MenuItem, Select, InputAdornment,
  FormHelperText, InputLabel, OutlinedInput, styled, Switch, FormControlLabel,
} from "@mui/material";
import CustomDrawer from "@/components/customDrawer";
import MapGL3D from '@/components/mapGL3D'
import {availableArea, postLogistics, postLogisticsSetting} from '@/services'
import {message} from "@/utils";

const initialState = {
  status: '1',
  route_name: '',
  remark: '',
  expect_complete_time: '1',
  points: [],
  area: ''
}

const InputHelp = styled(FormHelperText)({
  height: '20px'
})
const SaveRouteDrawer = props => {
  const { open, onClose, type, data } = props;
  const isAdd = () =>  type === 'add';

  const getTitle = () => {
    switch (type) {
      case 'update':
        return '修改路线'
      case 'read':
        return '查看路线'
      default:
      case 'add':
        return '添加路线'
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    control,
  } = useForm({
    defaultValues: initialState,
    mode: 'onChange',
  });

  useEffect(() => {
    if (open && data) {
      const params = {
        route_name: data.route_name,
        points: data.points,
        routeId: data.id,
        remark: data.remark,
        status: data.status,
        expect_complete_time: data.expect_complete_time,
        area: data.area,
      }
      reset({ ...params })
    }
  }, [data, open])

  const status = watch('status')
  const points = watch('points')
  const area = watch('area')

  /// 区域接口
  const [areaOptions, setAreaOptions] = useState([]);
  const fetchRegion = () => {
    const params = {
      page: 1,
      pageSize: 100,
    }
    availableArea(params).then(res => {
      if (res.code === 0) {
        setAreaOptions(res.data.data)
      }
    })
  }

  useEffect(() => {
    if (open) {
      fetchRegion()
    }
  }, [open])

  //  更新路线数据
  const savePosition = (data) => {
    setValue('points', data)
  }

  const currentArea = useMemo(() => {
    const find = areaOptions.find(item => area === item.id)
    const obj = find || areaOptions?.[0]
    if (obj) {
      return {
        id: obj.id,
        center: {
          lng: obj?.center_lng,
          lat: obj?.center_lat
        },
        radius: obj?.radius,
      }
    }
    return null;
  }, [area, areaOptions])

  useEffect(() => {
    if (currentArea && type === 'add') {
      setValue('area', currentArea.id)
    }
  }, [currentArea])

  //  修改状态
  const changeStatus = (event) => {
    const value = event.target.checked
    setValue('status', value ? '1' : '0')
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
    postLogistics(data).then((res) => {
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

  //  执行修改  postLogisticsSetting
  const onUpdate = (params) => {
    if (data.current_is_used === '1') {
      message.warning('当前路线正在使用，无法修改')
    }
    if (loading) return false;
    setLoading(true)
    postLogisticsSetting(params).then((res) => {
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
    if (isAdd()) {
      onAdd(data)
    } else {
      onUpdate(data)
    }
  }

  const renderActionContent = () => {
    return (
        <Fragment>
          <FormControl fullWidth error={!!errors.route_name} margin="normal">
            <InputLabel htmlFor="route_name">路线名称</InputLabel>
            <OutlinedInput
                label="路线名称"
                id="route_name"
                aria-describedby="route_name-helper-text"
                {...register("route_name", {
                  required: '请输入路线名称',
                })}
                disabled={type === 'read'}
            />
            <InputHelp id="route_name-helper-text">
              {errors.route_name?.message}
            </InputHelp>
          </FormControl>
          <FormControl margin="normal">
            <FormControlLabel
                control={<Switch
                    checked={status === '1'}
                    color="success"
                    onChange={changeStatus}
                    disabled={type === 'read'}
                />}
                label="路线状态"
                labelPlacement="start"
            />
          </FormControl>
          <FormControl fullWidth error={!!errors.expect_complete_time} margin="normal">
            <InputLabel htmlFor="expect_complete_time">预计巡航时间</InputLabel>
            <OutlinedInput
                label="预计巡航时间"
                id="expect_complete_time"
                aria-describedby="expect_complete_time-helper-text"
                {...register("expect_complete_time", {
                  required: '请输入预计巡航时间',
                })}
                disabled={type === 'read'}
                endAdornment={<InputAdornment position="end">小时</InputAdornment>}
            />
            <InputHelp id="expect_complete_time-helper-text">
              {errors.expect_complete_time?.message}
            </InputHelp>
          </FormControl>
          <FormControl fullWidth error={!!errors.remark} margin="normal">
            <InputLabel htmlFor="remark">路线描述</InputLabel>
            <OutlinedInput
                label="路线描述"
                id="remark"
                aria-describedby="remark-helper-text"
                {...register("remark", {
                  required: '请输入路线描述',
                })}
                disabled={type === 'read'}
            />
            <InputHelp id="remark-helper-text">
              {errors.remark?.message}
            </InputHelp>
          </FormControl>

          <Controller
              name="area"
              control={control}
              render={({ field, fieldState }) => (
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="area-label">区域范围</InputLabel>
                    <Select
                        labelId="area-label"
                        id="area"
                        label="区域范围"
                        disabled={type !== 'add'}
                        value={field.value}
                        onChange={(event) => field.onChange(event)}>
                      {
                        areaOptions.map((item) => (
                            <MenuItem key={item.id} value={item.id}>
                              { item.zone_name }
                            </MenuItem>
                        ))
                      }
                    </Select>
                  </FormControl>
              )}
          />
        </Fragment>
    )
  }
  //  内容
  const renderContent = () => {
    return (
        <Box component="form" sx={{ flex: 1 }}>
          { renderActionContent() }
          <Box sx={{height: type !== 'read' ? '500px' : 'calc(100vh - 128px)'}}>
            {
              !!currentArea
                ? <MapGL3D
                      center={currentArea.center}
                      radius={currentArea.radius}
                      zoom={ 14 }
                      tilt={60}
                      heading={45}
                      disabled={type === 'read'}
                      data={points || []}
                      savePosition={savePosition}
                      mode="route"
                  />
                  : null
            }
          </Box>
        </Box>
    )
  }

  //  底部按钮
  const renderActions = () => {
    return (
        type !== 'read'
        ? <AppBar
                elevation={0}
                component="nav"
                sx={{ position: 'sticky', width: '100%', bottom: '0', left: '0'}}>
              <Divider />
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
            : null
    )
  }

  return (
      <CustomDrawer
          open={open}
          title={getTitle()}
          w={100}
          onClose={() => handleClose(false)}
          anchor="top"
          actions={renderActions()}
          children={renderContent()}
      />
  )
}
export default SaveRouteDrawer