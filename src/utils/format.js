import dayjs from 'dayjs'

/**
 * 返回时间格式
 * @param str
 * @returns {string}
 */
export const formatDate = (str) => {
  switch (str) {
    case '1':
      return 'YYYY-MM-DD'
    case '2':
      return 'YYYY-MM-DD HH'
    case '3':
      return 'YYYY-MM-DD HH:mm'
    case '4':
      return 'YYYY-MM-DD HH:mm:ss'
    case '5':
      return 'YYYY'
    case '6':
      return 'MM'
    case '7':
      return 'DD'
    case '8':
      return 'YYYY/MM/DD'
    case '9':
      return 'YYYY年MM月DD日'
    case '10':
      return 'YYYY年MM月DD日 HH时mm分ss秒'
    case '11':
      return 'HH'
    default:
      return 'YYYY-MM-DD'
  }
}

/**
 * 返回转换后的时间，返回string
 * @param date
 * @param type
 * @returns {(function(*): (string|string))|*}
 */
export const coverDateString = (date, type = '1') => {
  if (!date) return ''
  return dayjs(date).format(formatDate(type))
}

/**
 * 返回时间对象
 * @param date
 * @param type
 */
export const coverDateObj = (date, type = '1') => {
  if (!date) return dayjs(dayjs(), formatDate(type));
  return dayjs(date, formatDate(type));
}

/**
 * 图片大小，size计算
 * @param image
 * @param size  每个“格子”的宽度/高度单位（像素）
 * @param rows  图片占用多少行（默认 1）
 * @param cols  图片占用多少列（默认 1）
 * @returns {{src: string, srcSet: string}}
 */
export const srcset = (image, size, rows = 1, cols = 1) => {
  return {
    src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format&dpr=2 2x`,
  };
}