import {Box} from '@mui/material';
import { renderRadiusContained } from '@/filters';

export const userStatusFilter = () => {
  const USER_STATUS_OPTIONS = ['1', '2']

  const userStatusProp = (status) => {
    switch (status) {
      case '2':
        return {
          color: 'red',
          text: '停用'
        }
      default:
      case '1':
        return {
          color: 'green',
          text: '正常'
        }
    }
  }

  function renderUserStatus(status) {
    if (!status) {
      return '';
    }
    const { color, text } = userStatusProp(status)
    return (
        <Box>
          { renderRadiusContained(text)(color)(1) }
        </Box>
    )
  }
  return { USER_STATUS_OPTIONS, renderUserStatus }
}

/**
 * 飞手状态
 * @value status
 * @returns {{OPERATOR_STATUS_OPTIONS: string[], renderOperatorStatus: ((function(*): (string|*))|*)}}
 * 1: 正常，2: 维护，3: 停用
 */
export const operatorStatusFilter = () => {
  const OPERATOR_STATUS_OPTIONS = ['1', '2', '3']

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

  const renderOperatorStatus = (value, text) => {
    if (value == null) {
      return '';
    }
    return renderRadiusContained(text)(statusColor(value))()
  }
  return { OPERATOR_STATUS_OPTIONS, renderOperatorStatus }
}