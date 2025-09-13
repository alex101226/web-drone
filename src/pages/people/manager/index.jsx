import {useState, useEffect} from 'react';
import {Box} from '@mui/material'
import CustomTable from '@/components/customTable'
import CustomPagination from '@/components/customPagination'
import PermissionButton from '@/components/permissionButton'
import { renderCellExpand } from '@/components/CustomCellExpand'
import SaveUserDialog from './components/saveUserDialog'
import {getHashrateUser} from '@/services';
import {userStatusFilter} from '@/filters';
import { coverDateString } from '@/utils'

const PeoplePosition = () => {

  const {USER_STATUS_OPTIONS, renderUserStatus} = userStatusFilter()
  //  昵称，账户，部门，职位，管理员角色，账号状态，修改
  const getColumn = () => {
    return [
      { headerName: '昵称', field: 'nickname', flex: 1, minWidth: 150 },
      {headerName: '账户', field: 'username', flex: 1, minWidth: 150, renderCell: renderCellExpand },
      {headerName: '部门', field: 'department', flex: 1, minWidth: 150, renderCell: renderCellExpand },
      {headerName: '职位', field: 'position', flex: 1, minWidth: 150, renderCell: renderCellExpand },
      {
        headerName: '账号状态',
        field: 'status',
        flex: 1,
        minWidth: 150,
        options: USER_STATUS_OPTIONS,
        renderCell: (params) => renderUserStatus(params.value),
      },
      {
        headerName: '角色',
        field: 'role_description',
        flex: 1,
        minWidth: 150,
        renderCell: renderCellExpand
      },
      {
        headerName: '创建时间',
        field: 'created_at',
        flex: 1,
        minWidth: 180,
        renderCell: (params) => coverDateString(params.value, '4'),
      },
      {
        headerName: '',
        field: 'action',
        minWidth: 150,
        flex: 1,
        renderCell: (params) => {
          return <PermissionButton module="people" page="manager" action="update" type="text" onClick={onEdit(params.row)}>
            修改
          </PermissionButton>
        }
      },
    ]
  }
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const fetchUser = (p = 1) => {
    const params = {
      page: p,
      pageSize: 5,
      role_id: 2
    }
    getHashrateUser(params).then((res) => {
      if (res.code === 0) {
        setData(res.data.data)
        setTotal(res.data.total)
        setTotalPages(res.data.totalPages)
      }
    })
  }

  useEffect(() => {
    fetchUser()
  }, [])

  //  分页
  const savePage = (page) => {
    setPage(page)
    fetchUser(page)
  }

  const [saveOpen, setSaveOpen] = useState(false);
  const [record, setRecord] = useState({ status: '1'});
  const [type, setType] = useState('add');
  //  修改
  const onEdit = (row) => () => {
    if (row) {
      setRecord(row)
    }
    setType(row ? 'edit' : 'add')
    setSaveOpen(true)
  };

  //  关闭
  const onClose = (type) => (flag) => {
    switch (type) {
      case 'save':
        if (flag) {
          fetchUser(page)
        }
        setSaveOpen(false)
        break;
    }

  }

  return (
      <Box>
        <PermissionButton module="people" page="manager" action="create" onClick={onEdit(null)}>
          创建用户
        </PermissionButton>
        <Box sx={{ height: 'calc(100vh - 250px)', mt: 2 }}>
          <CustomTable
              tableData={data}
              column={getColumn()}
              rowKeyProp="id"
              hideFooter
          />
        </Box>
        <CustomPagination
            total={total}
            pageSize={5}
            page={page}
            totalPage={totalPages}
            savePage={savePage}
        />
        <SaveUserDialog
            open={ saveOpen }
            type={type}
            data={ record }
            roleId={2}
            onClose={ (flag) => onClose('save')(flag)}
        />
        {/*<PeopleSave*/}
        {/*    open={ saveOpen }*/}
        {/*    type={type}*/}
        {/*    onClose={ (flag) => onClose('save')(flag) }*/}
        {/*    data={ record }*/}
        {/*/>*/}
        {/*<CheckInfo*/}
        {/*    labelText="人员位置"*/}
        {/*    open={checkOpen}*/}
        {/*    onClose={ () => onClose('check')(false) }*/}
        {/*    text={ record.value }*/}
        {/*    title="查看人员信息"*/}
        {/*/>*/}
      </Box>
  )
}
export default PeoplePosition