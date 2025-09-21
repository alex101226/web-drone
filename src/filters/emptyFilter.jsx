import { renderCellExpand } from '@/components/CustomCellExpand'

export const renderEmptyFilter = (params, expand = true) => {
  if (!params.value) return '--';
  if (expand) {
    return renderCellExpand(params);
  }
  return params.value
}