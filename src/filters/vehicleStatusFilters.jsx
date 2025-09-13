import { memo } from 'react';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import InfoIcon from '@mui/icons-material/Info';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import DoneIcon from '@mui/icons-material/Done';
import { STATUS_OPTIONS, StyledChip } from './common'
import { renderRadiusContained } from '@/filters'

/**
 * 车辆状态
 * @value status
 * @returns {string}
 * 1: 使用中，2: 故障，3: 维修中, 4: 闲置
 */
export const carStatusFilter = () => {
  const CAR_STATUS_OPTIONS = STATUS_OPTIONS

  const statusText = (status) => {
    switch (status) {
      case '1':
        return '使用中';
      case '2':
        return '故障';
      case '3':
        return '维修中';
      case '4':
        return '闲置';
      default:
        return '使用中'
    }
  }

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

  const CarStatusFilter = memo((props) => {
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

  const renderCarStatus = (value) => {
    if (value == null) {
      return '';
    }
    return <CarStatusFilter status={value} />;
  }

  return { CAR_STATUS_OPTIONS, renderCarStatus }
}


/**
 * 运输状态
 * @value status
 * @returns {string}
 * 1: 运输中，2: 延时，3: 待发车, 4: 已完成
 */
export const transportStatusFilter = () => {
  const TRANSPORT_STATUS_OPTIONS = STATUS_OPTIONS

  const statusText = (status) => {
    switch (status) {
      case '1':
        return '运输中';
      case '2':
        return '延时';
      case '3':
        return '待发车';
      case '4':
        return '已完成';
      default:
        return '已完成'
    }
  }

  //  class
  const statusClass = (status) => {
    switch (status) {
      case '1':
        return 'Open';
      case '2':
        return 'Rejected';
      case '3':
        return 'PartiallyFilled';
      case '4':
        return 'Filled';
      default:
        return 'Filled'
    }
  }

  const LogisticsStatus = memo((props) => {
    const { status } = props;

    let icon = null;
    if (status === '2') {
      //  红色  异常
      icon = <ReportProblemIcon className="icon" />;
    } else if (status === '1') {
      //  蓝色  待机
      icon = <InfoIcon className="icon" />;
    } else if (status === '3') {
      //  橙色  检修
      icon = <AutorenewIcon className="icon" />;
    } else if (status === '4') {
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

  const renderTransportStatus = (value) => {
    if (value == null) {
      return value;
    }
    return <LogisticsStatus status={value} />;
  }
  return { TRANSPORT_STATUS_OPTIONS, renderTransportStatus }
}


/**
 * 路线状态
 * 1: 可用, 2: 禁用
 * @returns {{LOCATION_STATUS_OPTIONS: string[], renderLocationStatus: (function(*): *)}}
 */
export const locationStatusFilter = () => {
  //  1=可用 2=禁用
  const LOCATION_STATUS_OPTIONS = ['1', '2']

//  文案
  const statusText = (status) => {
    switch (status) {
      case '2':
        return '禁用'
      default:
      case '1':
        return '可用'
    }
  }

//  颜色
  const statusColor = (status) => {
    switch (status) {
      case '2':
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
 * 调度任务状态
 * 1: 执行中 2: 空闲，3: 已完成
 * @returns {{DISPATCH_STATUS_OPTIONS: string[], renderDispatchStatus: ((function(*): (string|*))|*)}}
 */
export const dispatchStatusFilter = () => {
  //  1: 执行中 2: 空闲，3: 已完成
  const DISPATCH_STATUS_OPTIONS = ['1', '2', '3']

//  文案
  const statusText = (status) => {
    switch (status) {
      case '1':
        return '执行中'
      case '3':
        return '已完成'
      default:
      case '2':
        return '空闲'
    }
  }

//  颜色
  const statusColor = (status) => {
    switch (status) {
      case '1':
        return '#1F7D53'
      case '3':
        return '#4B70F5'
      default:
      case '2':
        return '#EB5B00'
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


/**
 * 车辆调度状态
 * 1:调度中 2:未调度
 * @returns {{CAR_DISPATCH_STATUS_OPTIONS: string[], renderCarDispatchStatus: ((function(*): (string|*))|*)}}
 */
export const carDispatchStatusFilter = () => {

  const CAR_DISPATCH_STATUS_OPTIONS = ['1', '2']

//  文案
  const statusText = (status) => {
    switch (status) {
      case '1':
        return '调度中'
      default:
      case '2':
        return '未调度'
    }
  }

//  颜色
  const statusColor = (status) => {
    switch (status) {
      case '1':
        return '#255F38'
      default:
      case '2':
        return '#BE3144'
    }
  }

//  渲染
  const renderCarDispatchStatus = (status) => {
    if (!status) {
      return ''
    }
    const text = statusText(status)
    const color = statusColor(status)

    return renderRadiusContained(text)(color)(1)
  }

  return { CAR_DISPATCH_STATUS_OPTIONS, renderCarDispatchStatus }
}
