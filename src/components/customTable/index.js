import {DataGrid} from "@mui/x-data-grid";

const CustomTable = (props) => {
  const {
    column, tableData, rowKeyProp, hideFooter=false,
    hidePagination = false, ...resetProps } = props
  /**
   *
   * disableColumnMenu 禁止列菜单
   * disableColumnSorting 禁用排序功能
   * disableRowSelectionOnClick 禁用单击行或单元格的选择
   * hideFooter 隐藏底部
   */

  return (
      <DataGrid
          disableColumnMenu
          disableColumnSorting
          disableRowSelectionOnClick
          getRowId={(row) => row[rowKeyProp]}
          columns={column}
          rows={tableData}
          hideFooter={hideFooter}
          hideFooterPagination
          { ...resetProps }
      />
  )
}
export default CustomTable;