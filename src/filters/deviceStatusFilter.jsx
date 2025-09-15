import { renderRadiusContained } from '@/filters';

/**
 * 机巢状态
 * @value status
 * @returns {{NEST_STATUS_OPTIONS: string[], renderNestStatus: ((function(*): (string|*))|*)}}
 * 1: 正常，2: 维护，3: 停用
 */
export const deviceStatusFilter = () => {
  const NEST_STATUS_OPTIONS = ['1', '2', '3']

  //  颜色
  const statusColor = (status) => {
    switch (status) {
      case '2':
        return '#4B70F5';
      case '3':
        return '#EB5B00';
      default:
      case '1':
        return '#1F7D53'
    }
  }

  const renderNestStatus = (value, text) => {
    if (value == null) {
      return '';
    }
    return renderRadiusContained(text)(statusColor(value))()
  }
  return { NEST_STATUS_OPTIONS, renderNestStatus }
}
