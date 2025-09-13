import {useEffect, useState} from 'react';
import {Box, Button} from '@mui/material'
import CustomTable from '@/components/customTable'
import CustomPagination from '@/components/customPagination'
import {renderCellExpand} from '@/components/CustomCellExpand'
import SaveFenceDialog from './components/saveFenceDialog'
import {getFences} from '@/services'
import {fenceGroupOptions,fenceTypeOptions,deviceLocationOptions} from '../mock'
import {renderEmptyFilter} from "@/filters/index.js";

const PAGE_SIZE = 10;
const PeopleWarn = () => {
  const getColumn = [
    { headerName: '序号', field: 'id', flex: 0.5, minWidth: 80 },
    { headerName: '围栏名称', field: 'fence_name', flex: 1, minWidth: 200 },
    {
      headerName: '围栏类型',
      field: 'fence_type',
      flex: 1,
      minWidth: 200,
      valueOptions: fenceTypeOptions,
      renderCell: (params) => {
        const find = fenceTypeOptions.find(item => item.value === params.value)
        return renderEmptyFilter({...params, value: find.label })
      }
    },
    {
      headerName: '有效分组',
      field: 'group_key',
      flex: 1, minWidth: 150,
      renderCell: (params) => {
        const find = fenceGroupOptions.find(item => item.value === params.value)
        return renderEmptyFilter({...params, value: find.label })
      }
    },
    {
      headerName: '设备位置',
      field: 'device_location_key',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        const find = deviceLocationOptions.find(item => item.value === params.value)
        return renderEmptyFilter({...params, value: find.label })
      }
    },
    {
      headerName: '备注',
      field: 'remark',
      flex: 1,
      minWidth: 200,
      renderCell: renderCellExpand
    },
  ]

  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [tableData, setTableData] = useState([])
  const fetchFence = (p = 1) => {
    const params = {
      page: p,
      pageSize: PAGE_SIZE
    }
    getFences(params).then((res) => {
      if (res.code === 0) {
        setTableData(res.data.data)
        setTotal(res.data.total)
        setTotalPages(res.data.totalPages)
      }
    })
  }

  useEffect(() => {
    fetchFence()
  }, [])

  const savePage = (page) => {
    setPage(page)
    fetchFence(page)
  }

  const [open, setOpen] = useState(false)
  const handleOpen = () => {
    setOpen(true)
  }
  const onClose = (flag) => {
    if (flag) {
      fetchFence(page)
    }
    setOpen(false)
  }
  return (
      <Box>
        <Button variant="contained" onClick={handleOpen} sx={{ marginBottom: 2 }}>
          添加围栏
        </Button>
        <Box sx={{ height: 'calc(100vh - 250px)' }}>
          <CustomTable
              column={getColumn}
              tableData={tableData}
              rowKeyProp="id"
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

        <SaveFenceDialog open={open} onClose={onClose} />
      </Box>
  )
}
export default PeopleWarn