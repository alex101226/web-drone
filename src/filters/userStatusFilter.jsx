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