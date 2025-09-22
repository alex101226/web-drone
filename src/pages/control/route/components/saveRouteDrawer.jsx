import React, {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {
  Box, AppBar, Button, Toolbar, Divider, FormControl,
  FormHelperText, InputLabel, OutlinedInput, styled, Switch, FormControlLabel
} from "@mui/material";
import CustomDrawer from "@/components/customDrawer";
import MapGL3D from '@/components/mapGL3D'
import { postLogistics, postLogisticsSetting } from '@/services'
import {message} from "@/utils/index.js";

const initialState = {
  status: '1',
  route_name: '',
  remark: '',
  expect_complete_time: '1',
  points: []
}

const InputHelp = styled(FormHelperText)({
  height: '20px'
})
const SaveRouteDrawer = props => {
  const { open, onClose, type, data } = props;
  const isAdd = () =>  type === 'add';

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
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
      }
      reset(params)
    }
  }, [data, open])

  const status = watch('status')
  const points = watch('points')
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
  const onUpdate = (data) => {
    if (loading) return false;
    const params = {
      ...data,
    }
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

  //  底部按钮
  const renderActions = () => {
    return (
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
        </AppBar>
    )
  }

  //  查看地图
  const savePosition = (data) => {
    setValue('points', data)
  }

  const changeStatus = (event) => {
    const value = event.target.checked
    setValue('status', value ? '1' : '0')
  }
  //  内容
  const renderContent = () => {
    return (
        <Box component="form" sx={{ flex: 1 }}>
          <FormControl fullWidth error={!!errors.route_name} margin="normal">
            <InputLabel htmlFor="route_name">路线名称</InputLabel>
            <OutlinedInput
                label="路线名称"
                id="route_name"
                aria-describedby="route_name-helper-text"
                {...register("route_name", {
                  required: '请输入路线名称',
                })}
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
            />
            <InputHelp id="remark-helper-text">
              {errors.remark?.message}
            </InputHelp>
          </FormControl>
          <Box sx={{height: '500px'}}>
            <MapGL3D multiple data={points || []} savePosition={savePosition} />
          </Box>
        </Box>
    )
  }
  return (
      <CustomDrawer
          open={open}
          title={isAdd() ? '添加路线' : '修改路线'}
          w={100}
          onClose={() => handleClose(false)}
          anchor="top"
          actions={renderActions()}
          children={renderContent()}
      />
  )
}
export default SaveRouteDrawer