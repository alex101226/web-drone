import Mock from 'mockjs';
import dayjs from 'dayjs'

import duration from 'dayjs/plugin/duration'
import utc from 'dayjs/plugin/utc'

dayjs.extend(duration)
dayjs.extend(utc)

import { transNumber } from '@/utils'


export const dateRange = ['2025-05-01', '2025-06-30']

/**
 * 生成一个随机的 dayjs 时间，限定在某个区间
 */
export const randomDate = (start, end) => {
  const startTime = dayjs(start).valueOf()
  const endTime = dayjs(end).valueOf()
  const ts = Mock.Random.integer(startTime, endTime)
  return dayjs(ts)
}

/**
 * 生成带市区随机的详细位置
 * ps: 安徽省 淮北市 相山区 白过速路82号 国际大厦 3层 112室
 * @returns {`${*} ${*}路${*}号 ${string} ${string} ${string}`}
 */
export const randomLocation = () => {
  const building = Mock.Random.pick(['国际大厦', '科技园', '写字楼A座', '实验楼', '教学楼']);
  const floor = Mock.Random.integer(1, 20) + '层';
  const room = Mock.Random.integer(100, 999) + '室';
  return `${Mock.Random.county(true)} ${Mock.Random.ctitle(2, 4)}路${Mock.Random.integer(1, 200)}号 ${building} ${floor} ${room}`;
}


/**
 * 生成随机的详细位置
 */
export const randomFactoryLocation = () => {
  return Mock.Random.pick(['消防泵房', '压缩机厂房', '综合生活楼', '总变电所', '控制室', '办公楼']);
}


/**
 * 算力系统，任务状态
 * @returns {string}
 */
export const randomStatus = () => {
  return Mock.Random.pick(['1', '1', '1', '1', '1', '1', '1', '2', '3', '4'])
}

/**
 * 随机生成状消防，电源状态
 * @returns {string}  当前状态：正常/故障/维护
 */
export const randomFireUpsStatus = () => {
  return Mock.Random.pick(['1','1','1','1','1', '1', '1', '2', '3','3']);
}

export const randomSosStatus = () => {
  return Mock.Random.pick(['已处理','已处理','已处理','已处理','已处理', '已处理', '已处理', '未处理', '未处理','未处理']);
}
/**
 * 生成随机备注
 * @returns {*}
 */
export const randomRemark = () => {
  const remark = Mock.Random.cparagraph(1, 1); // 生成一段随机中文
  return remark.length > 15 ? remark.slice(0, 15) : remark;
}

/**
 * 生成随机的人名
 */
export const randomName = () => {
  return Mock.Random.cname();
};

export const randomCoordinate = () => {
  return {
    lat: Mock.Random.float(22.5, 23.5, 2, 2),
    lng: Mock.Random.float(113.5, 114.5, 2, 2),
  }
}


/**
 * 计算百分比
 * @param used  已使用
 * @param total 总数
 * @returns {string|string}
 */
export const getUsageRate = (used, total) => {
  const u = transNumber(used)
  const t = transNumber(total)
  return total === 0 ? '0%' : (u / t * 100).toFixed(1) + '%'
}