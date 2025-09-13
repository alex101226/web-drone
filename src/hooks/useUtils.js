import {message} from '@/utils'

export const useUtils = () => {
  //  copy
  const onCopy = async (text) => {
    try {
      if (!text) return;
      await navigator.clipboard.writeText(text);
      message.success('复制成功');
    } catch (err) {
      message.error('复制失败');
    }
  }
  return { onCopy }
}