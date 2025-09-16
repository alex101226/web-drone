import {useState, useEffect} from 'react';
import {Box} from '@mui/material';
import {renderCellExpand} from '@/components/CustomCellExpand';
import CustomTable from '@/components/customTable'
import CustomPagination from '@/components/customPagination'
import PermissionButton from '@/components/permissionButton';
import SaveDialog from './components/saveDialog.jsx';
import {operatorStatusFilter} from '@/filters';
import {getOperators} from '@/services'
import CustomImage from "@/components/customImage/index.js";

const PAGE_SIZE = 10
//  这里要根据飞手，查找一下飞手的所有的执飞记录，用dialog弹出
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
      headerName: '执照照片',
      field: 'license_photo',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        return params.value ? <CustomImage
            w={60}
            h={60}
            fit="cover"
            mt="calc((80px - 60px) / 2)"
            radius={1}
            img={globalThis.CONSTANTS.STATIC_URL + params.value}
        /> : <Box sx={{
          width: 60,
          height: 60,
          borderRadius: 1,
          backgroundColor: '#ccc',
          mt: 'calc((80px - 60px) / 2)' }}
        />
      }
    },
    {
      headerName: '账号状态',
      field: 'status',
      flex: 1,
      minWidth: 150,
      options: OPERATOR_STATUS_OPTIONS,
      renderCell: ({value, row}) => renderOperatorStatus(value, row.status_label),
    },
    {
      headerName: '',
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
        setTableData(res.data.data)
        setTotal(res.data.total)
        setTableData(res.data.data)
        setTotalPages(res.data.totalPages)
      }
    })
  }

  useEffect(() => {
    fetchOperator()
  }, [])

  const savePage = (page) => {
    setPage(page)
    fetchOperator(page)
  }

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