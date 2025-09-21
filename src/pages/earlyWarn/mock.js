import Mock from 'mockjs';
import dayjs from 'dayjs'
import { coverDateString, randomFactoryLocation, randomDate, randomFireUpsStatus, dateRange } from '@/utils'

/**
 * 单个的消防设备数据
 * @returns {*|{Handler: *, Random: *, Util: *, XHR: *, RE: *, toJSONSchema: *, valid: *, heredoc: *, setup: function(*): *, _mocked: {}}}
 */
export const genFireDevice = (user) => {
  const createTime = randomDate(dateRange[0], dateRange[1])

  // 2. 安装时间 = createTime 之前 0~30 天
  const installDate = createTime.subtract(Mock.Random.integer(0, 30), 'day');

  // 3. 出厂时间 = installDate 之前 7~90 天
  const manufactureDate = installDate.subtract(Mock.Random.integer(7, 90), 'day');

  // 4. 修改时间 = createTime 之后 0~180 天
  const updateTime = createTime.add(Mock.Random.integer(0, 180), 'day');

  // 5. 上次检查日期 = 安装日期之后 30~365 天，且不晚于 createTime
  let lastCheckDate = installDate.add(Mock.Random.integer(30, 365), 'day');
  if (lastCheckDate.isAfter(createTime)) {
    lastCheckDate = createTime;
  }
  // 6. 下次检查日期 = 上次检查日期 + 1 年
  const nextCheckDate = lastCheckDate.add(1, 'year');

  // 7. 有效期 = 出厂日期 + (5~10 年)
  const expireDate = manufactureDate.add(Mock.Random.integer(5, 10), 'year');

  return Mock.mock({
    status: randomFireUpsStatus(),  // 当前状态：正常/故障/报警/维护
    manager: user.nickname,  // 责任人
    id: '@natural(100000, 999999)',  // 设备唯一ID
    name: '@pick(["灭火器", "消防栓", "烟感探测器", "喷淋头", "手动报警按钮"])',   // 设备名称（通俗叫法）
    type: '@pick(["extinguisher", "hydrant", "smoke_detector", "sprinkler", "alarm_button"])',  // 设备类型（英文标识，方便程序使用）
    model: '@string("upper", 2)-@integer(100,999)', // 型号，如 AB-421
    manufacturer: '@pick(["海湾安防", "泰和安", "松下", "西门子", "霍尼韦尔"])',  // 生产厂家
    serialNumber: '@string("upper", 8)',  // 出厂序列号
    location: randomFactoryLocation(),   // 安装位置（省市区）
    manufactureDate: coverDateString(manufactureDate, '1'),  //  出厂日期
    installDate: coverDateString(installDate, '1'),  //  安装日期
    lastCheckDate: coverDateString(lastCheckDate, '1'),  //  上次检查日期
    nextCheckDate: coverDateString(nextCheckDate, '1'),  //  下次检查日期
    expireDate: coverDateString(expireDate, '1'),  //  有效期
    createTime: coverDateString(createTime, '4'), //  数据创建时间
    updateTime: coverDateString(updateTime, '4'), //  数据修改时间
    batteryLevel: '@integer(20, 100)', // 电池电量（适用于烟感探测器、报警按钮等）
    pressure: '@float(0.5, 1.5, 2, 2)', // 压力值（适用于灭火器、消防栓）
    department: '@pick(["安保部", "后勤部", "工程部"])', // 所属部门
    phone: /^1[3456789]\d{9}$/, // 联系电话
    remark: '@csentence(5, 15)',  // 备注信息
  });
};

/**
 * 生成消防设备列表
 * @param users
 * @param count
 * @returns {(*|{Handler: *, Random: *, Util: *, XHR: *, RE: *, toJSONSchema: *, valid: *, heredoc: *, setup: (function(*): *), _mocked: {}})[]}
 */
export const genFireDeviceList = (users, count = 10) => {
  // return Array.from({ length: count }, () => genFireDevice(dateRange));
  const arr = []
  const perUps = Math.floor(count / users.length);
  users.forEach((item) => {
    for (let i = 0; i < perUps; i++) {
      arr.push(genFireDevice(item));
    }
  })
  return arr;
};


