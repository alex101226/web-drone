import {useState, useEffect} from 'react';
import {Box, Button} from '@mui/material'
import CustomTable from '@/components/customTable'
import { renderCellExpand } from '@/components/CustomCellExpand'
import CustomPagination from '@/components/customPagination'
import DetailsDrawer from './components/detailsDrawer'
import CreateTaskDrawer from './components/createTaskDrawer'
import { hashRateFilter, renderEmptyFilter} from '@/filters';
import { useUserStore } from '@/store'
import { getTasks } from '@/services'
import {coverDateString} from "@/utils/index.js";

const PAGE_SIZE = 10;
const HashrateTaskStatus = () => {
  const { userInfo } = useUserStore()

  const isRoot = () => {
    return userInfo?.role_name === 'root'
  }
  const {TASK_STATUS_OPTIONS, renderTaskStatus} = hashRateFilter()
  const getColumn = [
    { headerName: '序号', field: 'id', minWidth: 80, flex: 1 },
    {
      headerName: '任务名称',
      field: 'task_name',
      flex: 1,
      minWidth: 200,
      renderCell: renderCellExpand,
    },
    {
      headerName: '任务状态',
      field: 'status',
      flex: 1,
      minWidth: 150,
      valueOptions: TASK_STATUS_OPTIONS,
      renderCell: (params) => renderTaskStatus(params.value.toString()),
    },
    {
      headerName: '分区',
      field: 'area',
      minWidth: 100, flex: 1,
    },
    { headerName: 'QOS', field: 'qos', minWidth: 80, flex: 1, },
    { headerName: '节点数', field: 'nodes', minWidth: 80, flex: 1, },
    { headerName: 'CPU核心数', field: 'cpu_number', minWidth: 100, flex: 1, renderCell: renderEmptyFilter },
    { headerName: 'GPU卡数', field: 'gpu_number', minWidth: 100, flex: 1, renderCell: renderEmptyFilter },
    {
      headerName: '计划运行时间',
      field: 'plan_running_time',
      minWidth: 120,
      flex: 1,
      renderCell: renderEmptyFilter
    },
    {
      headerName: '实际运行时间',
      field: 'real_running_time',
      minWidth: 120, flex: 1,
      renderCell: renderEmptyFilter
    },
    {
      headerName: '开始时间',
      field: 'start_time',
      minWidth: 180,
      flex: 1,
      renderCell: (params) => {
        if (!params.value) {
          return renderEmptyFilter(params)
        }
        return renderCellExpand({ ...params, value: coverDateString(params.value, '4') })
      }
    },
    {
      headerName: '结束时间',
      field: 'end_time',
      minWidth: 180, flex: 1,
      renderCell: (params) => {
        if (!params.value) {
          return renderEmptyFilter(params)
        }
        return renderCellExpand({ ...params, value: coverDateString(params.value, '4') })
      }
    },
  ]

  const [rows, setRows] = useState([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const fetchTasks = (p = 1) => {
    const params = {
      page: p,
      pageSize: PAGE_SIZE
    }
    getTasks(params).then((res) => {
      if (res.code === 0) {
        setRows(res.data.data)
        setTotal(res.data.total)
        setTotalPages(res.data.totalPages)
      }
    })
  }
  useEffect(() => {
    fetchTasks()
  }, [])

  const onPage = (page) => {
    setPage(page)
    fetchTasks(page)
  }

  const [record, setRecord] = useState({});
  const [open, setOpen] = useState(false);
  const handleEdit = (row) => {
    setRecord(row)
    setOpen(true)
  }

  const [createOpen, setCreateOpen] = useState(false)
  const handleAdd = () => {
    setCreateOpen(true)
  }

  const onClose = (flag, type) => {
    if (flag) {
      fetchTasks()
    }
    switch (type) {
      case 'create':
        setCreateOpen(false)
        break;
      case 'details':
        setOpen(false)
        break;
    }
  }
  return (
      <Box>
        {
          isRoot() && <Button variant="contained" onClick={handleAdd} sx={{ marginBottom: '20px' }}>
              创建任务
            </Button>
        }
        <Box sx={{ height: 'calc(100vh - 250px)' }}>
          <CustomTable rowKeyProp="id" columns={getColumn} tableData={rows} hideFooter />
        </Box>


        <CustomPagination
            page={page}
            total={total}
            pageSize={PAGE_SIZE}
            totalPage={totalPages}
            savePage={onPage}
        />

        <DetailsDrawer
            data={record}
            open={open}
            onClose={() => onClose(false, 'details')}
        />

        <CreateTaskDrawer open={createOpen} onClose={(flag) => onClose(flag, 'create')} />
      </Box>
  )
}
export default HashrateTaskStatus