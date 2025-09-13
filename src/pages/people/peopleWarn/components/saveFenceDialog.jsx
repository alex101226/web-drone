import {useEffect, useState} from 'react';
import {Controller, useForm,} from 'react-hook-form';
import {
  FormControl, InputLabel, FormHelperText, Box, Button, MenuItem, OutlinedInput, Select, styled
} from '@mui/material';
import CustomDialog from '@/components/CustomDialog'
import { addFence } from '@/services'
import { message } from '@/utils'
import {fenceGroupOptions,fenceTypeOptions,deviceLocationOptions} from '../../mock'

const InputHelp = styled(FormHelperText)({
  height: '20px'
})

const initialState = {
  fence_name: '',
  fence_type: '1',
  group_key: '0',
  device_location_key: ''
}
const SaveFenceDialog = (props) => {
  const { open, onClose, data } = props;
  useEffect(() => {
    if (open) {

    }
  }, [open]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    defaultValues: initialState
  });

  //  内容
  const renderContent = () => {
    return <Box component="form">
      <FormControl fullWidth error={!!errors.fence_name} margin="normal">
        <InputLabel htmlFor="fence_name-input">围栏名称</InputLabel>
        <OutlinedInput
            id="fence_name-input"
            aria-describedby="fence_name-helper-text"
            label="用户昵称"
            {...register('fence_name', {
              required: '请输入围栏名称',
            })}
        />
        <InputHelp id="fence_name-helper-text">
          {errors.fence_name?.message}
        </InputHelp>
      </FormControl>

      <Controller
          name="fence_type"
          control={control}
          rules={{ required: '请选择围栏类型' }}
          render={({ field, fieldState }) => (
              <FormControl fullWidth error={!!fieldState.error} margin="normal">
                <InputLabel id="fence_type-input">围栏类型</InputLabel>
                <Select
                    labelId="fence_type-input"
                    label="围栏类型"
                    aria-describedby="fence_type-helper-text"
                    {...field}
                >
                  {fenceTypeOptions.map((item, index) => (
                      <MenuItem value={item.value} key={index}>
                        {item.label}
                      </MenuItem>
                  ))}
                </Select>
                <InputHelp id="fence_type-helper-text">
                  {fieldState.error?.message}
                </InputHelp>
              </FormControl>
          )}
      />

      <Controller
          name="group_key"
          control={control}
          rules={{ required: '请选择有效分组' }}
          render={({ field, fieldState }) => (
              <FormControl fullWidth error={!!fieldState.error} margin="normal">
                <InputLabel id="group_key-input">有效分组</InputLabel>
                <Select
                    labelId="group_key-input"
                    label="有效分组"
                    aria-describedby="group_key-helper-text"
                    {...field}
                >
                  {fenceGroupOptions.map((item, index) => (
                      <MenuItem value={item.value} key={index}>
                        {item.label}
                      </MenuItem>
                  ))}
                </Select>
                <InputHelp id="group_key-helper-text">
                  {fieldState.error?.message}
                </InputHelp>
              </FormControl>
          )}
      />

      <Controller
          name="device_location_key"
          control={control}
          rules={{ required: '请选择设置位置' }}
          render={({ field, fieldState }) => (
              <FormControl fullWidth error={!!fieldState.error} margin="normal">
                <InputLabel id="device_location_key-input">设备位置</InputLabel>
                <Select
                    labelId="device_location_key-input"
                    label="设备位置"
                    aria-describedby="device_location_key-helper-text"
                    {...field}
                >
                  {deviceLocationOptions.map((item, index) => (
                      <MenuItem value={item.value} key={index}>
                        {item.label}
                      </MenuItem>
                  ))}
                </Select>
                <InputHelp id="device_location_key-helper-text">
                  {fieldState.error?.message}
                </InputHelp>
              </FormControl>
          )}
      />

      <FormControl fullWidth error={!!errors.remark} margin="normal">
        <InputLabel htmlFor="remark-input">备注</InputLabel>
        <OutlinedInput
            id="remark-input"
            multiline
            rows={3}
            aria-describedby="remark-helper-text"
            label="备注"
            {...register('remark', {
              required: '请输入备注',
            })}
        />
        <InputHelp id="remark-helper-text">
          {errors.remark?.message}
        </InputHelp>
      </FormControl>
    </Box>
  }

  //  关闭按钮
  const handleClose = (flag) => {
    reset()
    onClose(flag)
  }
  const [loading, setLoading] = useState(false)
  const onSubmit = (data) => {
    if (loading) return ;
    setLoading(true)
    addFence(data).then(res => {
      if (res.code === 0) {
        message.success(res.message)
        handleClose(true)
      } else {
        message.error(res.message)
      }
      setLoading(false)
    }).catch(err => {
      message.error(err.message)
      setLoading(false)
    })
  }
  //  底部
  const renderAction = () => {
    return <Box sx={{ gap: 2, display: 'flex', alignItems: 'center' }}>
      <Button variant="outlined" onClick={() => handleClose(false)}>
        关闭
      </Button>
      <Button variant="contained" loading={loading} onClick={handleSubmit(onSubmit)}>
        保存
      </Button>
    </Box>
  }
  return (
      <CustomDialog
          open={open}
          maxWidth="sm"
          title="历史轨迹"
          content={renderContent()}
          actions={renderAction()}
      />
  )
}
export default SaveFenceDialog;