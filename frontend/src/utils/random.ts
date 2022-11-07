/** 获取指定范围内的整数随机数 */
export const getIntRandom = (max: number, min = 0) => {
  return Math.floor(Math.random() * (max - min) + min)
}
