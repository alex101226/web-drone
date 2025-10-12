import {useState, useEffect} from 'react';
import {Box, Button} from '@mui/material'
import { renderCellExpand } from '@/components/CustomCellExpand'
import { nestStatusFilter } from '@/filters';
import CustomTable from "@/components/customTable";
import PermissionButton from "@/components/permissionButton";
import CustomPagination from '@/components/customPagination'
import SaveNestDialog from './components/saveNestDialog'
import {getNests} from '@/services'
import ReadWeather from "@/pages/device/nest/components/readWeather.jsx";

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
    fetchNest(page)
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
      flex: 1, minWidth: 250,
      renderCell: (params) => {
        return renderCellExpand({...params, value: `${params.row.longitude}, ${params.row.latitude}` })
      }
    },
    {
      headerName: '无人机数量上限（个）',
      field: 'capacity',
      flex: 1, minWidth: 150,
    },
    {
      headerName: '状态',
      field: 'status',
      flex: 1, minWidth: 100,
      valueOptions: NEST_STATUS_OPTIONS,
      renderCell: ({value}) => {
        return renderNestStatus(value)
      }
    },
    {
      headerName: '操作',
      field: 'actions',
      flex: 1, minWidth: 250,
      renderCell: ({ row }) => {
        return <Box>
          <PermissionButton
              module="device"
              page="nest"
              action="update"
              type="text"
              onClick={() => handleAction(row, 'update')}>
            修改
          </PermissionButton>
          <Button type="text" onClick={() => handleAction(row, 'read')}>
            查看
          </Button>
          <Button type="text" onClick={() => handleAction(row, 'weather')}>
            查看气象
          </Button>
        </Box>
      }
    }
  ]

  const [type, setType] = useState('add')
  const [open, setOpen] = useState(false)
  const [record, setRecord] = useState(null)
  const [openWeather, setOpenWeather] = useState(false)
  //  添加,修改机巢
  const handleAction = (row, type) => {
    setType(type)
    setRecord(row)
    if (type !== 'weather') {
      setOpen(true)
    } else {
      setOpenWeather(true)
    }

  }
  const onClose = (type, flag) => {
    if (flag) {
      fetchNest(page)
    }
    if (type === 'weather') {
      setOpenWeather(false)
    } else {
      setOpen(false)
    }
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
            record={record}
            onClose={(flag) => onClose('save', flag)}
        />
        <ReadWeather
            open={openWeather}
            data={record}
            onClose={() => onClose('weather', false)}
        />
      </Box>
  )
}
export default Nest