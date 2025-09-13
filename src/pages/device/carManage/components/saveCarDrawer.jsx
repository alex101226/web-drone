import React, {useState, useEffect} from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  AppBar, Box, Toolbar, FormControl, FormHelperText, InputLabel,
  Select, MenuItem, OutlinedInput, Button, styled,
} from '@mui/material';
import {LocalizationProvider, DatePicker} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {carStatusFilter} from '@/filters'
import CustomCardUpload from '@/components/customCardUpload'
import CustomDrawer from '@/components/customDrawer'
import {coverDateObj, coverDateString, message} from '@/utils'
import { addVehicle, updateVehicle, getHashrateUser, getDrivers, getLocations } from '@/services'


const initialState = {
  vehicle_alias: '',
  vehicle_photo: '',
  brand: '',
  series_number: '',
  vin_code: '',
  mileage: '',
  fuel_type: '',
  engine_number: '',
  current_location_id: '',
  department: '',
  status: '4',
  remark: '',
  owner_id: '',
  manufacture_year: coverDateObj(null, '5'),
  purchase_date: coverDateObj(null, '1'),
  insurance_expiry: coverDateObj(null, '1'),
  driver_ids: []
}

const InputHelp = styled(FormHelperText)({
  height: '20px'
})
const SaveCarDrawer = (props) => {
  const { open, onClose, data, type } = props

  const { CAR_STATUS_OPTIONS, renderCarStatus } = carStatusFilter()

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
    defaultValues: initialState
  });

  useEffect(() => {
    if (open) {
      fetchDrivers()
      fetchUser()
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

  //  获取所属人信息
  const [userData, setUserData] = useState([])
  const fetchUser = (p = 1) => {
    const params = {
      page: 1,
      pageSize: 1000,
      role_id: 2
    }
    getHashrateUser(params).then((res) => {
      setUserData(res.code === 0 ? res.data.data : [])
    })
  }

  //  获取司机信息
  const [driverData, setDriverData] = useState([])
  const fetchDrivers = () => {
    getDrivers().then((res) => {
      if (res.code === 0) {
        setDriverData(res.data.data)
      }
    })
  }

  //  照片上传
  const onChangeUpload = (url) => {
    setValue('vehicle_photo', url, {
      shouldValidate: false,  // 是否触发验证
      shouldDirty: true,     // 是否标记为已修改
    });
  }

  const [loading, setLoading] = useState(false)
  const onAdd = (data) => {
    if (loading) return;
    setLoading(true)
    addVehicle(data).then(res => {
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
    updateVehicle(params).then(res => {
      if (res.code === 0) {
        message.success('修改成功')
      } else {
        message.error(res.message)
      }
      setLoading(false)
      handleClose(true)
    }).catch(() => {
      message.error('修改失败')
      setLoading(false)
    })
  }

  const onSubmit = (data) => {

    const params = {
      ...data,
      manufacture_year: coverDateString(data.manufacture_year, '5'),
      purchase_date: coverDateString(data.purchase_date, '1'),
      insurance_expiry: coverDateString(data.insurance_expiry, '1'),
    }
    if (type === 'add') {
      onAdd(params)
    }
    if (type === 'edit') {
      onEdit(params)
    }
  }

  const vehiclePhoto = watch('vehicle_photo'); // 监听 vehicle_photo

  const renderForm = () => {
    return (
        <Box component="form">
          <FormControl fullWidth error={!!errors.vehicle_alias} margin="normal">
            <InputLabel htmlFor="vehicle_alias">车辆别名</InputLabel>
            <OutlinedInput
                label="车辆别名"
                id="vehicle_alias"
                aria-describedby="vehicle_alias-helper-text"
                {...register("vehicle_alias", {
                  required: '请输入车辆别名',
                })}
            />
            <InputHelp id="vehicle_alias-helper-text">
              {errors.vehicle_alias?.message}
            </InputHelp>
          </FormControl>
          <FormControl fullWidth error={!!errors.brand} margin="normal">
            <InputLabel htmlFor="brand">车辆品牌</InputLabel>
            <OutlinedInput
                {...register("brand", {
                  required: '请输入车辆别名',
                })}
                label="车辆品牌"
                id="brand"
                aria-describedby="brand-helper-text"
            />
            <InputHelp id="brand-helper-text">
              {errors.brand?.message}
            </InputHelp>
          </FormControl>
          <FormControl fullWidth error={!!errors.plate_number} margin="normal">
            <InputLabel htmlFor="plate_number">车牌号</InputLabel>
            <OutlinedInput
                {...register("plate_number", {
                  required: '请输入车牌号',
                })}
                label="车牌号"
                id="plate_number"
                aria-describedby="plate_number-helper-text"
            />
            <InputHelp id="plate_number-helper-text">
              {errors.plate_number?.message}
            </InputHelp>
          </FormControl>
          <FormControl fullWidth error={!!errors.series_number} margin="normal">
            <InputLabel htmlFor="series_number">系列号</InputLabel>
            <OutlinedInput
                {...register("series_number", {
                  required: '请输入系列号',
                })}
                label="系列号"
                id="series_number"
                aria-describedby="series_number-helper-text"
            />
            <InputHelp id="series_number-helper-text">
              {errors.series_number?.message}
            </InputHelp>
          </FormControl>
          <FormControl fullWidth error={!!errors.manufacture_year} margin="normal">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                  name="manufacture_year"
                  control={control}
                  rules={{ required: "请选择出厂年份" }}
                  render={({ field, fieldState }) => (
                      <>
                        <DatePicker
                            {...field}
                            views={["year"]}
                            label="出厂年份"
                            disableFuture
                            value={field.value} // RHF 管理的 value
                            onChange={(newValue) => field.onChange(newValue)} // 通知 RHF
                        />
                        <InputHelp error>
                          {fieldState.error?.message}
                        </InputHelp>
                      </>
                  )}
              />
            </LocalizationProvider>
          </FormControl>
          <FormControl fullWidth error={!!errors.vin_code} margin="normal">
            <InputLabel htmlFor="vin_code">VIN码</InputLabel>
            <OutlinedInput
                {...register("vin_code", {
                  required: '请输入VIN码',
                })}
                label="VIN码"
                id="vin_code"
                aria-describedby="vin_code-helper-text"
            />
            <InputHelp id="vin_code-helper-text">
              {errors.vin_code?.message}
            </InputHelp>
          </FormControl>
          <FormControl fullWidth error={!!errors.mileage} margin="normal">
            <InputLabel htmlFor="mileage">里程数（公里）</InputLabel>
            <OutlinedInput
                {...register("mileage", {
                  required: '请输入里程数（KM）',
                })}
                label="里程数（KM）"
                id="mileage"
                aria-describedby="mileage-helper-text"
            />
            <InputHelp id="mileage-helper-text">
              {errors.mileage?.message}
            </InputHelp>
          </FormControl>
          <Controller
              name="fuel_type"
              control={control}
              rules={{ required: '请选择燃油类型' }}
              render={({ field, fieldState }) => (
                  <FormControl fullWidth error={!!fieldState.error} margin="normal">
                    <InputLabel id="fuel_type-label">燃油类型</InputLabel>
                    <Select
                        labelId="fuel_type-label"
                        id="fuel_type"
                        label="燃油类型"
                        {...field}>
                      {
                        ['汽油','柴油','电动','混合动力'].map((item, index) => (
                            <MenuItem key={index} value={item}>
                              { item }
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
          <FormControl fullWidth error={!!errors.engine_number} margin="normal">
            <InputLabel htmlFor="engine_number">发动机号</InputLabel>
            <OutlinedInput
                {...register("engine_number", {
                  required: '请输入发动机号',
                })}
                label="发动机号"
                id="engine_number"
                aria-describedby="engine_number-helper-text"
            />
            <InputHelp id="engine_number-helper-text">
              {errors.engine_number?.message}
            </InputHelp>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                  name="insurance_expiry"
                  control={control}
                  rules={{ required: "请选择保险到期日期" }}
                  render={({ field, fieldState }) => (
                      <>
                        <DatePicker
                            {...field}
                            views={['year', 'month', 'day']}
                            label="保险到期日期"
                            value={field.value}
                            onChange={(newValue) => field.onChange(newValue)}
                        />
                      </>
                  )}
              />
            </LocalizationProvider>
          </FormControl>
          <Controller
              name="current_location_id"
              control={control}
              rules={{ required: '请选择车辆位置' }}
              render={({ field, fieldState }) => (
                  <FormControl fullWidth error={!!fieldState.error} margin="normal">
                    <InputLabel id="current_location_id-label">车辆位置</InputLabel>
                    <Select
                        labelId="current_location_id-label"
                        id="current_location_id"
                        label="车辆位置"
                        aria-describedby="current_location_id-helper-text"
                        { ...field }>
                      {
                        locationOptions.map((option, index) => (
                            <MenuItem key={index} value={option.id}>
                              { option.address }
                            </MenuItem>
                        ))
                      }
                    </Select>
                    <InputHelp id="current_location_id-helper-text">
                      {fieldState.error?.message}
                    </InputHelp>
                  </FormControl>
              )}
          />
          <FormControl fullWidth error={!!errors.department} margin="normal">
            <InputLabel htmlFor="department">所属部门</InputLabel>
            <OutlinedInput
                {...register("department", {
                  required: '请输入所属部门',
                })}
                label="所属部门"
                id="department"
                aria-describedby="department-helper-text"
            />
            <InputHelp id="department-helper-text">
              {errors.department?.message}
            </InputHelp>
          </FormControl>
          <FormControl fullWidth error={!!errors.purchase_date} margin="normal">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                  name="purchase_date"
                  control={control}
                  rules={{ required: "请选择购买时间" }}
                  render={({ field, fieldState }) => (
                      <>
                        <DatePicker
                            {...field}
                            views={['year', 'month', 'day']}
                            label="购买时间"
                            disableFuture
                            value={field.value}
                            onChange={(newValue) => field.onChange(newValue)}
                        />
                        <InputHelp error>
                          {fieldState.error?.message}
                        </InputHelp>
                      </>
                  )}
              />
            </LocalizationProvider>
          </FormControl>
          <Controller
              name="status"
              control={control}
              rules={{ required: '请选择车辆状态' }}
              render={({ field, fieldState }) => (
                  <FormControl fullWidth error={!!fieldState.error} margin="normal">
                    <InputLabel id="status-label">车辆状态</InputLabel>
                    <Select
                        labelId="status-label"
                        id="status"
                        label="车辆状态"
                        aria-describedby="status-helper-text"
                        disabled={isAdd()}
                        { ...field }>
                      {
                        CAR_STATUS_OPTIONS.map((status, index) => (
                            <MenuItem key={index} value={status}>
                              { renderCarStatus(status) }
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
              name="owner_id"
              control={control}
              rules={{ required: '请选择负责人' }}
              render={({ field, fieldState }) => (
                  <FormControl fullWidth error={!!fieldState.error} margin="normal">
                    <InputLabel htmlFor="owner_id-label">负责人</InputLabel>
                    <Select
                        labelId="owner_id-label"
                        id="owner_id"
                        aria-describedby="owner_id-helper-text"
                        label="负责人"
                        { ...field }>
                      {
                        userData.map((item, index) => (
                            <MenuItem key={index} value={item.id}>
                              { item.nickname }
                            </MenuItem>
                        ))
                      }
                    </Select>
                    <InputHelp id="owner_id-helper-text">
                      {fieldState.error?.message}
                    </InputHelp>
                  </FormControl>
              )}
          />

          <Controller
              name="driver_ids"
              control={control}
              render={({ field, fieldState }) => (
                  <FormControl fullWidth margin="normal">
                    <InputLabel id="driver_ids-label">司机</InputLabel>
                    <Select
                        multiple
                        labelId="driver_ids-label"
                        id="driver_ids"
                        label="司机"
                        value={field.value || []}
                        onChange={(e) => field.onChange(e.target.value)}>
                      {
                        driverData.map((item, index) => (
                            <MenuItem key={index} value={item.id}>
                              { item.name }
                            </MenuItem>
                        ))
                      }
                    </Select>
                  </FormControl>
              )}
          />
          <FormControl fullWidth error={!!errors.remark} margin="normal">
            <InputLabel htmlFor="remark">备注信息</InputLabel>
            <OutlinedInput
                rows={3}
                {...register("remark", {
                  required: '请输入备注信息',
                })}
                label="备注信息"
                id="remark"
                aria-describedby="remark-helper-text"
            />
            <InputHelp id="remark-helper-text">
              {errors.remark?.message}
            </InputHelp>
          </FormControl>
          <FormControl error={!!errors.vehicle_photo} margin="normal">
            <CustomCardUpload
                preview={vehiclePhoto}
                onChangeUpload={onChangeUpload}
            />
          </FormControl>
        </Box>
    )
  }

  return (
      <CustomDrawer
          open={open}
          onClose={handleClose}
          title={isAdd() ? '添加车辆' : '修改车辆'}
          children={renderForm()}
          actions={<AppBar
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
      }/>
  )
}
export default SaveCarDrawer