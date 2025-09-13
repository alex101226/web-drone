import {useState, useEffect} from 'react';
import {Box, Button, Switch} from '@mui/material'
import { locationStatusFilter } from '@/filters/index.js';
import CustomTable from "@/components/customTable/index.js";
import CustomPagination from '@/components/customPagination/index.jsx';
import { renderCellExpand } from '@/components/CustomCellExpand/index.jsx'
import SaveLogisticsDrawer from './components/saveLogisticsDrawer.jsx'
import LocationDetailsDialog from './components/locationDetailsDialog.jsx'
import { getLogistics, postLogisticsSetting } from '@/services/index.js'
import { useUserStore } from '@/store/index.js'
import {message} from "@/utils/index.js";

//  0=未使用，1=已使用，2=禁用
const CarLogisticsRoute = () => {
  const { userInfo } = useUserStore()

  const isRoot = () => {
    return userInfo?.role_name === 'root'
  }

  const { LOCATION_STATUS_OPTIONS, renderLocationStatus } = locationStatusFilter()
  const getColumn = () => {
    const columns = [
      { headerName: 'ID', field: 'id', flex: 1, minWidth: 80,},
      { headerName: '路线名称', field: 'route_name', renderCell: renderCellExpand, flex: 1, minWidth: 150,},
      { headerName: '出发地', field: 'start_address', renderCell: renderCellExpand, flex: 1, minWidth: 150,},
      { headerName: '到达地', field: 'end_address', flex: 1, minWidth: 150, renderCell: renderCellExpand, },
      { headerName: '总里程（KM）', field: 'distance_km', renderCell: renderCellExpand, flex: 1, minWidth: 150,},
      { headerName: '预计时长（H）', field: 'estimated_time', renderCell: renderCellExpand, flex: 1, minWidth: 150, },
      {
        headerName: '路线状态',
        field: 'status',
        flex: 1, minWidth: 150,
        renderCell: (params) => renderLocationStatus(params.value),
        valueOptions: LOCATION_STATUS_OPTIONS,
      },
      {
        headerName: '操作',
        field: 'action',
        flex: 1, minWidth: 120,
        renderCell: (params) => {
          return <Box>
            <Button onClick={onAction('details', params.row)}>
              查看路线
            </Button>
            <Switch
                checked={params.row.status === '1'}
                label={{inputProps: { 'aria-label': 'Switch demo' } }}
                onChange={() => onSetting(params.row)}
            />
          </Box>
        }
      },
    ]
    return [
      ...columns,
    ]
  }

  //  获取车辆信息
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const fetchLogistics =  (p = 1) => {
    const params = {
      page: p,
      pageSize: 10,
    }
    getLogistics(params).then((res) => {
      if (res.code === 0) {
        setTotal(res.data.total)
        setTotalPages(res.data.totalPages)
        setData(res.data.data)
      }
    })
  }

  useEffect(() => {
    fetchLogistics()
  }, [])

  //  分页查看
  const savePage = (page) => {
    fetchLogistics(page)
    setPage(page)
  }

  //  设置路线可用/禁用
  const onSetting = (row) => {
    const value = row.status === '1' ? '2' : '1'
    const params = {
      logistics_id: row.id,
      status: value
    }
    postLogisticsSetting(params).then(res => {
      if (res.code === 0) {
        message.success(res.message)
        setData((prevData) =>
            prevData.map((item) =>
                item.id === row.id ? { ...item, status: value } : item
            )
        );
      } else {
        message.error(res.message)
      }
    }).catch(err => {
      message.error('操作失败', err)
    })
  }

  //  查看路线
  const [openLocationDialog, setOpenLocationDialog] = useState(false)
  const [record, setRecord] = useState({})
  //  添加路线
  const [open, setOpen] = useState(false)
  const onAction = (type, row) => () => {
    switch (type) {
      case 'add':
        setOpen(true)
        break;
      case 'details':
        setRecord(row)
        setOpenLocationDialog(true)
        break;
    }
  }

  //  操作完，关闭窗口
  const onClose = (flag, type) => {
    if  (flag) {
      fetchLogistics()
    }
    switch (type) {
      case 'add':
        setOpen(false)
        break;
      case 'location':
        setOpenLocationDialog(false)
        break;
    }
  }
  return (
      <Box sx={{ width: '100%' }}>
        { isRoot() && <Button variant="contained" sx={{mb: 2}} onClick={onAction('add', null)}>
          添加路线
        </Button>}

        <Box sx={{ height: 'calc(100vh) - 250px' }}>
          <CustomTable
              tableData={data}
              column={getColumn()}
              rowKeyProp="id"
              hideFooter
              rowHeight={80}
          />
        </Box>
        <CustomPagination
            total={total}
            pageSize={5}
            page={page}
            totalPage={totalPages}
            savePage={savePage}
        />

        <SaveLogisticsDrawer open={open} type="add" onClose={(flag) => onClose(true, 'add')} />

        <LocationDetailsDialog
            open={openLocationDialog}
            data={record}
            onClose={() => onClose(false, 'location')}
        />
      </Box>
  )
}
export default CarLogisticsRoute