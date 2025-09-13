import {useState, useEffect} from 'react';
import {Box} from '@mui/material'
import {renderCellExpand} from '@/components/CustomCellExpand'
import CustomTable from '@/components/customTable'
import DetailsDrawer from './components/detailsDrawer'
import {deviceStatusFilter} from '@/filters';
import { genUPSList } from '../mock'
import {getHashrateUser} from '@/services'

const ProjectUps = () => {

  const { FIRE_STATUS_OPTIONS, renderFireStatus } = deviceStatusFilter()

  const getColumn = [
    // { headerName: '设备ID', field: 'id', flex: 1, renderCell: renderCellExpand },
    { headerName: '设备名称', field: 'name', flex: 1, minWidth: 150, renderCell: renderCellExpand },
    {headerName: '设备类型', field: 'type', flex: 1, minWidth: 150, renderCell: renderCellExpand },
    // {headerName: '生产厂家', field: 'manufacturer', flex: 1,},
    {
      headerName: '序列号',
      field: 'serialNumber',
      flex: 1,
      minWidth: 150,
      renderCell: renderCellExpand ,
    },
    {headerName: '安装位置', field: 'location', flex: 1, minWidth: 150, renderCell: renderCellExpand},
    // {headerName: '出厂日期', field: 'manufactureDate', flex: 1, renderCell: renderCellExpand},
    // { headerName: '安装日期', field: 'installDate', flex: 1,  renderCell: renderCellExpand },
    { headerName: '所属部门', field: 'department', flex: 1, minWidth: 150, renderCell: renderCellExpand },
    {
      headerName: '设备状态',
      field: 'status',
      flex: 1,
      minWidth: 150,
      valueOptions: FIRE_STATUS_OPTIONS,
      renderCell: (params) => renderFireStatus(params.value),
    },
    { headerName: '负责人', field: 'manager', flex: 1, minWidth: 150, renderCell: renderCellExpand },
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
        const data = genUPSList(res.data.data, 30)
        console.log('data', data)
        setTableData(data)
      }
    })
  }

  useEffect(() => {
    // const data = genUPSList()
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
              rowKeyProp="name"
              hideFooter
          />
        </Box>

        <DetailsDrawer open={open} onClose={onClose} data={record} />
      </Box>
  )
}
export default ProjectUps