import {useState, useEffect} from 'react';
import {Box} from '@mui/material'
import { renderCellExpand } from '@/components/CustomCellExpand'
import { nestStatusFilter } from '@/filters';
import CustomTable from "@/components/customTable";
import PermissionButton from "@/components/permissionButton";
import CustomPagination from '@/components/customPagination'
import SaveNestDialog from './components/saveNestDialog'
import {getNests} from '@/services'

const PAGE_SIZE = 10
const Nest = () => {
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const fetchNest = (p = 1) => {
    const params = {
      page: p,
      pageSize: PAGE_SIZE,
    }
    getNests(params).then(({ data, code }) => {
      if (code === 0) {
        setTableData(data.data)
        setTotal(data.total)
        setTotalPages(data.totalPages)
      }
    })
  }

  useEffect(() => {
    fetchNest()
  }, [])

  const savePage = (page) => {
    setPage(page)
  }
  const { NEST_STATUS_OPTIONS, renderNestStatus } = nestStatusFilter()
  const getColumn = [
    {
      headerName: 'ID',
      field: 'id',
      renderCell: renderCellExpand,
      flex: 1, minWidth: 80,
    },
    {
      headerName: '机巢名称',
      field: 'nest_name',
      renderCell: renderCellExpand,
      flex: 1, minWidth: 150,
    },
    {
      headerName: '位置坐标',
      field: 'position',
      flex: 1, minWidth: 150,
      renderCell: ({ row }) => {
        return `${row.longitude}, ${row.latitude}`
      }
    },
    {
      headerName: '无人机数量上限（个）',
      field: 'capacity',
      flex: 1, minWidth: 100,
    },
    {
      headerName: '状态',
      field: 'status',
      flex: 1, minWidth: 100,
      valueOptions: NEST_STATUS_OPTIONS,
      renderCell: ({value, row}) => {
        return renderNestStatus(value, row.status_label)
      }
    },
    {
      headerName: '操作',
      field: 'actions',
      flex: 1, minWidth: 200,
      renderCell: ({ row }) => {
        return <PermissionButton
            module="device"
            page="nest"
            action="update"
            type="text"
            onClick={() => handleAction(row, 'update')}>
          修改
        </PermissionButton>
      }
    }
  ]

  const [type, setType] = useState('add')
  const [open, setOpen] = useState(false)
  const [record, setRecord] = useState(null)

  //  添加,修改机巢
  const handleAction = (row, type) => {
    setType(type)
    setRecord(row)
    setOpen(true)
  }
  const onClose = (flag) => {
    console.log('修改成功后，查看传回来的参数', flag)
    if (flag) {
      fetchNest(page)
    }
    setOpen(false)
  }

  return (
      <Box>
        <PermissionButton module="device" page="nest" action="create" onClick={() => handleAction(null, 'add')}>
          添加机巢
        </PermissionButton>
        <Box sx={{ height: 'calc(100vh - 250px)', mt: 2 }}>
          <CustomTable
              column={getColumn}
              tableData={tableData}
              rowKeyProp="id"
              rowHeight={100}
              hideFooter
          />
        </Box>
        <CustomPagination
            total={total}
            pageSize={PAGE_SIZE}
            page={page}
            totalPage={totalPages}
            savePage={savePage}
        />
        <SaveNestDialog
            open={open}
            type={type}
            data={record}
            onClose={onClose}
        />
      </Box>
  )
}
export default Nest