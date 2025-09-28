import React, {Fragment, useEffect, useMemo, useState} from 'react';
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
  area: 1
}

const SaveNestDialog = (props) => {

  const { open, onClose, data, type } = props;

  const isAdd = () => type === 'add';

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
    watch
  } = useForm({
    defaultValues: initialState
  });
  //  字典
  const [statusOptions, setStatusOptions] = useState([])
  const fetchDict = () => {
    getDict({ type: 'nest_status' }).then((res) => {
      if (res.code === 0) {
        setStatusOptions(res.data)
        if (isAdd()) {
          const find = res.data.length > 0 ? res.data[0] : null
          setValue('status', find ? find.sort : '', {
            shouldValidate: false,
            shouldDirty: true,
          })
        }
      }
    })
  }

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
      //  等待新的接口
      fetchDict()
      fetchRegion()
      if (data) {
        reset({...data});
      }
    }
  }, [open]);

  const currentArea = useMemo(() => {
    if (areaOptions.length > 0) {
      const find = areaOptions.find((item) => item.id === area);
      const data = find || areaOptions[0]
      return {
        center: {
          lng: data.center_lng,
          lat: data.center_lat
        },
        radius: data.radius
      }
    }

    return {
      center: {
        lng: 113.631900,
        lat: 34.752900
      },
      radius: 5000
    }
  }, [area, areaOptions])

  //  关闭按钮
  const handleClose = (flag) => {
    reset()
    onClose(flag)
  }

  const [loading, setLoading] = useState(false)

  //  添加执行
  const onAdd = (data) => {
    addNest(data).then(res => {
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

  //  获取定位
  const savePosition = (position) => {
    reset({
      longitude: position.lng,
      latitude: position.lat,
    }, {
      keepDirty: true,     // 保留已改动的字段状态
      keepErrors: true,    // 保留错误
      keepTouched: true    // 保留触碰状态
    });
  }

  //  提交按钮
  const onSubmit = (data) => {
    if (type === 'add') {
      onAdd(data)
    } else {
      onUpdate(data)
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
                        disabled={isAdd()}
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
                        disabled={!isAdd()}
                        {...field}>
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
      { type !== 'read' ? renderActionContent() : null}

      <Box sx={{ height: type !== 'read' ? '500px' : 'calc(100vh - 128px)' }}>
        <MapGL3D
            center={currentArea.center}
            radius={currentArea.radius}
            data={data}
            zoom={ 14 }
            tilt={60}
            heading={45}
            savePosition={savePosition}
            mode="nest"
            disabled={type === 'read'}
        />
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