/**
 * 单个的ups电源数据
 * @returns {{id, name: string, manufacturer: *, type: *, serialNumber: string, power_capacity: string, battery_capacity: string, voltage_input: string, voltage_output: string, status: *, manufactureDate: ((function(*): string)|*), installDate: ((function(*): string)|*), lastCheckDate: ((function(*): string)|*), runtime_remaining: *, location: string, temperature: *, load_percent: *, createTime: ((function(*): string)|*), updateTime: ((function(*): string)|*), manager: *, department: *}}
 */
export const genUPS = (user, id) => {
  const createTime = randomDate(dateRange[0], dateRange[1])

  // 2. 安装时间 = createTime 之前 0~30 天
  const installDate = createTime.subtract(Mock.Random.integer(0, 30), 'day');

  // 3. 出厂时间 = installDate 之前 7~90 天
  const manufactureDate = installDate.subtract(Mock.Random.integer(7, 90), 'day');

  // 4. 修改时间 = createTime 之后 0~180 天
  const updateTime = createTime.add(Mock.Random.integer(0, 180), 'day');

  // 5. 上次检查日期 = 安装日期之后 30~365 天，且不晚于 createTime
  let lastCheckDate = installDate.add(Mock.Random.integer(30, 365), 'day');
  if (lastCheckDate.isAfter(createTime)) {
    lastCheckDate = createTime;
  }
  return {
    id: id + 1, //  设备id
    name: `UPS-${Mock.Random.integer(1000, 9999)}`, //  UPS名称/型号
    manufacturer: Mock.Random.pick(['APC', 'Huawei', 'Eaton', 'Santak', 'Kstar']), //  品牌（APC、华为、山特、科士达、Eaton 等）
    type: Mock.Random.pick(['后备式', '在线互动式', '在线式']),  //  类型（后备式、在线互动式、在线式）
    serialNumber: `${Mock.Random.string('upper', 3)}-${dayjs().format('YYYYMM')}-${Mock.Random.integer(100000, 999999)}`,  // 出厂序列号
    power_capacity: `${Mock.Random.pick([500, 1000, 2000, 5000])} VA`,  //  额定功率（VA 或 kVA）
    battery_capacity: `${Mock.Random.pick([7, 9, 12, 24])} Ah`, //  电池容量（Ah 或 Wh）
    voltage_input: `220V ± ${Mock.Random.pick([10, 20, 30])}%`, //  输入电压范围
    voltage_output: '220V ± 1%',  //  输出电压
    status: randomFireUpsStatus(),               //  运行状态（正常、报警、故障、维护中）
    manufactureDate: coverDateString(manufactureDate, '1'),
    installDate: coverDateString(installDate, '1'), //  安装日期
    lastCheckDate: coverDateString(lastCheckDate, '1'),  //  最近维护日期
    runtime_remaining: Mock.Random.integer(5, 60), // 剩余供电时间（分钟）
    location: randomFactoryLocation(),  //  机房/设备间位置
    temperature: Mock.Random.float(25, 45, 1, 1), //  内部温度（℃）
    load_percent: Mock.Random.integer(10, 95),   //  当前负载百分比
    createTime: coverDateString(createTime, '4'), //  数据创建时间
    updateTime: coverDateString(updateTime, '4'), //  数据修改时间
    manager: user.nickname,
    department: Mock.Random.pick(['IT运维部', '网络安全部', '数据中心部', '财务部', '行政部']),
  };
};

/**
 * 批量生成ups电源数据
 * @param users
 * @param count
 * @returns {{id, name: string, manufacturer: *, type: *, serialNumber: string, power_capacity: string, battery_capacity: string, voltage_input: string, voltage_output: string, status: *, manufactureDate: ((function(*): string)|*), installDate: ((function(*): string)|*), lastCheckDate: ((function(*): string)|*), runtime_remaining: *, location: string, temperature: *, load_percent: *, createTime: ((function(*): string)|*), updateTime: ((function(*): string)|*), manager: *, department: *}[]}
 */
export const genUPSList = (users, count = 10) => {
  // return Array.from({ length: count }, (_, i) => genUPS(i + 1, dateRange));
  const arr = []
  const perUps = Math.floor(count / users.length);
  users.forEach((item) => {
    for (let i = 0; i < perUps; i++) {
      arr.push(genUPS(item, i));
    }
  })
  return arr;
};