import { memo } from 'react';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import InfoIcon from '@mui/icons-material/Info';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import DoneIcon from '@mui/icons-material/Done';
import { STATUS_OPTIONS, StyledChip } from './common'

/**
 * 消防设备状态
 * @value status
 * @returns {{FIRE_STATUS_OPTIONS: string[], renderFireStatus: ((function(*): (string|*))|*)}}
 * 1: 正常，2: 故障，3: 维护， 4: 报警
 */
export const deviceStatusFilter = () => {
  const FIRE_STATUS_OPTIONS = STATUS_OPTIONS

  //  当前状态：正常/故障/报警/维护
  const statusText = (status) => {
    switch (status) {
      case '1':
        return '正常';
      case '2':
        return '故障';
      case '3':
        return '维护';
      case '4':
        return '报警';
      default:
        return '正常'
    }
  }

  //  class
  const statusClass = (status) => {
    switch (status) {
      case '1':
        return 'Filled';
      case '2':
        return 'Rejected';
      case '3':
        return 'PartiallyFilled';
      case '4':
        return 'Open';
      default:
        return 'Filled'
    }
  }

  const FireStatus = memo((props) => {
    const { status } = props;

    let icon = null;
    if (status === '2') {
      //  红色  异常
      icon = <ReportProblemIcon className="icon" />;
    } else if (status === '4') {
      //  蓝色  待机
      icon = <InfoIcon className="icon" />;
    } else if (status === '3') {
      //  橙色  检修
      icon = <AutorenewIcon className="icon" />;
    } else if (status === '1') {
      //  绿色  正常
      icon = <DoneIcon className="icon" />;
    }

    return (
        <StyledChip
            className={statusClass(status)}
            icon={icon}
            size="small"
            label={statusText(status)}
            variant="outlined"
        />
    );
  });

  const renderFireStatus = (value) => {
    if (value == null) {
      return '';
    }
    return <FireStatus status={value} />;
  }
  return { FIRE_STATUS_OPTIONS, renderFireStatus }
}
