import React, {useState, useEffect} from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  AppBar, Box, Toolbar, FormControl, FormHelperText, InputLabel,
  Select, MenuItem, OutlinedInput, Button, styled,
} from '@mui/material';
import CustomCardUpload from '@/components/customCardUpload'
import CustomDrawer from '@/components/customDrawer'
import {message} from '@/utils'
import {addDrone, updateDrone, getOperators, getDict, getNests} from '@/services'
import { useUserStore } from '@/store'
import MapGL3D from "@/components/mapGL3D/index.jsx";

const initialState = {
  drone_sn: '',
  model: '',
  operator_id: '',
  battery_capacity: '',
  payload_capacity: '',
  camera_specs: '',
  drone_photo: '',
  drone_name: '',
  status: '1',
  latitude: '',
  longitude: '',
  current_nest: ''
}

const InputHelp = styled(FormHelperText)({
  height: '20px'
})
const SaveDroneDrawer = (props) => {
  const { open, onClose, record, type } = props

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

  const useInfo = useUserStore(state => state.userInfo)
  //  飞手信息
  const [userData, setUserData] = useState([])
  const fetchOperator = (p = 1) => {
    const params = {
      page: 1,
      pageSize: 1000,
      role_id: useInfo.role_id,
    }
    getOperators(params).then((res) => {
      setUserData(res.code === 0 ? res.data.data : [])
    })
  }

  //  无人机状态
  const [statusOptions, setStatusOptions] = useState([])
  const saveStatusOption = (data) => {
    const find = data.length > 0 ? data[0] : null
    if (isAdd()) {
      setValue('status', find ? find.sort : '', {
        shouldValidate: false,
        shouldDirty: true,
      })
    }
    setStatusOptions(data)
  }

  //  相机参数
  const [cameraOptions, setCameraOptions] = useState([])
  const saveCameraOption = (data) => {
    setCameraOptions(data)
  }

  //  字典
  const fetchDict = (type) => {
    getDict({ type: type }).then((res) => {
      if (res.code === 0) {
        switch (type) {
          case 'drone_status':
            saveStatusOption(res.data || [])
            break;
          case 'camera_model':
            saveCameraOption(res.data || [])
            break;
        }
      }
    })
  }

  //  机巢
  const [nestsOptions, setNestsOptions] = useState([])
  const fetchNest = () => {
    const params = {
      page: 1,
      pageSize: 1000,
    }
    getNests(params).then(({ data, code }) => {
      if (code === 0) {
        setNestsOptions(data.data)
        setNest(data.data, record, 'default')
      }
    })
  }

  const initFetch = () => {
    fetchOperator()
    fetchNest()
    fetchDict('drone_status')
    fetchDict('camera_model')
  }

  //  修改时，获取nest
  const [currentArea, setCurrentArea] = useState(null)
  const setNest = (list, data, type) => {
    if (!Array.isArray(list) || !list.length) return;

    const find = list.find(item => {
      if (type === 'change') {
        return item.id === data;
      }
      // 经纬度都要匹配，避免误选
      return item.longitude === data?.longitude && item.latitude === data?.latitude;
    });

    if (!find) return;

    if (type === 'change') {
      setValue('latitude', find.latitude);
      setValue('longitude', find.longitude);
    }

    setCurrentArea({
      center: {
        lng: find.longitude,
        lat: find.latitude,
      },
      radius: find.radius,
    });
  }

  useEffect(() => {
    if (open) {
      initFetch()
      if (record) {
        reset({ ...record })
      }
    }
  }, [open])

  const handleLocation = (event, field) => {
    const value = event.target.value
    setNest(nestsOptions, value, 'change')
    field.onChange(value)
  }
  //  关闭窗口
  const handleClose = (flag) => {
    setCurrentArea(null)
    reset()
    onClose(flag)
  }

  //  照片上传
  const onChangeUpload = (url) => {
    setValue('drone_photo', url, {
      shouldValidate: false,  // 是否触发验证
      shouldDirty: true,     // 是否标记为已修改
    });
  }

  const [loading, setLoading] = useState(false)
  const onAdd = (params) => {
    if (loading) return;
    setLoading(true)
    addDrone(params).then(res => {
      if (res.code === 0) {
        message.success('添加成功')
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

  //  执行修改
  const onEdit = (params) => {
    if (loading) return;
    setLoading(true)
    updateDrone(params).then(res => {
      if (res.code === 0) {
        message.success('修改成功')
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

  const onSubmit = (params) => {
    if (type === 'add') {
      onAdd(params)
    }
    if (type === 'edit') {
      onEdit(params)
    }
  }

  const dronePhoto = watch('drone_photo'); // 监听 vehicle_photo

  //  地图
  const renderMap = () => {
    return currentArea ? <Box sx={{ width: '100%', height: '300px'}}>
      <MapGL3D
          center={currentArea.center}
          radius={currentArea.radius}
          data={{lng: currentArea?.center?.lng, lat: currentArea?.center?.lat}}
          zoom={ 14 }
          tilt={60}
          heading={45}
          mode="nest"
          disabled
      />
    </Box> : null
  }

  const renderForm = () => {
    return (
        <Box component="form">
          <FormControl fullWidth error={!!errors.drone_name} margin="normal">
            <InputLabel htmlFor="vehicle_alias">无人机名称</InputLabel>
            <OutlinedInput
                label="无人机名称"
                id="drone_name"
                aria-describedby="drone_name-helper-text"
                {...register("drone_name", {
                  required: '请输入无人机名称',
                })}
            />
            <InputHelp id="drone_name-helper-text">
              {errors.drone_name?.message}
            </InputHelp>
          </FormControl>
          <FormControl fullWidth error={!!errors.drone_sn} margin="normal">
            <InputLabel htmlFor="brand">无人机编号</InputLabel>
            <OutlinedInput
                {...register("drone_sn", {
                  required: '请输入无人机编号',
                })}
                label="无人机编号"
                id="drone_sn"
                aria-describedby="drone_sn-helper-text"
            />
            <InputHelp id="drone_sn-helper-text">
              {errors.drone_sn?.message}
            </InputHelp>
          </FormControl>
          <FormControl fullWidth error={!!errors.model} margin="normal">
            <InputLabel htmlFor="model">无人机型号</InputLabel>
            <OutlinedInput
                {...register("model", {
                  required: '请输入无人机型号',
                })}
                label="无人机型号"
                id="model"
                aria-describedby="model-helper-text"
            />
            <InputHelp id="model-helper-text">
              {errors.model?.message}
            </InputHelp>
          </FormControl>
          <FormControl fullWidth error={!!errors.battery_capacity} margin="normal">
            <InputLabel htmlFor="battery_capacity">电池容量(mAh)</InputLabel>
            <OutlinedInput
                {...register("battery_capacity", {
                  required: '请输入电池容量(mAh)',
                })}
                label="电池容量(mAh)"
                id="battery_capacity"
                aria-describedby="battery_capacity-helper-text"
            />
            <InputHelp id="battery_capacity-helper-text">
              {errors.battery_capacity?.message}
            </InputHelp>
          </FormControl>
          <FormControl fullWidth error={!!errors.payload_capacity} margin="normal">
            <InputLabel htmlFor="payload_capacity">载荷能力(kg)</InputLabel>
            <OutlinedInput
                {...register("payload_capacity", {
                  required: '请输入载荷能力(kg)',
                })}
                label="载荷能力(kg)"
                id="payload_capacity"
                aria-describedby="payload_capacity-helper-text"
            />
            <InputHelp id="payload_capacity-helper-text">
              {errors.payload_capacity?.message}
            </InputHelp>
          </FormControl>
          <Controller
              name="camera_specs"
              control={control}
              rules={{ required: '请选择相机参数' }}
              render={({ field, fieldState }) => (
                  <FormControl fullWidth error={!!fieldState.error} margin="normal">
                    <InputLabel id="camera_specs-label">相机参数</InputLabel>
                    <Select
                        labelId="camera_specs-label"
                        id="camera_specs"
                        label="相机参数"
                        aria-describedby="camera_specs-helper-text"
                        { ...field }>
                      {
                        cameraOptions.map((option, index) => (
                            <MenuItem key={index} value={option.sort}>
                              { option.dict_label }
                            </MenuItem>
                        ))
                      }
                    </Select>
                    <InputHelp id="camera_specs-helper-text">
                      {fieldState.error?.message}
                    </InputHelp>
                  </FormControl>
              )}
          />
          <Controller
              name="status"
              control={control}
              rules={{ required: '请选择无人机状态' }}
              render={({ field, fieldState }) => (
                  <FormControl fullWidth error={!!fieldState.error} margin="normal">
                    <InputLabel id="status-label">无人机状态</InputLabel>
                    <Select
                        labelId="status-label"
                        id="status"
                        label="无人机状态"
                        aria-describedby="status-helper-text"
                        disabled={isAdd()}
                        { ...field }>
                      {
                        statusOptions.map((status, index) => (
                            <MenuItem key={index} value={status.sort}>
                              { status.dict_label }
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
          <FormControl error={!!errors.drone_photo} margin="normal">
            <CustomCardUpload
                name="drone"
                preview={dronePhoto}
                onChangeUpload={onChangeUpload}
            />
          </FormControl>
          <Controller
              name="operator_id"
              control={control}
              rules={{ required: '请选择飞手' }}
              render={({ field, fieldState }) => (
                  <FormControl fullWidth error={!!fieldState.error} margin="normal">
                    <InputLabel htmlFor="owner_id-label">飞手</InputLabel>
                    <Select
                        labelId="operator_id-label"
                        id="operator_id"
                        aria-describedby="operator_id-helper-text"
                        label="飞手"
                        { ...field }>
                      {
                        userData.map((item, index) => (
                            <MenuItem key={index} value={item.id}>
                              { item.operator_name }
                            </MenuItem>
                        ))
                      }
                    </Select>
                    <InputHelp id="operator_id-helper-text">
                      {fieldState.error?.message}
                    </InputHelp>
                  </FormControl>
              )}
          />
          <Controller
              name="current_nest"
              control={control}
              rules={{ required: '请选择无人机位置' }}
              render={({ field }) => {
                return (
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="current_nest-label">无人机位置</InputLabel>
                      <Select
                          labelId="current_nest-label"
                          id="current_nest"
                          label="无人机位置"
                          aria-describedby="current_nest-helper-text"
                          disabled={record && [2, 5].includes(record.status)}
                          value={field.value}
                          onChange={(value) => handleLocation(value, field)}>
                        {
                          nestsOptions.map((option, index) => (
                              <MenuItem key={index} value={option.id}>
                                { option.nest_name }
                              </MenuItem>
                          ))
                        }
                      </Select>
                    </FormControl>
                )
              }}
          />
          {renderMap()}
        </Box>
    )
  }

  const renderAction = () => {
    return (
        <AppBar
            elevation={0}
            component="nav"
            sx={{ position: 'sticky', width: '100%', bottom: '0', left: '0'}}>
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
    )
  }
  return (
      <CustomDrawer
          open={open}
          onClose={handleClose}
          title={isAdd() ? '添加无人机' : '修改无人机'}
          children={renderForm()}
          actions={renderAction()}
      />
  )
}
export default SaveDroneDrawer