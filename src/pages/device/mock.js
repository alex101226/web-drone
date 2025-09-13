import Mock from 'mockjs';
import dayjs from 'dayjs';
import {coverDateString, randomCoordinate, randomDate} from '@/utils'

// 定义一些常见的货物名称池
//  运输：化工原料
const cargoNames = [
  '钢材', '木材', '塑料颗粒', '化工原料',
  '电子元件', '汽车零件', '纺织品',
  '食品饮料', '日用品', '机械设备',
  '纸制品', '玻璃制品', '家用电器'
];

/**
 * 随机生成货物
 */
function genCargoes() {
  const count = Mock.Random.integer(1, 5);
  return Array.from({ length: count }).map(() => {
    return {
      cargo_id: `CARGO-${Mock.Random.integer(1000, 9999)}`, // 货物ID
      name: '化工原料', // 货物名称
      weight: Mock.Random.float(0.5, 20, 1, 2), // 重量（吨）
      volume: Mock.Random.float(0.1, 10, 1, 2), // 体积（立方）
      order_id: `ORD-${Mock.Random.integer(100000, 999999)}` // 所属订单ID
    };
  });
}

/**
 * 生成任务时间链
 */
function genTaskTimes(dateRange) {
  // const [start, end] = dateRange.map(d => dayjs(d));
  // // 创建时间（范围内随机）
  // const createTime = dayjs(Mock.Random.date('yyyy-MM-dd')).isBetween(start, end, null, '[]')
  //     ? dayjs(Mock.Random.date('yyyy-MM-dd'))
  //     : start.add(Mock.Random.integer(0, end.diff(start, 'day')), 'day');
  const createTime = randomDate(dateRange[0], dateRange[1]);

  // 发车时间 >= 创建时间
  const startTime = createTime.add(Mock.Random.integer(0, 5), 'day');

  // 到达时间 >= 发车时间
  const endTime = startTime.add(Mock.Random.integer(1, 10), 'day');

  return { createTime, startTime, endTime };
}

/**
 * 静态路线数据，每条包含起点-中转点-终点
 */
const locationDetail = {
  medium: [
    [
      '广州市白云区太和镇华南物流园',
      '东莞市南城区创意科技园',
      '深圳市南山区科技园南区创新大厦'
    ],
    [
      '佛山市顺德区大良街道顺丰工业区',
      '中山市火炬开发区物流中转站',
      '珠海市香洲区前山货运中心'
    ],
  ],
  long: [
    [
      '广州市白云区太和镇华南物流园',
      '广西南宁市江南区南宁物流园',
      '广西百色市右江区百色货运中心',
      '云南省昆明市官渡区昆明国际物流园'
    ],
    [
      '深圳市宝安区西乡街道宝安物流中心',
      '湖南省长沙市雨花区高桥仓储中心',
      '湖北省武汉市东西湖区吴家山物流园',
      '河南省郑州市金水区中原货运中心'
    ],
  ]
};

/**
 * 随机生成路线
 */
function genRoute() {
  // 随机选路线类型
  const type = Mock.Random.pick(['medium', 'long']);
  // 随机选一条路线
  return Mock.Random.pick(locationDetail[type]);
}

/**
 * 生成历史物流任务
 * @param vehicle
 * @returns {*|{Handler: *, Random: *, Util: *, XHR: *, RE: *, toJSONSchema: *, valid: *, heredoc: *, setup: function(*): *, _mocked: {}}}
 */
