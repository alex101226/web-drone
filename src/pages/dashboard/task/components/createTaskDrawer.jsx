import {useState, useEffect} from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  AppBar, Box, Toolbar, FormControl, FormHelperText, InputLabel, InputAdornment,
  MenuItem, OutlinedInput, Select, styled, Button,
} from '@mui/material';
import CustomDrawer from '@/components/customDrawer'
import {getHashrateUser, createTask} from "@/services";
import {message} from "@/utils/index.js";

const InputHelp = styled(FormHelperText)({
  height: '20px'
})


const initialState = {
  task_name: '',
  user_id: '',
  nodes: 1,
  area: 'computed',
  qos: 'normal',
  cpu_number: 4,
  gpu_number: 1,
  remark: '',
  plan_running_time: '15',
}
const CreateTaskDrawer = (props) => {
  const {open, onClose} = props

  //  获取所属人信息
  const [userData, setUserData] = useState([])
  const fetchUser = () => {
    const params = {
      page: 1,
      pageSize: 1000,
      role_id: 2
    }
    getHashrateUser(params).then((res) => {
      setUserData(res.code === 0 ? res.data.data : [])
    })
  }

  useEffect(() => {
    if (open) {
      fetchUser()
    }
  }, [open])

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
    watch,
    getValues,
  } = useForm({
    defaultValues: initialState,
    mode: 'onChange',
  });

  //  监听分区
  const area = watch('area');

  //  分区发生变化，修改nodes的值， 修改cpu和gpu的值
  useEffect(() => {
    if (open) {
      const nodes = getValues('nodes')
      setValue('nodes', area === 'gpu' ? 1 : nodes, {
        shouldValidate: false,
        shouldDirty: true,
      })
      if (area === 'gpu') {
        setValue('cpu_number', undefined)
      } else {
        setValue('gpu_number', undefined)
      }
    }
  }, [area, open])

  //  统一整数验证
  const validate = (value) => {
    return /^\d+$/.test(value) || '请输入整数'
  }

  //  节点数验证
  const nodeValidate = (value) => {
    if (!/^\d+$/.test(value)) {
      return '请输入整数'
    }
    if (area === 'gpu' && value > 1) {
      return 'gpu分区的节点数最大值为1'
    }
    return true
  }

  const renderForm = () => {
    return (
        <Box component="form">
          <FormControl fullWidth error={!!errors.task_name} margin="normal">
            <InputLabel htmlFor="task_name-label">任务名称</InputLabel>
            <OutlinedInput
                label="任务名称"
                id="task_name"
                aria-describedby="task_name-helper-text"
                {...register("task_name", {
                  required: '请输入任务名称',
                })}
            />
            <InputHelp id="task_name-helper-text">
              {errors.task_name?.message}
            </InputHelp>
          </FormControl>
          <Controller
              name="user_id"
              control={control}
              rules={{ required: '请选择账户' }}
              render={({ field, fieldState }) => (
                  <FormControl fullWidth error={!!fieldState.error} margin="normal">
                    <InputLabel id="user_id-label">账户</InputLabel>
                    <Select
                        labelId="user_id-label"
                        id="user_id"
                        label="账户"
                        {...field}>
                      {
                        userData.map((item, index) => (
                            <MenuItem key={index} value={item.id}>
                              { item.nickname }
                            </MenuItem>
                        ))
                      }
                    </Select>
                    <InputHelp id="user_id-helper-text">
                      {fieldState.error?.message}
                    </InputHelp>
                  </FormControl>
              )}
          />
          <Controller
              name="area"
              control={control}
              rules={{ required: '请选择分区' }}
              render={({ field, fieldState }) => (
                  <FormControl fullWidth error={!!fieldState.error} margin="normal">
                    <InputLabel id="area-label">分区</InputLabel>
                    <Select
                        labelId="area-label"
                        id="area"
                        label="分区"
                        {...field}>
                      {
                        ['computed','gpu'].map((item, index) => (
                            <MenuItem key={index} value={item}>
                              { item }
                            </MenuItem>
                        ))
                      }
                    </Select>
                    <InputHelp id="area-helper-text">
                      {fieldState.error?.message}
                    </InputHelp>
                  </FormControl>
              )}
          />
          <Controller
              name="qos"
              control={control}
              rules={{ required: '请选择qos' }}
              render={({ field, fieldState }) => (
                  <FormControl fullWidth error={!!fieldState.error} margin="normal">
                    <InputLabel id="qos-label">QOS</InputLabel>
                    <Select
                        labelId="qos-label"
                        id="qos"
                        label="QOS"
                        {...field}>
                      {
                        ['normal', 'low', 'high'].map((item, index) => (
                            <MenuItem key={index} value={item}>
                              { item }
                            </MenuItem>
                        ))
                      }
                    </Select>
                    <InputHelp id="qos-helper-text">
                      {fieldState.error?.message}
                    </InputHelp>
                  </FormControl>
              )}
          />
          <FormControl fullWidth error={!!errors.nodes} margin="normal">
            <InputLabel htmlFor="nodes">节点数</InputLabel>
            <OutlinedInput
                {...register('nodes', {
                  required: '请输入节点数',
                  validate: nodeValidate,
                })}
                label="节点数"
                id="nodes"
                aria-describedby="nodes-helper-text"
            />
            <InputHelp id="nodes-helper-text">
              {errors.nodes?.message}
            </InputHelp>
          </FormControl>
          {
            area === 'gpu'
              ?  <FormControl fullWidth error={!!errors.gpu_number} margin="normal">
                  <InputLabel htmlFor="gpu_number">GPU卡数</InputLabel>
                  <OutlinedInput
                      {...register("gpu_number", {
                        required: '请输入GPU卡数',
                        min: { value: 1, message: 'GPU卡数设置最小值为： 1' },
                        max: { value: 2, message: 'GPU卡数设置最大值为： 2' },
                        validate: validate,
                      })}
                      label="GPU卡数"
                      id="gpu_number"
                      aria-describedby="gpu_number-helper-text"
                      inputProps={{ min: 1, max: 2, }}
                  />
                  <InputHelp id="gpu_number-helper-text">
                    {errors.gpu_number?.message}
                  </InputHelp>
                </FormControl>
                : <FormControl fullWidth error={!!errors.cpu_number} margin="normal">
                  <InputLabel htmlFor="cpu_number">cpu核心数</InputLabel>
                  <OutlinedInput
                      {...register("cpu_number", {
                        required: '请输入cpu核心数',
                        validate: validate,
                      })}
                      label="cpu核心数"
                      id="cpu_number"
                      aria-describedby="cpu_number-helper-text"
                  />
                  <InputHelp id="cpu_number-helper-text">
                    {errors.cpu_number?.message}
                  </InputHelp>
                </FormControl>
          }
          <FormControl fullWidth error={!!errors.plan_running_time} margin="normal">
            <InputLabel htmlFor="plan_running_time">计划运行时间</InputLabel>
            <OutlinedInput
                {...register("plan_running_time", {
                  required: '请输入计划运行时间',
                  validate: validate,
                })}
                label="计划运行时间"
                id="plan_running_time"
                aria-describedby="plan_running_time-helper-text"
                endAdornment={<InputAdornment position="end">分钟</InputAdornment>}
            />
            <InputHelp id="plan_running_time-helper-text">
              {errors.plan_running_time?.message}
            </InputHelp>
          </FormControl>
          <FormControl fullWidth error={!!errors.remark} margin="normal">
            <InputLabel htmlFor="remark">备注信息</InputLabel>
            <OutlinedInput
                multiline
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
        </Box>
    )
  }


  //  提交表单
  const [loading, setLoading] = useState(false)
  const onSubmit = (data) => {
    const params = {
      ...data,
      cpu_number: data.cpu_number ?? null,
      gpu_number: data.gpu_number ?? null,
    }
    if (loading) return;
    setLoading(true)
    createTask(params).then((res) => {
      if (res.code === 0) {
        message.success('创建成功')
      } else {
        message.error(res.message)
      }
      setLoading(false)
      handleClose(true)
    }).catch((err) => {
      message.error('创建失败')
    })
  }

  //  关闭窗口
  const handleClose = (flag) => {
    onClose(flag)
    reset()
  }

  const renderActions = () => {
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
          onClose={() => handleClose(false)}
          title="创建任务"
          children={renderForm()}
          actions={renderActions()}
      />
  )
}
export default CreateTaskDrawer