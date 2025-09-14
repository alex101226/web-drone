import {useState, useEffect} from 'react';
import {Box, Button} from '@mui/material';
import {renderCellExpand} from '@/components/CustomCellExpand';
import CustomTable from '@/components/customTable'
import CustomPagination from '@/components/customPagination'
import HistoryDataDialog from './components/historyDataDialog';
import {userStatusFilter} from '@/filters';
import {coverDateString} from '@/utils';
import {getUserTraffic} from '@/services'
import PermissionButton from "@/components/permissionButton/index.jsx";

//  这里要根据飞手，查找一下飞手的所有的执飞记录，用dialog弹出
const Pilot = () => {
  const { USER_STATUS_OPTIONS, renderUserStatus } = userStatusFilter()
  const getColumn = [
    { headerName: '人员姓名', field: 'nickname', flex: 1, minWidth: 150 },
    {
      headerName: '工作岗位',
      field: 'office_location',
      flex: 1,
      minWidth: 150,
      renderCell: renderCellExpand,
    },
    {headerName: '当前位置', field: 'location_text', flex: 1,},
    {
      headerName: '账号状态',
      field: 'status',
      flex: 1,
      minWidth: 150,
      options: USER_STATUS_OPTIONS,
      renderCell: (params) => renderUserStatus(params.value),
    },
    {
      headerName: '定位时间',
      field: 'location_time',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => params.value ? coverDateString(params.value, '4') : '--',
    },
    {
      headerName: '',
      field: 'action',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => {
        return <Box>
          <Button onClick={onAction(params.row, 'history')}>历史轨迹</Button>
        </Box>
      }
    },
  ]

  const [tableData, setTableData] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const fetchUserTraffic = (p = 1) => {
    const params = {
      page: p,
      pageSize: 10,
    }
    getUserTraffic(params).then((res) => {
      if (res.code === 0) {
        setTableData(res.data.data)
        setTotal(res.data.total)
        setTableData(res.data.data)
        setTotalPages(res.data.totalPages)
      }
    })
  }

  useEffect(() => {
    fetchUserTraffic()
  }, [])

  const savePage = (page) => {
    setPage(page)
  }

  const [record, setRecord] = useState({});
  const [openHistoryDataDialog, setOpenHistoryDataDialog] = useState(false)
  const [openCurrentPositionDialog, setOpenCurrentPositionDialog] = useState(false)
  const onAction = (row, type) => () => {
    setRecord(row)
    if (type === 'history') {
      setOpenHistoryDataDialog(true)
    } else {
      onPosition(row)
    }
  }

  //关闭窗口
  const onClose = (type) => {
    switch (type) {
      case 'history':
        setOpenHistoryDataDialog(false)
        break
      case 'location':
        setOpenCurrentPositionDialog(false)
        fetchUserTraffic(page)
        break;
    }
  }

  return (
      <Box>
        <PermissionButton module="people" page="pilot" action="create" onClick={() => onAction(params.row, 'add')}>
          添加飞手
        </PermissionButton>
        <Box sx={{ height: 'calc(100vh - 250px)', mt: 2 }}>
          <CustomTable
              tableData={tableData}
              column={getColumn}
              rowKeyProp="user_id"
              hideFooter
          />
        </Box>
        <CustomPagination
            total={total}
            pageSize={5}
            page={page}
            totalPage={totalPages}
            savePage={savePage}
        />


        {/* 历史轨迹  */}
        <HistoryDataDialog
            open={openHistoryDataDialog}
            data={record}
            onClose={() => onClose('history')}
        />

        {/* 当前位置  */}
        {/*<CurrentPositonDialog*/}
        {/*    open={openCurrentPositionDialog}*/}
        {/*    data={record}*/}
        {/*    location={locationText}*/}
        {/*    onClose={() => onClose('location')}*/}
        {/*/>*/}
      </Box>
  )
}
export default Pilot