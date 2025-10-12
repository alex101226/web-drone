import { useState, useEffect } from 'react';
import {Box, Button} from '@mui/material';
import CustomTable from "@/components/customTable";
import {renderCellExpand} from "@/components/CustomCellExpand";
import PermissionButton from "@/components/permissionButton";
import SaveAreaDrawer from "./components/saveAreaDrawer";
import CustomPagination from "@/components/customPagination";
import { availableArea } from "@/services";

const PAGE_SIZE = 10
const Area = () => {
  const getColumn = [
    { headerName: '序号', field: 'id', flex: 1, minWidth: 70, renderCell: renderCellExpand },
    { headerName: '区域名称', field: 'zone_name', flex: 1, minWidth: 200 },
    { headerName: '可选区域半径（米）', field: 'radius', flex: 1, minWidth: 200 },
    {
      headerName: '经纬度',
      field: 'position',
      flex: 1, minWidth: 250,
      renderCell: (params) => {
        return renderCellExpand({ ...params, value: `${params.row.center_lng}, ${params.row.center_lat}`})
      }
    },
    {
      headerName: '操作',
      field: 'actions',
      flex: 1, minWidth: 200,
      renderCell: ({ row }) => {
        return <Button type="text" onClick={onAction('read', row)}>查看</Button>
      }
    }
  ]
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [total, setTotal] = useState(0)
  const fetchArea = (p = 1) => {
    setLoading(true)
    const params = {
      page: p,
      pageSize: PAGE_SIZE
    }
    availableArea(params).then(res => {
      if (res.code === 0) {
        setTableData(res.data.data)
        setTotalPages(res.data.totalPages)
        setTotal(res.data.total)
      }
      setLoading(false)
    }).catch(err => {
      setLoading(false)
    })
  }
  useEffect(() => {
    fetchArea()
  }, [])

  const onPage = (page) => {
    setPage(page)
    fetchArea(page)
  }

  const [record, setRecord] = useState({})
  const [type, setType] = useState('add')
  const [open, setOpen] = useState(false)
  const onAction = (type, row) => () => {
    setType(type)
    setRecord(row)
    setOpen(true)
  }

  const onClose = (flag) => {
    if (flag) {
      fetchArea(page)
    }
    setOpen(false)
  }
  return (
      <Box>
        <PermissionButton
            module="control"
            page="area"
            action="create"
            onClick={onAction('add', null)}>
          添加区域
        </PermissionButton>
        <Box sx={{ height: 'calc(100vh - 250px)', mt: 2 }}>
          <CustomTable
              loading={loading}
              column={getColumn}
              tableData={tableData}
              rowKeyProp="id"
              rowHeight={80}
              hideFooter
          />
        </Box>

        <CustomPagination
            page={page}
            total={total}
            pageSize={PAGE_SIZE}
            totalPage={totalPages}
            savePage={onPage}
        />

        <SaveAreaDrawer
            open={open}
            onClose={onClose}
            data={record}
            type={type}
        />
      </Box>
  )
}
export default Area