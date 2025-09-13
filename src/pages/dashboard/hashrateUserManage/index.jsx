import { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import CustomTable from '@/components/customTable';
import CustomPagination from '@/components/customPagination'
import SaveUserDialog from './components/saveUserDialog'
import {userStatusFilter} from '@/filters'
import { getHashrateUser } from '@/services/index.js'
import {coverDateString} from "@/utils/index.js";

const HashrateUserManage = () => {
  const {USER_STATUS_OPTIONS, renderUserStatus} = userStatusFilter()
  //  昵称，账户，部门，职位，管理员角色，账号状态，修改
  const getColumn = [
    { headerName: '昵称', field: 'nickname', flex: 1, minWidth: 150, },
    {headerName: '账户', field: 'username', flex: 1, minWidth: 150,},
    {headerName: '部门', field: 'department', flex: 1, minWidth: 150,},
    {headerName: '职位', field: 'position', flex: 1, minWidth: 150,},
    {headerName: '角色', field: 'role_description', flex: 1, minWidth: 150,},
    {
      headerName: '账号状态',
      field: 'status',
      flex: 1,
      minWidth: 100,
      options: USER_STATUS_OPTIONS,
      renderCell: (params) => renderUserStatus(params.value),
    },
    {
      headerName: '创建时间',
      field: 'created_at',
      flex: 1,
      minWidth: 180,
      renderCell: (params) => {
        return coverDateString(params.value, '4')
      },
    },
    {
      headerName: '',
      field: 'action',
      minWidth: 100,
      flex: 1,
      renderCell: (params) => {
        return <Button onClick={onEdit(params.row, 'edit')}>修改</Button>
      }
    },
  ]

  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const fetchUser = (p = 1) => {
    const params = {
      page: p,
      pageSize: 5,
      role_id: 1
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

  const [type, setType] = useState('')
  const [record, setRecord] = useState(null)
  const [open, setOpen] = useState(false)
  const onEdit = (row, type) => () => {
    if (row) {
      setRecord(row)
    }
    setType(type)
    setOpen(true)
  }

  const onClose = (flag) => {
    if (flag) {
      fetchUser(page)
    }
    setRecord(null)
    setOpen(false)
  }

  return (
      <Box>
        <Button variant="contained" onClick={onEdit(null, 'add')}>
          添加用户
        </Button>
        <Box sx={{mb: 2}} />
        <Box sx={{ height: 'calc(100vh - 250px)' }}>
          <CustomTable
              tableData={data}
              column={getColumn}
              rowKeyProp="id"
              hideFooter
          />
        </Box>
        {
          data.length > 0
            ?  <CustomPagination
                  total={total}
                  pageSize={5}
                  page={page}
                  totalPage={totalPages}
                  savePage={savePage}
              />
              : null
        }


        {/* 修改用户信息  */}
        <SaveUserDialog
            open={open}
            onClose={onClose}
            data={record}
            type={type}
            roleId={1}
        />
      </Box>
  )
}
export default HashrateUserManage;