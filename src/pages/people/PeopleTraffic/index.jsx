import {useState, useEffect} from 'react';
import {Box, Button} from '@mui/material';
import {renderCellExpand} from '@/components/CustomCellExpand';
import CustomTable from '@/components/customTable'
import CustomPagination from '@/components/customPagination'
import HistoryDataDialog from './components/historyDataDialog';
import CurrentPositonDialog from './components/currentPositonDialog'
import {userStatusFilter} from '@/filters';
import {coverDateString, message, randomFactoryLocation, randomCoordinate} from '@/utils';
import {getUserTraffic, postUsrTrafficPositon} from '@/services'

const PeopleTraffic = () => {
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
          <Button onClick={onAction(params.row, 'position')}>一键定位</Button>
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

  //  一键定位  postUsrTrafficPositon
  const [locationText, setLocationText] = useState('')
  const onPosition = (row) => {
    const { lat, lng } = randomCoordinate()
    const params = {
      user_id: row.user_id,
      longitude: lng,
      latitude: lat,
      location_text: randomFactoryLocation(),
    }
    postUsrTrafficPositon(params).then((res) => {
      if (res.code === 0) {
        setLocationText(res.data.location)
        message.success('定位成功')
        setOpenCurrentPositionDialog(true)
      } else {
        message.error(res.message)
      }
    }).catch((err) => {
      message.error('定位失败')
    })
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
        <Box sx={{ height: 'calc(100vh - 150px)' }}>
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
        <CurrentPositonDialog
            open={openCurrentPositionDialog}
            data={record}
            location={locationText}
            onClose={() => onClose('location')}
        />
      </Box>
  )
}
export default PeopleTraffic