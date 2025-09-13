import { renderCellExpand } from '@/components/CustomCellExpand'

export const renderEmptyFilter = (params) => {
  if (!params.value) return '--';
  return renderCellExpand(params);
}