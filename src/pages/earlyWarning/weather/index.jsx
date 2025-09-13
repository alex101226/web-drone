import {useState, useEffect} from 'react';
import {Box} from '@mui/material'
import {deviceStatusFilter} from '@/filters';
import CustomTable from '@/components/customTable';
import { renderCellExpand } from '@/components/CustomCellExpand'
import DetailsDrawer from './components/detailsDrawer'
import {genFireDeviceList} from '@/pages/earlyWarning/mock';
import {getHashrateUser} from "@/services/index.js";

const ProjectFireDevice = () => {
  const { FIRE_STATUS_OPTIONS, renderFireStatus } = deviceStatusFilter()
  const getColumn = [
    { headerName: '设备ID', field: 'id', width: 150, renderCell: renderCellExpand },
    { headerName: '设备名称', field: 'name', minWidth: 150, flex: 1, renderCell: renderCellExpand },
    // {headerName: '设备类型', field: 'type', flex: 1,},
    // {headerName: '生产厂家', field: 'manufacturer', flex: 1,},
    {headerName: '设备型号', field: 'model', minWidth: 150, flex: 1, renderCell: renderCellExpand },
    { headerName: '序列号', field: 'serialNumber', minWidth: 150, flex: 1, renderCell: renderCellExpand },
    {headerName: '安装位置', field: 'location', minWidth: 150, flex: 1, renderCell: renderCellExpand},
    // {headerName: '出厂日期', field: 'manufactureDate', flex: 1, renderCell: renderCellExpand},
    // { headerName: '安装日期', field: 'installDate', flex: 1,  renderCell: renderCellExpand },
    { headerName: '所属部门', field: 'department', minWidth: 150, flex: 1, renderCell: renderCellExpand },
    {
      headerName: '设备状态',
      field: 'status',
      width: 150,
      flex: 1,
      valueOptions: FIRE_STATUS_OPTIONS,
      renderCell: (params) => renderFireStatus(params.value),
    },
    { headerName: '负责人', field: 'manager', minWidth: 150, flex: 1, renderCell: renderCellExpand },
    // {
    //   headerName: '操作',
    //   field: 'action',
    //   renderCell: (params) => {
    //     return <Button onClick={() => handleEdit(params.row)}>
    //       查看详情
    //     </Button>
    //   }
    // },
  ]

  const [tableData, setTableData] = useState([])

  const fetchUser = () => {
    const params = {
      page: 1,
      pageSize: 10,
      role_id: 2
    }
    getHashrateUser(params).then((res) => {
      if (res.code === 0) {
        const data = genFireDeviceList(res.data.data, 30)
        setTableData(data)
      }
    })
  }

  useEffect(() => {
    // const data = genFireDeviceList()
    // console.log('data', data)
    // setTableData(data)
    fetchUser()
  }, [])
  const [record, setRecord] = useState({});
  const [open, setOpen] = useState(false);

  const handleEdit = (row) => {
    setRecord(row)
    setOpen(true)
  }
  const onClose = () => {
    setOpen(false)
  }
  return (
      <Box>
        <Box sx={{ height: 'calc(100vh - 150px)' }}>
          <CustomTable
              column={getColumn}
              tableData={tableData}
              rowKeyProp="id"
              hideFooter
          />
        </Box>

        <DetailsDrawer open={open} onClose={onClose} data={record} />
      </Box>
  )
}
export default ProjectFireDevice