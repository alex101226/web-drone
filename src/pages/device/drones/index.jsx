import {useState, useEffect, Fragment, useMemo} from 'react';
import {Autocomplete, Box, Button, Popover, Stack, TextField, Typography} from '@mui/material'
import CustomTable from "@/components/customTable";
import CustomPagination from '@/components/customPagination';
import CustomImage from '@/components/customImage'
import { renderCellExpand } from '@/components/CustomCellExpand'
import PermissionButton from "@/components/permissionButton";
import SaveDroneDrawer from './components/saveDroneDrawer'
import {getDrones, getOperators, deleteDrone, dispatch, dispatchBatch} from '@/services'
import {droneStatusFilter} from '@/filters';
import {message} from "@/utils";

const initialStateSelectionModel = {
  type: 'include',
  ids: new Set(),
}

const PAGE_SIZE = 10
const Drones = () => {
  const {DRONE_STATUS_OPTIONS, renderDroneStatus} = droneStatusFilter()
  const getColumn = () => {
    return [
      {
        headerName: '无人机照片',
        field: 'drone_photo',
        flex: 1,
        minWidth: 100,
        renderCell: (params) => <CustomImage img={params.value} />
      },
      { headerName: '无人机名称', field: 'drone_name', renderCell: renderCellExpand, flex: 1, minWidth: 150,},
      { headerName: '编号', field: 'drone_sn', renderCell: renderCellExpand, flex: 1, minWidth: 150,},
      { headerName: '型号', field: 'model', renderCell: renderCellExpand, flex: 1, minWidth: 150,},
      { headerName: '电池容量(mAh)', field: 'battery_capacity', renderCell: renderCellExpand, flex: 1, minWidth: 150,},
      { headerName: '载荷能力(kg)', field: 'payload_capacity', renderCell: renderCellExpand, flex: 1, minWidth: 150,},
      {
        headerName: '相机参数',
        field: 'camera_label',
        renderCell: renderCellExpand,
        flex: 1, minWidth: 150,
      },
      { headerName: '飞手', field: 'operator_name', renderCell: renderCellExpand, flex: 1, minWidth: 150, },
      {
        headerName: '状态',
        field: 'status',
        flex: 1, minWidth: 150,
        renderCell: ({value, row}) => renderDroneStatus(value, row.status_label),
        valueOptions: DRONE_STATUS_OPTIONS,
      },
      {
        headerName: '操作',
        field: 'action',
        flex: 1, minWidth: 180,
        renderCell: (params) => {
          return <Box sx={{ display: 'flex', flexWrap: 'wrap', height: '100%', alignItems: 'center' }}>
            <PermissionButton
                type="text"
                module="device"
                page="drones"
                action="dispatch"
                onClick={() => onAction('dispatch', params.row)}>
              调度
            </PermissionButton>
            <PermissionButton
                type="text"
                module="device"
                page="drones"
                action="read"
                onClick={() => onAction('read', params.row)}>
              历史记录
            </PermissionButton>
            <PermissionButton
                type="text"
                module="device"
                page="drones"
                action="update"
                onClick={() => onAction('edit', params.row)}>
              修改
            </PermissionButton>
            {
              [1, 3].includes(params.row.status)
                ? <Fragment>
                    <PermissionButton
                        type="text"
                        module="device"
                        page="drones"
                        action="update"
                        onClick={(event) => handleDelete(event, params.row)}>
                      删除
                    </PermissionButton>
                    <Popover
                        open={Boolean(anchorEl)}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    >
                      <Typography sx={{ p: 2 }}>确定要删除吗？</Typography>
                      <Button onClick={onDelete} color="error">确定</Button>
                      <Button onClick={handleClose}>取消</Button>
                    </Popover>
                  </Fragment>
                  : null
            }
          </Box>
        }
      },
    ]
  }

  //  获取无人机信息
  const [loading, setLoading] = useState(false)
  const [searchParams, setSearchParams] = useState({
    page: 1,
    operator_id: ''
  })
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const fetchDrone =  () => {
    const params = {
      ...searchParams,
      pageSize: PAGE_SIZE,
    }
    setLoading(true)
    getDrones(params).then((res) => {
      if (res.code === 0) {
        setTotal(res.data.total)
        setTotalPages(res.data.totalPages)
        setData(res.data.data)
      }
      setLoading(false)
    }).catch((err) => {
      setLoading(false)
    })
  }

  //  获取飞手信息
  const [operatorOptions, setOperatorOptions] = useState([])
  const fetchOperator = () => {
    const params = {
      page: 1,
      pageSize: 1000,
    }
    getOperators(params).then((res) => {
      if (res.code === 0) {
        setOperatorOptions(res.data.data)
      }
    })
  }

  useEffect(() => {
    fetchOperator()
  }, [])

  useEffect(() => {
    fetchDrone()
  }, [searchParams])

  //  飞手
  const handleSearch = (event, row) => {
    setSearchParams({ ...searchParams, operator_id: row.id})
  }

  //  重置
  const resetSearch = () => {
    setSearchParams({ ...searchParams, operator_id: '' })
  }

  //  分页查看
  const savePage = (page) => {
    setSearchParams({ ...searchParams, page })
  }

  //  删除
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClose = () => setAnchorEl(null);

  //  删除执行
  const onDelete = () => {
    const params = {
      id: record.id
    }
    deleteDrone(params).then(res => {
      if (res.code === 0) {
        message.success(res.message)
        handleClose()
        fetchDrone()
      } else {
        message.error(res.message)
      }
    }).catch((err) => {
      message.error(err.message)
    })
  }

  const handleDelete = (event, row) => {
    setAnchorEl(event.currentTarget);
    setRecord(row)
  }

  //  添加修改open
  const [saveOpen, setSaveOpen] = useState(false);
  const [record, setRecord] = useState(null);
  const [type, setType] = useState('add');
  const onAction = (type, row) => {

    setRecord(row ? row : null)
    if (['dispatch', 'dispatchBatch'].includes(type)) {
      handleDispatch(type, row.id)
    } else {
      setType(type)
      setSaveOpen(true)
    }
  };

  //  关闭活动窗口
  const onClose = (type, flag) => {
    if (flag) {
      fetchDrone(searchParams.page)
    }
    setSaveOpen(false)
  }

  //  无人机集合
  const [selectionModel, setSelectionModel] = useState(initialStateSelectionModel);
  const changeSelectionModal = (type, rows) => {
    setSelectionModel(rows)
  }

  //  无人机调度
  const [loadings, setLoadings] = useState({
    dispatch: false,
    allDispatch: false,
  })

  //  单个调度
  const onDispatch = (id) => {
    if (loadings.dispatch) return;
    setLoadings({ dispatch: true })
    dispatch({ id }).then(res => {
      if (res.code === 0) {
        message.success(res.message)
        fetchDrone()
        setSelectionModel(initialStateSelectionModel)
      } else {
        message.error(res.message)
      }
      setLoadings({ dispatch: false })
    }).catch((err) => {
      message.error(err.message)
      setLoadings({ dispatch: false })
    })
  }

  //  多个调度
  const onDispatchBatch = () => {
    if (loadings.allDispatch) return;
    setLoadings({ allDispatch: true })
    dispatchBatch({ ids: Array.from(selectionModel.ids) }).then(res => {
      if (res.code === 0) {
        message.success(res.message)
        fetchDrone()
        setSelectionModel(initialStateSelectionModel)
      } else {
        message.error(res.message)
      }
      setLoadings({ allDispatch: false })
    }).catch((err) => {
      message.error(err.message)
      setLoadings({ allDispatch: false })
    })
  }
  // 调度
  const handleDispatch = (type, id) => {
    if (type === 'dispatchBatch') {
      onDispatchBatch()
    } else {
      onDispatch(id)
    }
  }

  return (
    <Box>
      <PermissionButton
          module="device"
          page="drones"
          action="create"
          onClick={() => onAction('add', null)}>
        添加无人机
      </PermissionButton>
      <Stack spacing={2} direction="row" alignItems="center" sx={{my: 2}}>
        <Typography component="p" variant="p">选择飞手：</Typography>
        <Autocomplete
            freeSolo
            disableClearable
            sx={{ width: 300 }}
            options={operatorOptions}
            getOptionKey={(option) => option.id}
            getOptionLabel={(option) => option.operator_name || ''}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            onChange={handleSearch}
            onInputChange={resetSearch}
            renderInput={(params) => (
                <TextField
                    {...params}
                    size="small"
                    label=""
                    placeholder="请选择飞手姓名"
                    slotProps={{
                      input: {
                        ...params.InputProps,
                        type: 'search',
                      },
                    }}
                />
            )}
        />

        <PermissionButton
            module="device"
            page="drones"
            action="dispatch"
            loading={loadings.allDispatch}
            disabled={selectionModel.ids.size === 0}
            onClick={() => onAction('dispatchBatch', null)}>
          一键调度
        </PermissionButton>
      </Stack>

      <Box sx={{ height: 'calc(100vh - 270px)', mt: 2 }}>
        <CustomTable
            tableData={data}
            column={getColumn()}
            rowKeyProp="id"
            hideFooter
            rowHeight={80}
            loading={loading}
            checkboxSelection
            rowSelectionModel={selectionModel}
            onRowSelectionModelChange={(rowSelectionModel) => changeSelectionModal('add', rowSelectionModel)}
        />
      </Box>
      <CustomPagination
          total={total}
          pageSize={PAGE_SIZE}
          page={searchParams.page}
          totalPage={totalPages}
          savePage={savePage}
      />
      <SaveDroneDrawer
          open={saveOpen}
          data={ record }
          type={type}
          onClose={ (flag) => onClose('save', flag) }
      />
    </Box>
  )
}
export default Drones