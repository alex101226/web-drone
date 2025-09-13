import {useState, useEffect} from 'react';
import {Box, Button, Typography} from '@mui/material'
import { renderCellExpand } from '@/components/CustomCellExpand'
import { transportStatusFilter } from '@/filters';
import CustomTable from "@/components/customTable/index.js";
import DetailsDrawer from './components/detailsDrawer'
import LogisticsStepDrawer from './components/logisticsStepDrawer'
import {getTransport} from '@/services'
import { genAllLogistics } from '../mock'

const CarTraffic = () => {
  const [tableData, setTableData] = useState([]);

  const fetchVehicleControl = () => {
    getTransport().then(({ data, code }) => {
      if (code === 0) {
        const vehicleList = data.data ? data.data : []
        const newData = genAllLogistics(vehicleList)
        setTableData(newData)
      }
    })
  }

  useEffect(() => {
    fetchVehicleControl()
  }, [])

  const { TRANSPORT_STATUS_OPTIONS, renderTransportStatus } = transportStatusFilter()
  const getColumn = [
    {
      headerName: '物流ID',
      field: 'task_id',
      renderCell: renderCellExpand,
      flex: 1, minWidth: 170,
    },
    {
      headerName: '订单号',
      field: 'order_ids',
      flex: 1, minWidth: 120,
      renderCell: (params) => {
        return <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'center' }}>
          {
            params.value.map((item, index) => (
                <Typography
                    component="p"
                    variant="p"
                    key={index}
                    lineHeight="24px"
                    noWrap>
                  {item}
                </Typography>
            ))
          }
        </Box>
      }
    },
    {
      headerName: '货物信息',
      field: 'cargoes',
      flex: 1, minWidth: 100,
      // renderCell: (params) => {
      //   const values = params.value ? params.value : []
      //   return <Box sx={{ display: 'flex',  alignItems: 'center', flexWrap: 'wrap' }}>
      //     {
      //       values.map(item => (
      //           <Box key={item.cargo_id} component="div">
      //             { item.name },
      //           </Box>
      //       ))
      //     }
      //   </Box>
      // }
    },
    {
      headerName: '运输状态',
      field: 'status',
      flex: 1, minWidth: 100,
      renderCell: (params) => renderTransportStatus(params.value),
      valueOptions: TRANSPORT_STATUS_OPTIONS,
    },
    { headerName: '起点', field: 'start_location', renderCell: renderCellExpand, flex: 1, minWidth: 260, },
    { headerName: '终点', field: 'end_location', renderCell: renderCellExpand, flex: 1, minWidth: 260, },
    { headerName: '发车时间', field: 'start_time',  renderCell: renderCellExpand, flex: 1, minWidth: 200, },
    { headerName: '预计到达时间', field: 'expected_end_time',  renderCell: renderCellExpand, flex: 1, minWidth: 200, },
    { headerName: '实际到达时间', field: 'end_time',  renderCell: renderCellExpand, flex: 1, minWidth: 200, },
    {
      headerName: '操作',
      field: 'actions',
      flex: 1, minWidth: 200,
      renderCell: ({ row }) => {
        return <Box>
          <Button onClick={() => handleOpen(row)}>查看详情</Button>
          <Button onClick={() => handleLogistics(row)}>查看物流位置</Button>
        </Box>
      }
    }
  ]

  const [open, setOpen] = useState(false)
  const [record, setRecord] = useState({})
  const handleOpen = (row) => {
    setRecord(row)
    setOpen(true)
  }
  const onClose = () => {
    setOpen(false)
  }

  const [openLogistics, setOpenLogistics] = useState(false)
  const handleLogistics = (row) => {
    if (row) {
      setRecord(row)
    }
    setOpenLogistics(!!row)
  }
  return (
      <Box>
        <Box sx={{ height: 'calc(100vh - 120px)' }}>
          <CustomTable
              column={getColumn}
              tableData={tableData}
              rowKeyProp="task_id"
              rowHeight={100}
              hideFooter
          />
        </Box>

        <DetailsDrawer open={open} data={record} onClose={onClose} />

        <LogisticsStepDrawer open={openLogistics} data={record} onLogisticsClose={() => handleLogistics(false)} />
      </Box>
  )
}
export default CarTraffic