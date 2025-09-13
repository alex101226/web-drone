import Mock from 'mockjs'
import dayjs from 'dayjs'
import {randomDate, coverDateString, randomStatus, getUsageRate, transNumber} from '@/utils'


// 随机生成日期范围（在某个月份内）
function randomDateRange(month) {
  const year = 2025
  const startDay = Mock.Random.integer(1, 20) // 开始日 1~20
  const range = Mock.Random.integer(3, 7)     // 持续 3~7 天
  const endDay = Math.min(startDay + range, month === 8 ? 31 : 30)

  return {
    start: dayjs(`${year}-${month}-${String(startDay).padStart(2, '0')}`),
    end: dayjs(`${year}-${month}-${String(endDay).padStart(2, '0')}`)
  }
}

/**
 * 生成单个任务
 * 任务状态1: 已完成，2: 运行中，3: 排队中，4: 已取消
 * @param id
 * @param dateRange
 * @returns {{id, taskName: string, parentCluster: string, parentType: string, username: *, region: *, qos: string, status: *, createTime: string, startTime: string, endTime: (string|string), runTime: (string|null), timeLimit: string, remark: (string|*), nodes: *, cpuCores: *, gpuCards: (*|number)}}
 */
export const genTask = (id, dateRange = ['2025-05-01', '2025-06-30']) => {
  const clusterId = Mock.Random.integer(1, 5)
  const status = randomStatus()
  const account = Mock.Random.pick(['zhangsan', 'lisi'])
  const region = Mock.Random.pick(['compute', 'gpu'])

  // 限制任务时间区间
  const createTime = randomDate(dateRange[0], dateRange[1])
  const startTime = createTime.add(Mock.Random.integer(1, 60), 'minute')
  const endTime = startTime.add(Mock.Random.integer(5, 240), 'minute')

  let runTime = null
  if (status === '1' || status === '4') {
    runTime = endTime.diff(startTime, 'second')
  } else if (status === '2') {
    runTime = dayjs().diff(startTime, 'second')
  }

  // 资源数据（都在 1~10 内）
  const nodes = Mock.Random.integer(1, 10)
  const cpuCores = Mock.Random.integer(1, 10)
  const gpuCards = region === 'gpu' ? Mock.Random.integer(1, 10) : 0

  // 使用数据（保证 ≤ 总数）
  const usedNodes = Mock.Random.integer(0, nodes)
  const usedCpuCores = Mock.Random.integer(0, cpuCores)
  const usedGpuCards = gpuCards > 0 ? Mock.Random.integer(0, gpuCards) : 0

  // 任务名称 = 日期区间 + "车辆路线/车辆负载"
  const taskType = Mock.Random.pick(['车辆路线', '车辆负载'])
  const taskName = `${taskType} ${coverDateString(createTime, '9')}`

  return {
    id: id,
    taskName,
    parentCluster: `演示集群${clusterId}`,
    parentType: String(clusterId),
    username: account,
    region,
    qos: 'normal',
    status,
    createTime: coverDateString(createTime, '4'),
    startTime: coverDateString(startTime, '4'),
    endTime: (status === '3') ? '-' : coverDateString(endTime, '4'),
    runTime: runTime ? dayjs.unix(runTime).utc().format('HH:mm:ss') : null,
    timeLimit: dayjs.unix(Mock.Random.integer(3600, 7200)).utc().format('HH:mm:ss'),
    remark: Mock.Random.csentence(5, 12),
    // 新增资源字段（1~10）
    nodes,
    cpuCores,
    gpuCards,
    // 使用数
    usedNodes,
    usedCpuCores,
    usedGpuCards,
  }
}

/**
 * 生成任务列表
 * @param count
 * @param dateRange
 * @returns {{id: *, taskName: string, parentCluster: string, parentType: string, username: *, region: *, qos: string, status: *, createTime: string, startTime: string, endTime: string|string, runTime: *|string|null, timeLimit: *|string, remark: *, nodes: *, cpuCores: *, gpuCards: *|number}[]}
 */
