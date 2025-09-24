import {useState, useEffect} from 'react';
import {Box, Autocomplete, Stack, TextField, Typography} from '@mui/material'
import CustomTable from '@/components/customTable'
import CustomPagination from '@/components/customPagination'
import PermissionButton from '@/components/permissionButton'
import { renderCellExpand } from '@/components/CustomCellExpand'
import SaveUserDialog from './components/saveUserDialog'
import {getHashrateUser, getRoles} from '@/services';
import {userStatusFilter} from '@/filters';
import { coverDateString } from '@/utils'


const PAGE_SIZE = 10
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
  const [totalPages, setTotalPages] = useState(0)
  const [searchParams, setSearchParams] = useState({
    page: 1,
    role_id: ''
  })

  const fetchUser = () => {
    const params = {
      ...searchParams,
      pageSize: PAGE_SIZE
    }
    getHashrateUser(params).then((res) => {
      if (res.code === 0) {
        setData(res.data.data)
        setTotal(res.data.total)
        setTotalPages(res.data.totalPages)
      }
    })
  }

  //  获取角色列表
  const [roleOptions, setRoleOptions] = useState([]);
  const fetchRoles = () => {
    getRoles().then((res) => {
      if (res.code === 0) {
        setRoleOptions(res.data)
      }
    })
  }

  useEffect(() => {
    fetchRoles()
  }, [])

  useEffect(() => {
    fetchUser()
  }, [searchParams])
  //  分页
  const savePage = (page) => {
    setSearchParams({ ...searchParams, page })
  }

  //  飞手
  const handleSearch = (event, row) => {
    setSearchParams({ ...searchParams, role_id: row.id})
  }

  //  重置
  const resetSearch = () => {
    setSearchParams({ ...searchParams, role_id: '' })
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
  const onClose = (flag) => {
    if (flag) {
      fetchUser()
    }
    setSaveOpen(false)
  }

  return (
      <Box>
        <PermissionButton module="people" page="manager" action="create" onClick={onEdit(null)}>
          创建用户
        </PermissionButton>
        <Stack spacing={2} direction="row" alignItems="center" sx={{my: 2}}>
          <Typography component="p" variant="p">选择角色：</Typography>
          <Autocomplete
              freeSolo
              disableClearable
              sx={{ width: 300 }}
              options={roleOptions}
              getOptionKey={(option) => option.id}
              getOptionLabel={(option) => option.role_description || ''}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={handleSearch}
              onInputChange={resetSearch}
              renderInput={(params) => (
                  <TextField
                      {...params}
                      size="small"
                      label=""
                      placeholder="请选择角色"
                      slotProps={{
                        input: {
                          ...params.InputProps,
                          type: 'search',
                        },
                      }}
                  />
              )}
          />
        </Stack>

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
            pageSize={PAGE_SIZE}
            page={searchParams.page}
            totalPage={totalPages}
            savePage={savePage}
        />
        <SaveUserDialog
            open={ saveOpen }
            type={type}
            data={ record }
            onClose={ (flag) => onClose(flag)}
        />
      </Box>
  )
}
export default PeoplePosition