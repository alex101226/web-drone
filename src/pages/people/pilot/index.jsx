import {useState, useEffect} from 'react';
import {Box} from '@mui/material';
import {renderCellExpand} from '@/components/CustomCellExpand';
import CustomTable from '@/components/customTable'
import CustomPagination from '@/components/customPagination'
import PermissionButton from '@/components/permissionButton';
import CustomImage from "@/components/customImage";
import SaveDialog from './components/saveDialog';
import {operatorStatusFilter} from '@/filters';
import {getOperators} from '@/services'

const PAGE_SIZE = 10
//  这里要根据飞手，查找一下飞手的所有的执飞记录，用dialog弹出
//  执飞记录
const Pilot = () => {
  const { OPERATOR_STATUS_OPTIONS, renderOperatorStatus } = operatorStatusFilter()
  const getColumn = [
    { headerName: '飞手姓名', field: 'operator_name', flex: 1, minWidth: 150, renderCell: renderCellExpand, },
    {
      headerName: '联系电话',
      field: 'phone',
      flex: 1,
      minWidth: 150,
      renderCell: renderCellExpand,
    },
    {headerName: '飞行执照', field: 'license_no', flex: 1,},
    {
      headerName: '状态',
      field: 'status',
      flex: 1,
      minWidth: 150,
      options: OPERATOR_STATUS_OPTIONS,
      renderCell: ({value, row}) => renderOperatorStatus(value, row.status_label),
    },
    {headerName: '飞行时长（H）', field: 'total_hours', flex: 1,},
    {
      headerName: '备注',
      field: 'license_photo',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => <CustomImage img={params.value} />
    },
    {
      headerName: '操作',
      field: 'action',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => {
        return <Box>
          <PermissionButton
              module="people"
              page="pilot"
              action="update"
              type="text"
              onClick={() => onAction(params.row, 'update')}>
            修改
          </PermissionButton>
        </Box>
      }
    },
  ]
  const [tableData, setTableData] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const fetchOperator = (p = 1) => {
    const params = {
      page: p,
      pageSize: PAGE_SIZE,
    }
    getOperators(params).then((res) => {
      if (res.code === 0) {
        setTotal(res.data.total)
        setTableData(res.data.data)
        setTotalPages(res.data.totalPages)
      }
    })
  }
  const savePage = (page) => {
    setPage(page)
    fetchOperator(page)
  }
  useEffect(() => {
    fetchOperator()
  }, [])

  const [type, setType] = useState('add')
  const [record, setRecord] = useState(null);
  const [openSaveDialog, setOpenSaveDialog] = useState(false)
  const onAction = (row, type) => {
    setType(type)
    setRecord(row)
    setOpenSaveDialog(true)
  }

  //关闭窗口
  const onClose = (flag) => {
    if (flag) {
      fetchOperator(page)
    }
    setOpenSaveDialog(false)
  }

  return (
      <Box>
        <PermissionButton module="people" page="pilot" action="create" onClick={() => onAction(null, 'add')}>
          添加飞手
        </PermissionButton>
        <Box sx={{ height: 'calc(100vh - 250px)', mt: 2 }}>
          <CustomTable
              tableData={tableData}
              column={getColumn}
              rowKeyProp="id"
              hideFooter
              rowHeight={80}
          />
        </Box>
        <CustomPagination
            total={total}
            pageSize={PAGE_SIZE}
            page={page}
            totalPage={totalPages}
            savePage={savePage}
        />


        {/* 设置飞手信息  */}
        <SaveDialog
            open={openSaveDialog}
            data={record}
            type={type}
            onClose={onClose}
        />
      </Box>
  )
}
export default Pilot