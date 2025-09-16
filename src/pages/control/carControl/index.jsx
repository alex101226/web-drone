import { useState, useEffect, useMemo } from 'react';
import {Box, Button, IconButton, Typography, styled} from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CustomTable from '@/components/customTable/index.js'
import { renderCellExpand } from '@/components/CustomCellExpand/index.jsx'
import CustomPagination from '@/components/customPagination/index.jsx'
import ControlErrorDialog from "./components/controlErrorDialog.jsx";
import ControlHistoryDialog from './components/historyDialog.jsx'
import {renderRadiusContained, renderEmptyFilter, dispatchStatusFilter, carDispatchStatusFilter} from '@/filters/index.js';
import { getVehicleControl, postDispatchVehicle, postDispatchAllVehicles } from '@/services/index.js'
import { message } from '@/utils/index.js'
import { useUserStore } from '@/store/index.js'
import {useUtils} from '@/hooks/useUtils.js'

const initialStateSelectionModel = {
  type: 'include',
  ids: new Set(),
}
const Text = styled(Typography)({
  WebkitLineClamp: 2,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  fontSize: '14px',
  whiteSpace: 'break-spaces',
})

const PAGE_SIZE = 10
const CarControl = () => {
  const { userInfo } = useUserStore()
  const isRoot = () => {
    return userInfo?.role_name === 'root'
  }

  const { onCopy } = useUtils()
  const {DISPATCH_STATUS_OPTIONS, renderDispatchStatus} = dispatchStatusFilter()
  const {CAR_DISPATCH_STATUS_OPTIONS, renderCarDispatchStatus} = carDispatchStatusFilter()
  const getColumn = () => {
    const columns = [
      { headerName: '车辆名称', field: 'vehicle_alias', flex: 1, minWidth: 150 },
      {
        headerName: '车辆调度状态',
        field: 'control_status',
        flex: 1,
        minWidth: 150,
        renderCell: (params) => renderCarDispatchStatus(params.value),
        valueOptions: CAR_DISPATCH_STATUS_OPTIONS,
      },
      {
        headerName: '任务调度状态',
        field: 'dispatch_status',
        flex: 1,
        minWidth: 150,
        renderCell: (params) => renderDispatchStatus(params.value),
        valueOptions: DISPATCH_STATUS_OPTIONS,
      },
      {
        headerName: '路线名称',
        field: 'route_name',
        flex: 1, minWidth: 150,
        renderCell: (params) => {
          return params.value ? <IconButton
              aria-label="copy"
              size="small"
              onClick={() => onCopy(params.value)}>
            <Text component="div" color="textPrimary">
              {renderCellExpand(params)}
            </Text>
            <ContentCopyIcon fontSize="inherit" />
          </IconButton> : '--'
        }
      },
      // { headerName: '车牌号', field: 'plate_number', flex: 1, minWidth: 150 },
      // { headerName: '里程数/KG', field: 'mileage', flex: 1, minWidth: 150 },
      { headerName: '总里程（KM）', field: 'distance_km', flex: 1, minWidth: 150, renderCell: renderEmptyFilter },
      { headerName: '预计时长（H）', field: 'estimated_time', flex: 1, minWidth: 150, renderCell: renderEmptyFilter },
      {
        headerName: '起点', field: 'route_start', flex: 1, minWidth: 150,
        renderCell: renderEmptyFilter
      },
      {
        headerName: '终点', field: 'route_end', flex: 1, minWidth: 150,
        renderCell: renderEmptyFilter
      },
      {
        headerName: '司机信息',
        field: 'drivers',
        flex: 2,
        minWidth: 150,
        renderCell: (params) => {
          return (
              <Box component="div" sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center',  height: '100%' }}>
                {
                  (params.value || []).map((item, index) => (
                      <Typography
                          key={index}
                          component="p"
                          variant="body2"
                          sx={{ lineHeight: 1.4 }}>
                        {item.name}: {item.phone}
                      </Typography>
                  ))
                }
              </Box>
          )
        },
      },
    ]
    if (!isRoot()) {
      return columns
    }
    return [
        ...columns,
      {
        headerName: '操作',
        minWidth: 150,
        flex: 1,
        field: 'action',
        renderCell: ({ row }) => {
          return <Box>
            <Button onClick={handleControl(row, 'history')}>
              历史记录
            </Button>
            {
              row.control_status === '2'
                  && <Button onClick={handleControl(row, 'control')}>
                    调度
                  </Button>
            }
          </Box>
        },
      },
    ]
  }

  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPage, setTotalPage] = useState(0);

  // const fetchVehicleControl = (p = 1) => {
  //   const params = {
  //     page: p,
  //     pageSize: PAGE_SIZE,
  //     status: '1, 4'
  //   }
  //
  //   getVehicleControl(params).then(({ data, code }) => {
  //     if (code === 0) {
  //       setTotalPage(data.totalPages)
  //       setTotal(data.total)
  //       const tableDataWithIndex = data.data.map((row, index) => ({
  //         ...row,
  //         __index: index,
  //       }));
  //       setTableData(tableDataWithIndex)
  //     }
  //   })
  // }
  // useEffect(() => {
  //   fetchVehicleControl()
  // }, [])

  //  分页
  const savePage = (page) => {
    setPage(page)
    fetchVehicleControl(page)
  }

  const [selectionModel, setSelectionModel] = useState(initialStateSelectionModel);

  // ✅ 组装成一维数组（只要 dbId）
  const changeSelectionModal = (type, rows) => {
    setSelectionModel(rows)
  }

  const selectedVehicleIds = useMemo(() => {
    const { type, ids } = selectionModel;
    if (type === 'include') {
      return tableData.filter((item) => ids.has(item.__index)).map((item) => item.id)
    } else if (type === 'exclude') {
      return tableData.filter((item) => !ids.has(item.__index)).map((item) => item.id);
    }
    return [];
  }, [selectionModel])

  //  一键调度
  const [loading1, setLoading1] = useState(false)
  // const onAllDispatch = () => {
  //   const params = {
  //     vehicle_ids: selectedVehicleIds
  //   }
  //   if (loading1) return false;
  //   setLoading1(true)
  //   postDispatchAllVehicles(params).then((res) => {
  //     if (res.code === 0) {
  //       fetchVehicleControl(page)
  //     }
  //     setErrorText(res.message)
  //     setOpen(true)
  //     setLoading1(false)
  //   }).catch((err) => {
  //     message.error('操作失败')
  //     setLoading1(false)
  //   })
  // }

  //  单个车辆调度
  const [loading2, setLoading2] = useState(false)
  // const onDispatch = (id) => {
  //   if (loading2) return false;
  //   setLoading2(true)
  //   postDispatchVehicle({ vehicle_id: id }).then((res) => {
  //     if (res.code === 0) {
  //       message.success('操作成功')
  //       setSelectionModel(initialStateSelectionModel)
  //       // fetchVehicleControl(page)
  //     } else {
  //       message.error(res.message)
  //     }
  //     setLoading2(false)
  //   }).catch((err) => {
  //     message.error('操作失败')
  //     setLoading2(false)
  //   })
  // }

  //  调度历史记录
  const [openHistory, setOpenHistory] = useState(false)
  const [record, setRecord] = useState(null)
  //  调度
  const handleControl = (row, type) => () => {
    switch (type) {
      case 'exclude':
        // onAllDispatch()
        break;
      case 'control':
        // onDispatch(row.id)
        break;
      case 'history':
        setRecord(row)
        setOpenHistory(true)
        break;
    }
  }

  //  显示调度信息dialog显示
  const [open, setOpen] = useState(false)
  const [errorText, setErrorText] = useState('')
  const onClose = (type) => {
    switch (type) {
      case 'history':
        setOpenHistory(false)
        break;
      case 'info':
        setOpen(false)
        setErrorText('')
        setSelectionModel(initialStateSelectionModel)
        break;
    }
  }

  return (
      <Box sx={{ width: '100%' }}>
        {
            (tableData.length > 0 && isRoot()) && <Button
                variant="contained"
                onClick={handleControl(null, 'exclude')}
                disabled={selectedVehicleIds.length === 0}
                loading={loading1}>
              一键调度
            </Button>
        }
        <Box sx={{ mb: 2 }} />
        <Box sx={{ height: 'calc(100vh - 250px)' }}>
          {/*  isRowSelectable={(params) => params.row.control_status === '2'} */}
          <CustomTable
              column={getColumn()}
              tableData={tableData}
              rowKeyProp="__index"
              rowHeight={90}
              hideFooter
              checkboxSelection
              isRowSelectable={(params) => params.row.control_status === '2'}
              rowSelectionModel={selectionModel}
              onRowSelectionModelChange={(rowSelectionModel) => changeSelectionModal('add', rowSelectionModel)}
          />
        </Box>
        <CustomPagination
            total={total}
            pageSize={PAGE_SIZE}
            page={page}
            totalPage={totalPage}
            savePage={savePage}
        />

        <ControlErrorDialog
            open={open}
            data={errorText}
            onClose={() => onClose('info')}
        />

        <ControlHistoryDialog
            open={openHistory}
            data={record}
            onClose={() => onClose('history')}
        />
      </Box>
  )
}
export default CarControl