export const genTasks = (count = 10, dateRange = ['2025-05-01', '2025-06-30']) => {
  return Array.from({ length: count }, (_, i) => genTask(i + 1, dateRange))
}

/**
 * 生成上级集群数据 (1~5)
 * @param list 任务列表数据
 * @returns {Array<{key: string, label: string, id: number, children: any[]}>}
 */
export const genClusters = (list) => {
  // 生成上级集群（1~5）
  return Array.from({ length: 5 }, (_, i) => {
    const key = String(i + 1)
    return {
      key,
      label: `演示集群${key}`,
      id: i + 1,
      children: list.filter(task => task.parentType === key),
    }
  })
}

/**
 * 汇总任务数据，用于饼图
 * @returns {Array}
 * @param data
 */
export const getTaskChartData = (data) => {

  if (!data || Object.keys(data).length === 0) {
    return []
  }

  // let nodeCount = 0, usedNodeCount = 0
  // let cpuCount = 0, usedCpuCount = 0
  // let gpuCount = 0, usedGpuCount = 0
  // let runningTaskCount = 0, pendingTaskCount = 0
  //
  // arr.forEach((task) => {
  //   nodeCount += task.nodes
  //   usedNodeCount += task.usedNodes
  //
  //   cpuCount += task.cpuCores
  //   usedCpuCount += task.usedCpuCores
  //
  //   gpuCount += task.gpuCards
  //   usedGpuCount += task.usedGpuCards
  //
  //   if (task.status === '3') runningTaskCount++   // 运行中
  //   if (task.status === '4') pendingTaskCount++   // 排队中
  // })

  //  gpu
  const used_gpu = transNumber(data.used_gpu)
  const total_gpu = transNumber(data.total_gpu)
  const no_used_gpu = total_gpu - used_gpu

  //  节点
  const used_nodes = transNumber(data.used_nodes)
  const total_nodes = transNumber(data.total_nodes)
  const no_used_nodes = total_nodes - used_nodes

  //  cpu
  const used_cpu = transNumber(data.used_cpu)
  const total_cpu = transNumber(data.total_cpu)
  const no_used_cpu = total_cpu - used_cpu

  return [
    {
      title: '节点',
      subTitle: '总数',
      used: used_nodes,
      total: total_nodes,
      colors: ['#CFCAEE', '#aba2e1'],
      key: '0',
      seriesData: [
        {
          value: no_used_nodes,
          label: '空闲',
          rate: getUsageRate(no_used_nodes, total_nodes)
        },
        {
          value: used_nodes,
          label: '已使用',
          rate: getUsageRate(used_nodes, total_nodes)
        },
      ]
    },
    {
      title: 'CPU',
      subTitle: '总核心数',
      used: used_cpu,
      total: total_cpu,
      colors: ['#B0D6DC', '#78BAC3'],
      key: '1',
      seriesData: [
        {
          value: no_used_cpu,
          label: '空闲',
          rate: getUsageRate(used_cpu, total_cpu)
        },
        {
          value: used_cpu,
          label: '已使用',
          rate: getUsageRate(used_cpu, total_cpu)
        },
      ]
    },
    {
      title: 'GPU',
      subTitle: '总卡数',
      used: used_gpu,
      total: total_gpu,
      colors: ['#E4ECABFF', '#D2E269'],
      key: '2',
      seriesData: [
        {
          value: no_used_gpu,
          label: '空闲',
          rate: getUsageRate(no_used_gpu, total_gpu)
        },
        {
          value: used_gpu,
          label: '已使用',
          rate: getUsageRate(used_gpu, total_gpu)
        },
      ]
    },
    {
      title: '任务',
      subTitle: '',
      running: data.running_tasks,
      pending: data.queued_tasks,
      colors: ['#CFCAEE', '#aba2e1'],
      key: '3',
    },
  ]
}

