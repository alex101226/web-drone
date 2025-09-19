import {useState, useEffect} from 'react';
import {Box} from '@mui/material'
import { locationStatusFilter } from '@/filters/index.js';
import CustomTable from "@/components/customTable/index.js";
import CustomPagination from '@/components/customPagination/index';
import { renderCellExpand } from '@/components/CustomCellExpand/index'
import SaveRouteDrawer from "./components/saveRouteDrawer";
import { getLogistics } from '@/services'
import PermissionButton from "@/components/permissionButton/index.jsx";

//  0=未使用，1=已使用，2=禁用
const CarLogisticsRoute = () => {
  const { LOCATION_STATUS_OPTIONS, renderLocationStatus } = locationStatusFilter()
  const getColumn = () => {
    return [
      { headerName: 'ID', field: 'id', flex: 1, minWidth: 80,},
      { headerName: '路线名称', field: 'route_name', renderCell: renderCellExpand, flex: 1, minWidth: 150,},
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
            <PermissionButton
                module="control"
                page="route"
                action="update"
                type="text"
                onClick={onAction('update', params.row)}>
              修改
            </PermissionButton>

          </Box>
        }
      },
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

  //  查看路线
  const [record, setRecord] = useState({})
  //  添加路线
  const [type, setType] = useState('add')
  const [open, setOpen] = useState(false)
  const onAction = (type, row) => () => {
    setOpen(true)
    setType(type)
    if (type === 'update') {
      setRecord(row)
    }
  }

  //  操作完，关闭窗口
  const onClose = (flag, type) => {
    if  (flag) {
      fetchLogistics()
    }
    setOpen(false)
  }
  return (
      <Box sx={{ width: '100%' }}>
        <PermissionButton
            module="control"
            page="route"
            action="create"
            onClick={onAction('add', null)}>
          添加路线
        </PermissionButton>

        <Box sx={{ height: 'calc(100vh) - 250px', mt: 2 }}>
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
        <SaveRouteDrawer
            open={open}
            type={type}
            data={record}
            onClose={(flag) => onClose(flag)}
        />
        {/*<SaveLogisticsDrawer open={open} type="add" onClose={(flag) => onClose(true, 'add')} />*/}

        {/*<LocationDetailsDialog*/}
        {/*    open={openLocationDialog}*/}
        {/*    data={record}*/}
        {/*    onClose={() => onClose(false, 'location')}*/}
        {/*/>*/}
      </Box>
  )
}
export default CarLogisticsRoute