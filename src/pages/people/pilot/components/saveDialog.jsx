import React, {useState, useEffect} from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box, Button, FormControl, FormHelperText, InputLabel,
  MenuItem, OutlinedInput, Select, styled, Stack
} from '@mui/material';
import CustomDialog from '@/components/CustomDialog'
import CustomCardUpload from '@/components/customCardUpload'
import {updateOperator, getDict, addOperator} from '@/services'
import {message} from "@/utils";

const InputHelp = styled(FormHelperText)({
  height: '20px'
})

const initialState = {
  operator_name: '',
  phone: '',
  status: '1',
  license_no: '',
  license_photo: ''
}
const SaveDialog = (props) => {
  const { open, onClose, data, type } = props;

  const isAdd = () => type === 'add';
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

  const license_photo = watch('license_photo'); // 监听 vehicle_photo

  const [statusOptions, setStatusOptions] = useState([])
  const fetchDict = () => {
    getDict({ type: 'operator_status' }).then((res) => {
      if (res.code === 0) {
        setStatusOptions(res.data)
        const find = res.data.length > 0 ? res.data[0] : null
        setValue('status', find ? find.sort : '', {
          shouldValidate: false,
          shouldDirty: true,
        })
      }
    })
  }
  useEffect(() => {
    if (open) {
      //  等待新的接口
      fetchDict()
      if (data) {
        reset({...data});
      }
    }
  }, [open]);

  //  照片上传
  const onChangeUpload = (url) => {
    setValue('license_photo', url, {
      shouldValidate: false,  // 是否触发验证
      shouldDirty: true,     // 是否标记为已修改
    });
  }

  //  关闭按钮
  const handleClose = (flag) => {
    onClose(flag)
  }

  const [loading, setLoading] = useState(false)

  //  添加执行
  const onAdd = (data) => {
    addOperator(data).then(res => {
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
    updateOperator({ ...data, operator_id: 1 }).then(res => {
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
    if (isAdd()) {
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
      <FormControl fullWidth error={!!errors.operator_name} margin="normal">
        <InputLabel htmlFor="operator_name">操控员姓名</InputLabel>
        <OutlinedInput
            label="操控员姓名"
            id="operator_name"
            aria-describedby="operator_name-helper-text"
            {...register("operator_name", {
              required: '请输入操控员姓名',
            })}
        />
        <InputHelp id="operator_name-helper-text">
          {errors.operator_name?.message}
        </InputHelp>
      </FormControl>
      <FormControl fullWidth error={!!errors.phone} margin="normal">
        <InputLabel htmlFor="phone">联系电话</InputLabel>
        <OutlinedInput
            {...register("phone", {
              required: '请输入联系电话',
              pattern: {
                value: /^1\d{10}$/,
                message: '请输入有效的手机号'
              }
            })}
            label="联系电话"
            id="phone"
            aria-describedby="phone-helper-text"
        />
        <InputHelp id="phone-helper-text">
          {errors.phone?.message}
        </InputHelp>
      </FormControl>
      <FormControl fullWidth error={!!errors.license_no} margin="normal">
        <InputLabel htmlFor="operator_name">飞行执照编号</InputLabel>
        <OutlinedInput
            label="飞行执照编号"
            id="license_no"
            aria-describedby="license_no-helper-text"
            {...register("license_no", {
              required: '请输入飞行执照编号',
            })}
        />
        <InputHelp id="license_no-helper-text">
          {errors.license_no?.message}
        </InputHelp>
      </FormControl>
      <Controller
          name="status"
          control={control}
          rules={{ required: '请选择状态' }}
          render={({ field, fieldState }) => (
              <FormControl fullWidth error={!!fieldState.error} margin="normal">
                <InputLabel id="status-label">操作员状态</InputLabel>
                <Select
                    labelId="status-label"
                    id="status"
                    label="操作员状态"
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
      <FormControl error={!!errors.vehicle_photo} margin="normal">
        <CustomCardUpload
            name="operator"
            preview={license_photo}
            onChangeUpload={onChangeUpload}
        />
      </FormControl>
    </Box>;
  }
  return (
      <CustomDialog
          open={open}
          maxWidth="sm"
          title={ isAdd() ? '添加无人机操控员' : '修改无人机操控员'}
          content={renderContent()}
          actions={renderAction()}
      />
  )
}
export default SaveDialog;