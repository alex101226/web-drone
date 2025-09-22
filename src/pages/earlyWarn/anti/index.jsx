import {useState, useEffect} from 'react';
import {Box} from '@mui/material'
import {renderCellExpand} from '@/components/CustomCellExpand'
import CustomTable from '@/components/customTable'
import CustomPagination from "@/components/customPagination";
import {getAnti} from '@/services'
import {coverDateString} from "@/utils/index.js";

const PAGE_SIZE = 10
const Anti = () => {

  const getColumn = [
    { headerName: '无人机编号', field: 'sig', flex: 1, minWidth: 150, renderCell: renderCellExpand },
    {
      headerName: '经纬度',
      field: 'type',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return renderCellExpand({ ...params, value: `${params.row.lng}, ${params.row.lat}`})
      }
    },
    {
      headerName: '所在区域',
      field: 'area',
      flex: 1,
      minWidth: 150,
      renderCell: renderCellExpand ,
    },
    {headerName: '高度（H）', field: 'altitude', flex: 1, minWidth: 80, renderCell: renderCellExpand},
    {
      headerName: '识别时间',
      field: 'created_at',
      flex: 1, minWidth: 150,
      renderCell: (params) => {
        return renderCellExpand({...params, value: coverDateString(params.value, '4')})
      }
    },
    {
      headerName: '备注',
      field: 'message',
      flex: 1, minWidth: 200,
      renderCell: renderCellExpand
    },
  ]

  const [loading, setLoading] = useState(false)
  const [tableData, setTableData] = useState([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(1)
  const fetchAnti = (p = 1) => {
    const params = {
      page: p,
      pageSize: PAGE_SIZE,
    }
    setLoading(true)
    getAnti(params).then((res) => {
      if (res.code === 0) {
        setTotal(res.data.total)
        setTableData(res.data.data)
        setTotalPages(res.data.totalPages)
      }
      setLoading(false)
    }).catch((err) => {
      setLoading(false)
    })
  }

  useEffect(() => {
    fetchAnti()
  }, [])

  const onPage = (page) => {
    setPage(page)
    fetchAnti(page)
  }

  return (
      <Box>
        <Box sx={{ height: 'calc(100vh - 150px)' }}>
          <CustomTable
              column={getColumn}
              tableData={tableData}
              rowKeyProp="id"
              hideFooter
              loading={loading}
          />
        </Box>
        <CustomPagination
            page={page}
            total={total}
            pageSize={PAGE_SIZE}
            totalPage={totalPages}
            savePage={onPage}
        />
      </Box>
  )
}
export default Anti