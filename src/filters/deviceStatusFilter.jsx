import { renderRadiusContained } from '@/filters';

/**
 * 机巢状态
 * @value status
 * @returns {{NEST_STATUS_OPTIONS: number[], renderNestStatus: ((function(*): (number|*))|*)}}
 * 1: 正常，2: 维护，3: 停用
 */
export const nestStatusFilter = () => {
  const NEST_STATUS_OPTIONS = [1, 2, 3]

  //  文案
  const statusText = (status) => {
    switch (status) {
      case 2:
        return '维护'
      case 3:
        return '停用'
      default:
      case 1:
        return '可用'
    }
  }

  //  颜色
  const statusColor = (status) => {
    switch (status) {
      case 2:
        return '#EB5B00';
      case 3:
        return 'grey';
      default:
      case 1:
        return '#1F7D53'
    }
  }

  const renderNestStatus = (value) => {
    if (value == null) {
      return '';
    }
    const color = statusColor(value)
    const text = statusText(value)
    return renderRadiusContained(text)(color)()
  }
  return { NEST_STATUS_OPTIONS, renderNestStatus }
}

/**
 * 无人机状态
 * @value status
 * @returns {{DRONE_STATUS_OPTIONS: number[], renderDroneStatus: ((function(*): (number|*))|*)}}
 * 1: 正常，2: 执行中，3: 维护中, 4: 停用，5: 排队中
 */
export const droneStatusFilter = () => {
  const DRONE_STATUS_OPTIONS = [1, 2, 3, 4, 5]

  //  颜色
  const statusColor = (status) => {
    switch (status) {
      case 2:
        return '#1F7D53';
      case 3:
        return '#B12C00';
      case 5:
        return '#EB5B00';
      case 4:
        return 'grey';
      default:
      case 1:
        return '#4B70F5'
    }
  }

  const renderDroneStatus = (value, text) => {
    if (value == null) {
      return '';
    }
    return renderRadiusContained(text)(statusColor(value))()
  }
  return { DRONE_STATUS_OPTIONS, renderDroneStatus }
}

/**
 * 路线状态
 * 1: 可用, 0: 禁用
 * @returns {{LOCATION_STATUS_OPTIONS: string[], renderLocationStatus: (function(*): *)}}
 */
export const locationStatusFilter = () => {
  const LOCATION_STATUS_OPTIONS = ['1', '0']

//  文案
  const statusText = (status) => {
    switch (status) {
      case '0':
        return '禁用'
      default:
      case '1':
        return '可用'
    }
  }

//  颜色
  const statusColor = (status) => {
    switch (status) {
      case '0':
        return '#8E1616'
      default:
      case '1':
        return '#1F7D53'
    }
  }

//  渲染
  const renderLocationStatus = (status) => {
    if (!status) {
      return ''
    }
    const text = statusText(status)
    const color = statusColor(status)
    return renderRadiusContained(text)(color)(1)
  }

  return { LOCATION_STATUS_OPTIONS, renderLocationStatus }
}

/**
 * 路线是否被使用
 * 1: 已使用, 0: 未使用
 * @returns {{ROUTE_USED_STATUS_OPTIONS: string[], renderRouteUsedStatus: (function(*): *)}}
 */
export const routeUsedStatusFilter = () => {
  //  1=可用 2=禁用
  const ROUTE_USED_STATUS_OPTIONS = ['1', '0']

//  文案
  const statusText = (status) => {
    switch (status) {
      case '1':
        return '已使用'
      default:
      case '0':
        return '未使用'
    }
  }

//  颜色
  const statusColor = (status) => {
    switch (status) {
      case '1':
        return '#8E1616'
      default:
      case '0':
        return '#1F7D53'
    }
  }

//  渲染
  const renderRouteUsedStatus = (status) => {
    if (!status) {
      return ''
    }
    const text = statusText(status)
    const color = statusColor(status)
    return renderRadiusContained(text)(color)(1)
  }

  return { ROUTE_USED_STATUS_OPTIONS, renderRouteUsedStatus }
}

/**
 * 调度任务状态
 * 1: 待执行 2: 执行中，3: 已完成, 4: 异常
 * @returns {{DISPATCH_STATUS_OPTIONS: number[], renderDispatchStatus: ((function(*): (number|*))|*)}}
 */
export const dispatchStatusFilter = () => {
  const DISPATCH_STATUS_OPTIONS = [1, 2, 3, 4]

  //  文案
  const statusText = (status) => {
    switch (status) {
      case 2:
        return '执行中'
      case 3:
        return '已完成'
      case 4:
        return '异常'
      default:
      case 1:
        return '待执行'
    }
  }

  //  颜色
  const statusColor = (status) => {
    switch (status) {
      case 2:
        return '#1F7D53';
      case 3:
        return 'grey';
      case 4:
        return '#B12C00';
      default:
      case 1:
        return '#4B70F5'
    }
  }

  //  渲染
  const renderDispatchStatus = (status) => {
    if (!status) {
      return ''
    }
    const text = statusText(status)
    const color = statusColor(status)

    return renderRadiusContained(text)(color)(1)
  }

  return { DISPATCH_STATUS_OPTIONS, renderDispatchStatus }
}
