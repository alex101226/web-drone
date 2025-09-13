import Mock from 'mockjs';

import {
  coverDateString, randomDate, randomName, randomFactoryLocation,
  randomSosStatus, dateRange, getUsageRate} from '@/utils'

// 告警状态
const statuses = ['未处理', '已处理'];

/**
 * 生成随机 SOS 告警单条数据
 * @param i
 * @returns {{id: string, nickname: (string|*), username, user_id, device_type: string, device_id: string, alert_type: string, alert_reason: string, create_time: ((function(*): string)|*), alert_time: ((function(*): string)|*), update_time: ((function(*): string)|*), location: string, status: string, remark: *}}
 */
function generateAlertData(i) {
  //  生成时间
  // 限制任务时间区间
  const createTime = randomDate(dateRange[0], dateRange[1])
  const alertTime = createTime.add(Mock.Random.integer(1, 60), 'minute')
  const updateTime = alertTime.add(Mock.Random.integer(5, 240), 'minute')
  return {
    id: i + 1,
    alert_name: randomName(),
    create_time: coverDateString(createTime, '4'),
    alert_time: coverDateString(alertTime, '4'),
    update_time: coverDateString(updateTime, '4'),
    alert_location: randomFactoryLocation(),
    status: randomSosStatus(),
  }
}

/**
 * 批量生成用户上报的告警数据
 * @param count
 * @returns {*[]}
 */
export const getUserSos = (count = 10) => {
  let allData = [];
  // users.forEach((v) => {
  //   for (let i = 0; i < count; i++) {
  //     allData.push(generateAlertData(v, i));
  //   }
  // });
  // return allData;
  for (let i = 0; i < count; i++) {
    allData.push(generateAlertData(i));
  }
  return allData;
}


// 电子围栏设备列表
const fenceDevices = () => {
  return Mock.Random.pick([
    { device_name: '有害气体区告警', device_model: '越界告警进入', remark: '该区域有高浓度臭氧气体' },
    { device_name: '易燃物品区告警', device_model: '越界告警进入', remark: '该区域有爆炸风险' },
    { device_name: '高压电区告警', device_model: '越界告警进入', remark: '该区域有高压电流' },
  ])
};

// 告警内容列表
const alertContents = [
  '围栏断电',
  '信号异常',
  '设备故障',
  '被外力破坏',
  '通信中断'
];

//  电子围栏分组
export const fenceGroupOptions = [
  {value: '0', label: '全部'},
  {value: '1', label: '一组'},
  {value: '2', label: '二组'}
]
//  电子围栏类型
export const fenceTypeOptions = [
  {value: '1', label: '越界告警进入'},
]
//  电子围栏位置
export const deviceLocationOptions = [
  {value: '1', label: '压缩机厂房'},
  {value: '2', label: '综合生活楼'},
  {value: '3', label: '总变电所'},
  {value: '4', label: '控制室'},
  {value: '5', label: '办公楼'},
  {value: '6', label: '消防泵房'},
]

/**
 * 生成电子围栏告警数据
 * @returns {*[]}
 */
function generateFenceAlerts(i) {
  const device = fenceDevices();
  const status = statuses[Math.floor(Math.random() * statuses.length)];

  //  时间
  const createTime = randomDate(dateRange[0], dateRange[1])
  const alertTime = createTime.add(Mock.Random.integer(1, 60), 'minute')
  const updateTime = alertTime.add(Mock.Random.integer(5, 240), 'minute')

  return {
    id: i + 1,
    device_name: device.device_name,
    device_model: device.device_model,
    location: randomFactoryLocation(),
    remark: device.remark,
    effective_group: '全部',
    status: status,
    create_time: coverDateString(createTime, '4'),
    alert_time: coverDateString(alertTime, '4'),
    update_time: coverDateString(updateTime, '4'),
  }
}

/**
 * 批量生成电子围栏告警数据
 * @param count
 * @returns {*[]}
 */
export const getFenceList = (count = 10) => {
  let allData = [];
  for (let i = 0; i < count; i++) {
    allData.push(generateFenceAlerts(i));
  }
  return allData;
}