const historyLogisticsTasks = (vehicle) => {
  const { createTime, startTime, endTime } = genTaskTimes(['2025-05-01', '2025-05-30']);

  //  货物，订单
  const cargoes = genCargoes();
  const order_ids = cargoes.map(c => c.order_id);

  // ---------------- 路线规划  // 路线包含 3-4 个点 ----------------
  const plannedRoute = genRoute();
  // 已走过的轨迹
  const { lat, lng } = randomCoordinate()
  const actual_route = plannedRoute.slice(0, plannedRoute.length).map((city, idx) => ({
    lat,
    lng,
    city,
    timestamp: startTime.add(idx * Mock.Random.integer(1, 3), 'hour').toISOString()
  }));

  let current_location =  actual_route.at(-1).city; // 默认是起点

  return Mock.mock({
    // ========== 基本关联信息 ==========
    id: '@guid', // 任务内部ID（唯一标识）
    task_id: `ORD-${dayjs().format('YYYYMMDD')}-${Mock.Random.integer(100, 999)}`, // 任务编号
    vehicle_id: vehicle.id, // 车辆ID
    plate_number: vehicle.plate_number, // 车牌号
    department: vehicle.department, // 所属部门
    operator_nickname: vehicle.operator_nickname, // 车辆管理员昵称

    // ========== 司机信息 ==========
    driver_name: Mock.Random.cname(), // 司机姓名
    driver_phone: Mock.mock(/^1[3-9]\d{9}$/), // 司机手机号
    driver_gender: Mock.Random.pick(['男', '女']), // 性别
    driver_age: Mock.Random.integer(22, 60), // 年龄

    // ========== 货物与订单 ==========
    cargoes: '化工原料', // 货物列表
    order_ids, // 订单ID集合

    // ========== 路线与位置 ==========
    start_location: plannedRoute[0],
    end_location: plannedRoute.at(-1),
    planned_route: plannedRoute,
    actual_route, // 实际路线（有GPS点）
    current_location,   // 当前所在位置

    // ========== 状态与时间链 ==========
    status: '4', // 已完成
    create_time: coverDateString(createTime, '4'), // 创建时间
    start_time: coverDateString(startTime, '4'), // 开始时间
    end_time: coverDateString(endTime, '4'), // 完成时间
    update_time: coverDateString(endTime, '4') // 更新时间
  })
}


/**
 * 生成当前运输/延时/待发车任务
 * @param transport
 * @returns {*|{Handler: *, Random: *, Util: *, XHR: *, RE: *, toJSONSchema: *, valid: *, heredoc: *, setup: function(*): *, _mocked: {}}}
 */
const currentLogisticsTasks = (transport) => {
  //  货物，订单
  const cargoes = genCargoes();
  const order_ids = cargoes.map(c => c.order_id);


  return {
    id: transport.batch_id, // 当前任务ID
    task_id: `ORD-${dayjs().format('YYYYMMDD')}-${Mock.Random.integer(100, 999)}`, // 任务编号
    transport_id: transport.id, // 车辆ID
    // 司机信息
    driver_name: Mock.Random.cname(), // 姓名
    driver_phone: Mock.mock(/^1[3-9]\d{9}$/), // 电话
    driver_gender: Mock.Random.pick(['男', '女']), // 性别
    driver_age: Mock.Random.integer(22, 60), // 年龄

    // 货物/订单
    cargoes: '化工原料',
    order_ids,

    start_location: transport.start_address,  //  起点
    end_location: transport.end_address,  //  目的地

    // 状态/时间
    status: transport.transport_status, // 当前任务状态
    start_time: coverDateString(transport.start_time, '4'), //  发车时间
    expected_end_time: transport.expected_end_time ? coverDateString(transport.expected_end_time, '4') : '--', //  预计到达时间
    end_time: transport.end_time ? coverDateString(transport.end_time, '4') : '--', //  实际到达时间
    drivers: transport.drivers,
    route_id: transport.route_id,
  }
}

/**
 * 生成所有车辆的物流数据
 * @param transport
 * @param totalHistory
 * @returns {*[]}
 */
export function genAllLogistics(transport, totalHistory = 10) {
  // let allTasks = [];
  // // 1. 每辆车生成1条当前任务
  // const currentTasks = transport.map(v => currentLogisticsTasks(v));
  // allTasks = allTasks.concat(currentTasks);
  //
  // const perVehicle = Math.floor(totalHistory / vehicles.length);
  // transport.forEach((v) => {
  //   for (let i = 0; i < perVehicle; i++) {
  //     allTasks.push(historyLogisticsTasks(v));
  //   }
  // });
  // return allTasks;
  return transport.map(v => currentLogisticsTasks(v))
}
