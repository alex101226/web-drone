import { http } from '@/utils'

//  字典
export const getDict = async ({type}) => {
  return await http.get(`/getDict?type=${type}`)
}
//  上传接口
export const uploadFile = async (params) => {
  return await http.upload('/upload', params)
}

//  无人机巡航区域数据 getRegion
export const getRegion = async () => {
  return await http.get(`/getRegion`)
}
//  站内信
export const getMessage = async () => {
  return await http.get(`/getMessage`)
}

//  站内信已读
export const readMessage = async (params) => {
  return await http.post(`/readMessage`, params)
}

//  获取角色  getRoles
export const getRoles = async () => {
  return await http.get('/getRoles')
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

// 获取算力系统用户信息
export const getHashrateUser = async (params) => {
  return await http.get(`/getUser?page=${params.page}&pageSize=${params.pageSize}&role_id=${params.role_id}`, params)
}

//  获取操控员数据
export const getOperators = async ({ page, pageSize }) => {
  return await http.get(`/getOperators?page=${page}&pageSize=${pageSize}`)
}

//  添加操控员 addOperator
export const addOperator = async (data) => {
  return await http.post('/addOperator', data)
}

//  修改操控员 updateOperator
export const updateOperator = async (data) => {
  return await http.post('/updateOperator', data)
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

//  获取可选区域数据  availableArea
export const availableArea = async (params) => {
  return await http.get(`/availableArea?page=${params.page}&pageSize=${params.pageSize}`)
}

//  添加可选区域   addArea
export const addArea = async (data) => {
  return await http.post('/addArea', data)
}

//  获取所有路线
export const getLocations = async () => {
  return await http.get('/getLocations')
}

//  获取路线数据
export const getLogistics = async ({page, pageSize, route_id}) => {
  return await http.get(`/getLogistics?page=${page}&pageSize=${pageSize}&route_id=${route_id}`)
}

//  添加路线
export const postLogistics = async (data) => {
  return await http.post('/postLogistics', data)
}

//  路线修改
export const postLogisticsSetting = async (data) => {
  return await http.post('/updateLogistics', data)
}

//  查看完整物流路线  getCurrentTransport
export const getCurrentTransport = async (params) => {
  return await http.get(`/getCurrentTransport?route_id=${params.route_id}`)
}

//  机巢查询
export const getNests = async ({page, pageSize}) => {
  return await http.get(`/getNests?page=${page}&pageSize=${pageSize}`)
}

//  机巢添加
export const addNest = async (data) => {
  return await http.post('/addNest', data)
}

//  机巢修改  updateNest
export const updateNest = async (data) => {
  return await http.post('/updateNest', data)
}

//  无人机查询 getDrones
export const getDrones = async ({page, pageSize, operator_id}) => {
  return await http.get(`/getDrones?page=${page}&pageSize=${pageSize}&name=${operator_id}`)
}

//  无人机历史飞行记录查询 droneHistory
export const droneHistory = async (params) => {
  const { page, pageSize, droneId, operatorId } = params
  return http.get(`/droneHistory?page=${page}&pageSize=${pageSize}&droneId=${droneId}&operatorId=${operatorId}`)
}
//  无人机添加
export const addDrone = async (data) => {
  return await http.post('/addDrone', data)
}

//  无人机修改
export const updateDrone = async (data) => {
  return await http.post('/updateDrone', data)
}

//  无人机删除 deleteDrone
export const deleteDrone = async (data) => {
  return await http.post(`/deleteDrone`, data)
}

//  无人机调度 dispatch
export const dispatch = async (data) => {
  return await http.post('/dispatch', data)
}

//	无人机的统计	droneInfoCount
export const droneInfoCount = async () => {
  return await http.get(`/droneInfoCount`)
}

//	统计无人机飞行时长	/api/flight/mileage
export const flightMileageCount = async () => {
  return await http.get(`/flight/mileage`)
}

//	查询所有无人机位置	dronePosition
export const getDronePosition = async () => {
  return await http.get('/dronePosition')
}

//	飞行统计	/flight/count
export const getFlightCount = async () => {
  return await http.get(`/flight/count`)
}

//  一键调度  dispatchBatch
export const dispatchBatch = async (data) => {
  return await http.post('/dispatchBatch', data)
}

//  获取调度记录  getDispatch
export const getDispatch = async (params) => {
  const { page, pageSize, status } = params
  return await http.get(`/getDispatch?page=${page}&pageSize=${pageSize}&status=${status}`)
}

//  获取气象数据  getWeather
export const getWeather = async (params) => {
  return await http.get(`/getWeather?city=${params.city}&type=${params.type}`)
}

//  无人机反制系统数据 getAnti
export const getAnti = async (params) => {
  return await http.get(`/getAnti?page=${params.page}&pageSize=${params.pageSize}`)
}
