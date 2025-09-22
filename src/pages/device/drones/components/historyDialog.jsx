import {useEffect, useState} from 'react';
import {Box, Button, Typography} from '@mui/material';
import CustomDialog from '@/components/CustomDialog/index.jsx'
import CustomPagination from '@/components/customPagination/index.jsx'
import {renderCellExpand} from '@/components/CustomCellExpand/index.jsx'
import CustomTable from "@/components/customTable/index.js";
import {renderEmptyFilter} from '@/filters/index.js'
import {droneHistory} from '@/services/index.js'
import {coverDateString} from '@/utils/index.js'


const PAGE_SIZE = 5
const ControlHistoryDialog = (props) => {
  const { onClose, open, data } = props;
  //  关闭按钮
  const handleClose = () => {
    onClose(false)
  }
  const getColumn = () => {
    return [
      { headerName: '无人机名称', field: 'drone_name', flex: 1, minWidth: 150, renderCell: () => data.drone_name },
      {
        headerName: '飞行速度（米/秒）',
        field: 'speed',
        flex: 1,
        minWidth: 150,
        renderCell: renderCellExpand
      },
      {
        headerName: '飞行高度（米）',
        field: 'altitude',
        flex: 1,
        minWidth: 150,
        renderCell: renderCellExpand
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
        headerName: '飞手',
        field: 'operator_name',
        flex: 2,
        minWidth: 150,
        renderCell: renderCellExpand
      },
      {
        headerName: '设备状态',
        field: 'event_label',
        flex: 2,
        minWidth: 150,
        renderCell: renderCellExpand
      },
    ]
  }

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [tableData, setTableData] = useState([]);
  const fetchHistory = (p = 1) => {
    const params = {
      page: p,
      pageSize: PAGE_SIZE,
      droneId: data.id,
      operatorId: data.operator_id,
    }
    droneHistory(params).then(({ data, code }) => {
      if (code === 0) {
        setTotalPage(data.totalPages)
        setTotal(data.total)
        setTableData(data.data)
      }
    })
  }

  useEffect(() => {
    if (open) {
      fetchHistory()
    }
  }, [open])
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
          rowKeyProp="flight_log_id"
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