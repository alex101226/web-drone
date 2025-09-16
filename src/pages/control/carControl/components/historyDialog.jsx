import {useEffect, useState} from 'react';
import {Box, Button, Typography} from '@mui/material';
import CustomDialog from '@/components/CustomDialog/index.jsx'
import CustomPagination from '@/components/customPagination/index.jsx'
import {renderCellExpand} from '@/components/CustomCellExpand/index.jsx'
import CustomTable from "@/components/customTable/index.js";
import {renderEmptyFilter, dispatchStatusFilter} from '@/filters/index.js'
import {getVehicleControlHistory} from '@/services/index.js'
import {coverDateString} from '@/utils/index.js'


const PAGE_SIZE = 5
const ControlHistoryDialog = (props) => {
  const { onClose, open, data } = props;
  //  关闭按钮
  const handleClose = () => {
    onClose(false)
  }

  const {DISPATCH_STATUS_OPTIONS, renderDispatchStatus} = dispatchStatusFilter()
  const getColumn = () => {
    return [
      { headerName: '车辆名称', field: 'vehicle_alias', flex: 1, minWidth: 150 },
      {
        headerName: '任务调度状态',
        field: 'dispatch_status',
        flex: 1,
        minWidth: 150,
        renderCell: (params) => {
          return renderDispatchStatus( params.value)
        },
        valueOptions: DISPATCH_STATUS_OPTIONS,
      },
      {
        headerName: '路线名称',
        field: 'route_name',
        flex: 1, minWidth: 150,
        renderCell: renderCellExpand
      },
      {
        headerName: '开始时间', field: 'start_time', flex: 1, minWidth: 150,
        renderCell: (params) => {
          const value = coverDateString(params.value, '4')
          return renderEmptyFilter({...params, value})
        }
      },
      {
        headerName: '完成时间', field: 'end_time', flex: 1, minWidth: 150,
        renderCell: (params) => {
          const value = coverDateString(params.value, '4')
          return renderEmptyFilter({...params, value})
        }
      },
      {
        headerName: '司机信息',
        field: 'drivers',
        flex: 2,
        minWidth: 150,
        renderCell: (params) => {
          return (
              <Box component="div" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center',  height: '100%' }}>
                {
                  (params.value || []).map((item, index) => (
                      <Typography
                          key={index}
                          component="p"
                          variant="body2"
                          sx={{ lineHeight: 1.4 }}>
                        {item.name}: {item.phone}
                      </Typography>
                  ))
                }
              </Box>
          )
        },
      },
    ]
  }

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [tableData, setTableData] = useState([]);
  // const fetchHistory = (p = 1) => {
  //   const params = {
  //     page: p,
  //     pageSize: PAGE_SIZE,
  //     vehicle_id: data.id,
  //   }
  //   getVehicleControlHistory(params).then(({ data, code }) => {
  //     if (code === 0) {
  //       setTotalPage(data.totalPages)
  //       setTotal(data.total)
  //       setTableData(data.data)
  //     }
  //   })
  // }
  //
  // useEffect(() => {
  //   if (open) {
  //     fetchHistory()
  //   }
  // }, [open])
  //  分页
  const savePage = (page) => {
    setPage(page)
    fetchHistory(page)
  }
  const renderContent = () => {
    return <Box>
      <CustomTable
          column={getColumn()}
          tableData={tableData}
          rowKeyProp="batch_id"
          rowHeight={90}
          hideFooter
      />
      <CustomPagination
          total={total}
          pageSize={PAGE_SIZE}
          page={page}
          totalPage={totalPage}
          savePage={savePage}
      />
    </Box>
  }

  //  底部
  const renderAction = () => {
    return <Button variant="contained" onClick={handleClose}>
      关闭
    </Button>
  }
  return (
      <CustomDialog
          open={open}
          maxWidth="lg"
          title="历史调度记录"
          content={renderContent()}
          actions={renderAction()}
      />
  )
}
export default ControlHistoryDialog