import React, {useEffect, useState} from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box, Stack, FormControl, FormHelperText, InputLabel, Button,
  MenuItem, OutlinedInput, Select, styled
} from '@mui/material';
import CustomDialog from '@/components/CustomDialog'
import MapGL3D from '@/components/mapGL3D'
import { addNest, updateNest } from '@/services'
import {message} from "@/utils/index.js";


const InputHelp = styled(FormHelperText)({
  height: '20px'
})

const initialState = {
  nest_name: '',
  capacity: '',
  status: 1,
  longitude: 116.404,
  latitude: 39.915
}

const SaveNestDialog = (props) => {

  const { open, onClose, data, type } = props;

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
      //  等待新的接口
    }
  }, [open]);

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
  const onUpdate = (data) => {
    updateNest({ ...data, nest_id: 1 }).then(res => {
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
                    {...field}>
                  {
                    ['汽油','柴油','电动','混合动力'].map((item, index) => (
                        <MenuItem key={index} value={item}>
                          { item }
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

      <Box sx={{ height: '300px' }}>
        <MapGL3D
            center={{ lng: 116.404, lat: 39.915 }}
            zoom={16}
            tilt={60}
            heading={45}
        />
      </Box>
    </Box>;
  }

  return (
      <CustomDialog
          open={open}
          maxWidth="sm"
          title={type === 'add' ? '添加机巢' : '修改机巢'}
          content={renderContent()}
          actions={renderAction()}
      />
  )
}
export default SaveNestDialog;