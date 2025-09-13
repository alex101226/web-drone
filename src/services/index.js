import { http } from '@/utils'

//  上传接口
export const uploadFile = async (params) => {
  return await http.upload('/upload', params)
}

//  获取司机信息接口
export const getDrivers = async () => {
  return await http.get('/getDriver')
}


//  添加用户
export const addUser = async (user) => {
  return await http.post('/addUser', user)
}

//  修改用户
export const updateUser = async (data) => {
  return await http.post('/updateUser', data)
}

//  修改密码
export const savePassword = async (data) => {
  return await http.post('/savePassword', data)
}

//  用户登录
export const loginUser = async (data) => {
  return await http.post('/login', data)
}

//  获取登录用户信息
export const getUserInfo = async (params) => {
  return await http.get(`/getUserInfo?userId=${params.userId}`)
}

//  获取用户追踪数据
export const getUserTraffic = async ({ page, pageSize }) => {
  return await http.get(`/getUserTraffic?page=${page}&pageSize=${pageSize}`)
}

//  获取用户追踪----> 历史轨迹数据
export const getUserTrafficHistory = async (id) => {
  return await http.get(`/getUserTrafficHistory?user_id=${id}`)
}

//  用户追踪------> 一键定位  postUsrTrafficPositon
export const postUsrTrafficPositon = async (data) => {
  return await http.post('/postUsrTrafficPositon', data)
}

// 获取算力系统用户信息
export const getHashrateUser = async (params) => {
  return await http.get(`/getUser?page=${params.page}&pageSize=${params.pageSize}&role_id=${params.role_id}`, params)
}

//  获取车辆信息
export const getVehicle = async (params) => {
  return await http.get(`/getVehicle?page=${params.page}&pageSize=${params.pageSize}`, params)
}

//  添加车辆
export const addVehicle = async (data) => {
  return await http.post('/addVehicle', data)
}

//  修改车辆
export const updateVehicle = async (data) => {
  return await http.post('/updateVehicle', data)
}

//  获取可调度的车辆信息
export const getVehicleControl = async ({page, pageSize, status}) => {
  return await http.get(`/getVehicleControl?page=${page}&pageSize=${pageSize}&status=${status}`)
}

//  调度历史记录
export const getVehicleControlHistory = async ({page, pageSize, vehicle_id}) => {
  return await http.get(`/getVehicleControlHistory?page=${page}&pageSize=${pageSize}&vehicle_id=${vehicle_id}`)
}
//  车辆调度
export const postDispatchVehicle = async (params) => {
  return await http.post('/dispatchVehicle', params)
}

//  车辆一键调度
export const postDispatchAllVehicles = async (params) => {
  return await http.post('/dispatchAllVehicles', params)
}

//  获取任务
export const getTasks = async ({page, pageSize}) => {
  return await http.get(`/getTask?page=${page}&pageSize=${pageSize}`)
}

//  创建任务
export const createTask = async (data) => {
  return await http.post('/createTask', data)
}

//  任务统计  taskStats
export const taskStats = async (params) => {
  return await http.get(`/taskStats`)
}
//  获取所有路线
export const getLocations = async () => {
  return await http.get('/getLocations')
}

//  获取路线数据
export const getLogistics = async ({page, pageSize}) => {
  return await http.get(`/getLogistics?page=${page}&pageSize=${pageSize}`)
}

//  添加路线
export const postLogistics = async (data) => {
  return await http.post('/postLogistics', data)
}

//  路线设置可用/禁用 postLogisticsSetting
export const postLogisticsSetting = async (data) => {
  return await http.post('/postLogisticsSetting', data)
}

//  获取车辆运输数据  getTransport
export const getTransport = async () => {
  return await http.get(`/getTransport`)
}

//  查看完整物流路线  getCurrentTransport
export const getCurrentTransport = async (params) => {
  return await http.get(`/getCurrentTransport?route_id=${params.route_id}`)
}

//  电子围栏查询
export const getFences = async ({page, pageSize}) => {
  return await http.get(`/getFences?page=${page}&pageSize=${pageSize}`)
}

//  电子围栏添加
export const addFence = async (data) => {
  return await http.post('/addFence', data)
}