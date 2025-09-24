import React, {useEffect, useMemo, useState} from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box, Stack, FormControl, FormHelperText, InputLabel, Button,
  MenuItem, OutlinedInput, Select, styled
} from '@mui/material';
import CustomDialog from '@/components/CustomDialog'
import MapGL3D from '@/components/mapGL3D'
import {addNest, updateNest, getDict, getRegion} from '@/services'
import {message} from "@/utils";

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
    getRegion().then(res => {
      if (res.code === 0) {
        setAreaOptions(res.data)
      }
    })
  }

  useEffect(() => {
    if (open) {
      //  等待新的接口
      fetchDict()
      fetchRegion()
      if (data) {
        reset({...data, area: 1});
      }
    }
  }, [open]);

  const getCenter = () => {
    if (areaOptions.length) {
      return areaOptions.find(item => item.id === area);
    }
    return {
      lng: 113.631900, lat: 34.752900
    }
  }

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
      longitude: position.point.lng,
      latitude: position.point.lat,
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
    return <Stack spacing={2} direction="row">
      <Button variant="outlined" onClick={() => handleClose(false)}>
        关闭
      </Button>
      <Button variant="contained" onClick={handleSubmit(onSubmit)} loading={loading}>
        保存
      </Button>
    </Stack>
  }

  //  内容
  const renderContent = () => {
    return <Box component="form">
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
                <InputLabel id="status-label">无人机区域</InputLabel>
                <Select
                    labelId="area-label"
                    id="area"
                    label="无人机区域"
                    {...field}>
                  {
                    areaOptions.map((item) => (
                        <MenuItem key={item.id} value={item.id}>
                          { item.name }
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

      <Box sx={{ height: '500px' }}>
        <MapGL3D
            center={getCenter()}
            data={data}
            zoom={ area === 1 ? 10 : 14 }
            tilt={60}
            heading={45}
            savePosition={savePosition}
        />
      </Box>
    </Box>;
  }

  return (
      <CustomDialog
          maxWidth="md"
          open={open}
          title={type === 'add' ? '添加机巢' : '修改机巢'}
          content={renderContent()}
          actions={renderAction()}
      />
  )
}
export default SaveNestDialog;