//  风险区域名称
const areaNames = ['易燃物品区', '电仪修区', '仓库一号', '冷剂罐区', '仓库2号']
//  风险等级：1: 低风险, 2: 一般风险, 3: 较高风险, 4: 重大风险
const riskLevels = () =>  Mock.Random.pick(['4', '3', '2', '1'])

/**
 * 区域列表风险等级名称
 * @param level
 * @returns {string}
 */
export const riskLevelName = (level) => {
  switch (level) {
    case '2':
      return {
        text: '一般风险',
        color: 'rgb(47, 103, 201)',
      }
    case '3':
      return {
        text: '较高风险',
        color: 'orange',
      }
    case '4':
      return {
        text: '重大风险',
        color: 'red',
      }
    case '1':
    default:
      return {
        text: '低风险',
        color: 'green',
      }
  }
}

/**
 * 区域列表状态
 * @param level
 * @param number
 * @returns {string|string}
 */
export const riskStatus = (level, number) => {
  switch (level) {
    case '2':
      return number >= 20 ? '异常' : '正常'
    case '3':
      return number >= 15 ? '异常' : '正常'
    case '4':
      return number >= 5 ? '异常' : '正常'
    case '1':
    default:
      return '正常'
  }
}


const riskTotal = 30
/**
 * 单挑风险区域数据
 * @param i
 * @returns {{id: *, area_name: string, risk_level: string, people_number: *, risk_status: string}}
 */
export const getArea = (i) => {
  const peopleNumber = Mock.Random.integer(1, riskTotal)
  const risk_level = riskLevels()
  const statusText = riskStatus(risk_level, peopleNumber)
  return {
    id: i + 1,
    area_name: areaNames[i],
    risk_level,
    risks: riskLevelName(risk_level),
    people_number: peopleNumber,
    risk_status: statusText,
    risk_rate: statusText === '正常' ? '0%' : getUsageRate(peopleNumber, riskTotal)
  }
}

/**
 * 生成风险区域列表数据
 * @param count
 * @returns {{id: *, area_name: string, risk_level: string, people_number: *, risk_status: string}[]}
 */
export const getAreaList = (count = 5) => {
  return Array.from({ length: count }, (_, i) => getArea(i))
}

/**
 * 生成风险区域饼图数据
 * @param arr 任务数组
 * @returns {Array}
 */
export const getAreaChartData = (arr) => {
  if (!arr || arr.length === 0) {
    return []
  }
  // 1: 低风险, 2: 一般风险, 3: 较高风险, 4: 重大风险
  const newArr = [
    {
      title: '重大风险',
      // colors: ['#CFCAEE', '#aba2e1'],
      colors: ['#E62727AF', '#E62727'],
      key: '0',
      total: riskTotal,
      used: 0,
      rate: '0',
    },
    {
      title: '较高风险',
      // colors: ['#B0D6DC', '#78BAC3'],
      colors: ['#FE7743AF', '#FE7743'],
      key: '1',
      total: riskTotal,
      used: 0,
      rate: '0',
    },
    {
      title: '一般风险',
      // colors: ['#E4ECABFF', '#D2E269'],
      colors: ['#33A1E0AF', '#33A1E0'],
      key: '2',
      total: riskTotal,
      used: 0,
      rate: '0',
    },
    {
      title: '低风险',
      // colors: ['#E4ECABFF', '#D2E269'],
      colors: ['#77B254AF', '#77B254'],
      key: '3',
      total: riskTotal,
      used: 0,
      rate: '0',
    },
  ]
  arr.forEach((item) => {
    const index = newArr.findIndex((f) => f.title === item.risks?.text)
    if (item.risk_level === '1') {
      newArr[index].used += item.people_number
    } else if (item.risk_level === '2') {
      newArr[index].used += item.people_number
    } else if (item.risk_level === '3') {
      newArr[index].used += item.people_number
    } else if (item.risk_level === '4') {
      newArr[index].used += item.people_number
    }
  })
  return newArr;
}

// 生成24小时折线图数据
export const getYesTodayLineData = (length, count = 30) => {
  return Array.from({ length }).map((_, __, array) => {
    return (array.at(-1) ?? 0) + Mock.Random.integer(0, count)
  })
}


