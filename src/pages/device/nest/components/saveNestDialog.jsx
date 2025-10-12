import React, {Fragment, useEffect, useState} from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box, FormControl, FormHelperText, InputLabel, Button, Toolbar,
  MenuItem, OutlinedInput, Select, styled, AppBar, Divider,
} from '@mui/material';
import MapGL3D from '@/components/mapGL3D'
import {addNest, updateNest, getDict, availableArea} from '@/services'
import {message} from "@/utils";
import CustomDrawer from "@/components/customDrawer/index.jsx";

const InputHelp = styled(FormHelperText)({
  height: '20px'
})

const initialState = {
  nest_name: '',
  capacity: '',
  status: 1,
  longitude: 0,
  latitude: 0,
  area: ''
}

const SaveNestDialog = (props) => {

  const { open, onClose, record, type } = props;

  const getTitle = () => {
    switch (type) {
      case 'update':
        return '修改机巢'
      case 'read':
        return '查看机巢位置'
      default:
      case 'add':
        return '添加机巢'
    }
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
    watch,
  } = useForm({
    defaultValues: initialState
  });
  //  字典
  const [statusOptions, setStatusOptions] = useState([])
  const fetchDict = () => {
    getDict({ type: 'nest_status' }).then((res) => {
      if (res.code === 0) {
        setStatusOptions(res.data)
        //  添加时设置默认值
        if (type === 'add') {
          const find = res.data.length > 0 ? res.data[0] : null
          setValue('status', find ? find.sort : '', {
            shouldValidate: false,
            shouldDirty: true,
          })
        }
      }
    })
  }

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
        if (res.data.data.length > 0) {
          updateArea(res.data.data, record?.id, type)
        }
      }
    })
  }

  const initFetch = () => {
    fetchDict()
    fetchRegion()
  }
  useEffect(() => {
    if (open) {
      initFetch()
      if (record) {
        reset({...record});
      }
    }
  }, [open]);

  //  这是data
  const lng = watch('longitude')
  const lat = watch('latitude')

  const [currentArea, setCurrentArea] = useState({
    center: {},
    radius: 0
  })
  const updateArea = (list, data, actionType) => {
    if (actionType === 'position') {
      // 地图点击更新经纬度
      setValue('longitude', data.lng);
      setValue('latitude', data.lat);
      return;
    }

    // 区域选择更新中心点与半径
    const targetArea = actionType !== 'add' ? list.find(item => item.id === data) : list[0];
    if (!targetArea) return;

    const { center_lng, center_lat, radius, id } = targetArea;

    setValue('area', id);
    setValue('longitude', center_lng);
    setValue('latitude', center_lat);
    setCurrentArea({
      center: { lng: center_lng, lat: center_lat },
      radius,
    });
  }

  //  修改区域
  const handleArea = (event, field) => {
    field.onChange(event)
    updateArea(areaOptions, event.target.value, 'update')
  }

  //  获取定位
  const savePosition = (position) => {
    updateArea(areaOptions, position, 'position')
  }

  //  关闭按钮
  const handleClose = (flag) => {
    reset()
    setCurrentArea(null)
    onClose(flag)
  }

  const [loading, setLoading] = useState(false)

  //  添加执行
  const onAdd = (params) => {
    addNest(params).then(res => {
      if (res.code === 0) {
        handleClose(true)
        message.success('添加成功')
      } else {
        message.error(res.message)
      }
      setLoading(false)
    }).catch(() => {
      message.error('添加失败')
      setLoading(false)
    })
  }

  //  修改执行
  const onUpdate = (params) => {
    updateNest({ ...params, nest_id: data.id }).then(res => {
      if (res.code === 0) {
        message.success(res.message)
        handleClose(true)
      } else {
        message.error(res.message)
      }
      setLoading(false)
    }).catch(() => {
      message.error('修改失败')
      setLoading(false)
    })
  }

  //  提交按钮
  const onSubmit = (params) => {
    if (type === 'add') {
      onAdd(params)
    } else {
      onUpdate(params)
    }
  }

  //  底部
  const renderAction = () => {
    return type !== 'read' ?
        <AppBar
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
        </AppBar> : null
  }

  const renderActionContent = () => {
    return (
        <Fragment>
          <FormControl fullWidth error={!!errors.nest_name} margin="normal">
            <InputLabel htmlFor="nest_name">机巢名称</InputLabel>
            <OutlinedInput
                label="机巢名称"
                id="nest_name"
                disabled={type === 'read'}
                aria-describedby="nest_name-helper-text"
                {...register("nest_name", {
                  required: '请输入机巢名称',
                })}
            />
            <InputHelp id="nest_name-helper-text">
              {errors.nest_name?.message}
            </InputHelp>
          </FormControl>
          <FormControl fullWidth error={!!errors.capacity} margin="normal">
            <InputLabel htmlFor="capacity">无人机限制数量</InputLabel>
            <OutlinedInput
                {...register("capacity", {
                  required: '请输入无人机限制数量',
                })}
                label="无人机限制数量"
                id="capacity"
                aria-describedby="capacity-helper-text"
                disabled={type !== 'add'}
            />
            <InputHelp id="capacity-helper-text">
              {errors.capacity?.message}
            </InputHelp>
          </FormControl>
          <Controller
              name="status"
              control={control}
              rules={{ required: '请选择机巢状态' }}
              render={({ field, fieldState }) => (
                  <FormControl fullWidth error={!!fieldState.error} margin="normal">
                    <InputLabel id="status-label">机巢状态</InputLabel>
                    <Select
                        labelId="status-label"
                        id="status"
                        label="机巢状态"
                        disabled={type !== 'update'}
                        {...field}>
                      {
                        statusOptions.map((item) => (
                            <MenuItem key={item.sort} value={item.sort}>
                              { item.dict_label }
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
              name="area"
              control={control}
              render={({ field, fieldState }) => (
                  <FormControl fullWidth error={!!fieldState.error} margin="normal">
                    <InputLabel id="area-label">区域范围</InputLabel>
                    <Select
                        labelId="area-label"
                        id="area"
                        label="区域范围"
                        disabled={type !== 'add'}
                        value={field.value}
                        onChange={(e) => handleArea(e, field)}>
                      {
                        areaOptions.map((item) => (
                            <MenuItem key={item.id} value={item.id}>
                              { item.zone_name }
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
        </Fragment>
    )
  }
  //  内容
  const renderContent = () => {
    return <Box component="form">
      {renderActionContent()}
      <Box sx={{ height: type !== 'read' ? '500px' : 'calc(100vh - 128px)' }}>
        { currentArea?.center?.lng }, { currentArea?.center?.lat } , { currentArea?.radius }
        {
          currentArea?.radius
              ? <MapGL3D
                  center={currentArea?.center}
                  radius={currentArea?.radius}
                  data={{lng, lat}}
                  zoom={ 14 }
                  tilt={60}
                  heading={45}
                  savePosition={savePosition}
                  mode="nest"
                  disabled={type !== 'add'}
              />
              : null
        }

      </Box>
    </Box>;
  }

  return (
      <CustomDrawer
          w={100}
          anchor="top"
          open={open}
          title={getTitle()}
          children={renderContent()}
          actions={renderAction()}
          onClose={() => handleClose(false)}
      />
  )
}
export default SaveNestDialog;