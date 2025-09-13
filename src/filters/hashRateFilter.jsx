import {memo} from 'react'
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import InfoIcon from '@mui/icons-material/Info';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import DoneIcon from '@mui/icons-material/Done';
import { STATUS_OPTIONS, StyledChip } from './common'


export const hashRateFilter = () => {
  //  1: 已完成，2: 已取消，3: 运行中，4: 排队中
  const TASK_STATUS_OPTIONS = STATUS_OPTIONS

  //  文案
  const statusText = (status) => {
    switch (status) {
      case '1':
        return '已完成';
      case '2':
        return '已取消';
      case '3':
        return '运行中';
      case '4':
        return '排队中';
      default:
        return '排队中'
    }
  }

//  class
  const taskStatusClass = (status) => {
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

  const TaskStatus = memo((props) => {
    const { status } = props;

    let icon = null;
    if (status === '2') {
      icon = <ReportProblemIcon className="icon" />;
    } else if (status === '4') {
      icon = <InfoIcon className="icon" />;
    } else if (status === '3') {
      icon = <AutorenewIcon className="icon" />;
    } else if (status === '1') {
      icon = <DoneIcon className="icon" />;
    }

    return (
        <StyledChip
            className={taskStatusClass(status)}
            icon={icon}
            size="small"
            label={statusText(status)}
            variant="outlined"
        />
    );
  });

  const renderTaskStatus = (value) =>  {
    if (!value) {
      return '';
    }
    return <TaskStatus status={value} />;
  }
  return { TASK_STATUS_OPTIONS, renderTaskStatus }
}
