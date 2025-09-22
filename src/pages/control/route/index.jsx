import {useState, useEffect, useCallback} from 'react';
import {Box, Autocomplete, Stack, TextField, Typography} from '@mui/material'
import { locationStatusFilter, routeUsedStatusFilter } from '@/filters/index.js';
import CustomTable from "@/components/customTable/index.js";
import CustomPagination from '@/components/customPagination/index';
import { renderCellExpand } from '@/components/CustomCellExpand/index'
import SaveRouteDrawer from "./components/saveRouteDrawer";
import { getLogistics, getLocations } from '@/services'
import PermissionButton from "@/components/permissionButton/index.jsx";

const PAGE_SIZE = 10;
const CarLogisticsRoute = () => {
  const [routeOptions, setRouteOptions] = useState([]);
  const fetchRoute = () => {
    getLocations().then((res) => {
      if (res.code === 0) {
        setRouteOptions(res.data)
      }
    })
  }
  useEffect(() => {
    fetchRoute()
  }, [])

  //  线路列表数据
  const { LOCATION_STATUS_OPTIONS, renderLocationStatus } = locationStatusFilter()
  const { ROUTE_USED_STATUS_OPTIONS, renderRouteUsedStatus } = routeUsedStatusFilter()
  const getColumn = () => {
    return [
      { headerName: 'ID', field: 'id', flex: 1, minWidth: 80,},
      { headerName: '路线名称', field: 'route_name', renderCell: renderCellExpand, flex: 1, minWidth: 150,},
      {
        headerName: '路线状态',
        field: 'status',
        flex: 1, minWidth: 150,
        renderCell: (params) => renderLocationStatus(params.value),
        valueOptions: LOCATION_STATUS_OPTIONS,
      },
      { headerName: '预计巡航时间（H）', field: 'expect_complete_time', flex: 1, minWidth: 80,},
      {
        headerName: '是否被使用',
        field: 'current_is_used',
        flex: 1, minWidth: 150,
        renderCell: (params) => renderRouteUsedStatus(params.value),
        valueOptions: ROUTE_USED_STATUS_OPTIONS,
      },
      {
        headerName: '操作',
        field: 'action',
        flex: 1, minWidth: 120,
        renderCell: (params) => {
          return <Box>
            <PermissionButton
                module="control"
                page="route"
                action="update"
                type="text"
                onClick={onAction('update', params.row)}>
              修改
            </PermissionButton>

          </Box>
        }
      },
    ]
  }
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [searchParams, setSearchParams] = useState({
    page: 1,
    route_id: ''
  })
  const fetchLogistics =  (p = 1) => {
    const params = {
      ...searchParams,
      pageSize: PAGE_SIZE,
    }
    getLogistics(params).then((res) => {
      if (res.code === 0) {
        setTotal(res.data.total)
        setTotalPages(res.data.totalPages)
        setData(res.data.data)
      }
    })
  }

  useEffect(() => {
    fetchLogistics()
  }, [searchParams])

  //  分页查看
  const savePage = (page) => {
    setSearchParams({ ...searchParams, page })
  }

  //  路线名称
  const handleSearch = (event, row) => {
    setSearchParams({ ...searchParams, route_id: row.id })
  }
  //  重置
  const resetSearch = () => {
    setSearchParams({ ...searchParams, route_id: '' })
  }

  //  查看路线
  const [record, setRecord] = useState({})
  const [type, setType] = useState('add')
  const [open, setOpen] = useState(false)
  const onAction = (type, row) => () => {
    setOpen(true)
    setType(type)
    setRecord(row)
  }

  //  操作完，关闭窗口
  const onClose = (flag, type) => {
    if  (flag) {
      fetchLogistics()
    }
    setOpen(false)
  }
  return (
      <Box sx={{ width: '100%' }}>
        <PermissionButton
            module="control"
            page="route"
            action="create"
            onClick={onAction('add', null)}>
          添加路线
        </PermissionButton>
        <Stack spacing={2} direction="row" alignItems="center" sx={{my: 2}}>
          <Typography component="p" variant="p">请输入路线名称：</Typography>
          <Autocomplete
              freeSolo
              disableClearable
              sx={{ width: 300 }}
              options={routeOptions}
              getOptionKey={(option) => option.sort}
              getOptionLabel={(option) => option.route_name || ''}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={handleSearch}
              onInputChange={resetSearch}
              renderInput={(params) => (
                  <TextField
                      {...params}
                      size="small"
                      label=""
                      placeholder="请选择调度状态"
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

        <Box sx={{ height: 'calc(100vh) - 250px', mt: 2 }}>
          <CustomTable
              tableData={data}
              column={getColumn()}
              rowKeyProp="id"
              hideFooter
              rowHeight={80}
          />
        </Box>
        <CustomPagination
            total={total}
            pageSize={PAGE_SIZE}
            page={searchParams.page}
            totalPage={totalPages}
            savePage={savePage}
        />
        <SaveRouteDrawer
            open={open}
            type={type}
            data={record}
            onClose={(flag) => onClose(flag)}
        />
      </Box>
  )
}
export default CarLogisticsRoute