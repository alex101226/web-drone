/**
 * 转数字
 * @param num
 * @returns {number}
 */
export const transNumber = (num) => {
  if (!num) {
    return 0
  }
  return parseInt(num, 10)
}