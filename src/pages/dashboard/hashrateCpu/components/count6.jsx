import { useMemo } from 'react'
import CustomTable from '@/components/customTable'
import {Box} from "@mui/material";
import { getUsageRate, transNumber } from '@/utils'
import { hashRateFilter } from '@/filters'


const Count6 = (props) => {
  const { data, list } = props

  const tableData = useMemo(() => {
    return list.map((item) => {
      return {
        ...item,
        node_use_rate: getUsageRate(item.nodes, data.total_nodes),
        cpu_use_rate: getUsageRate(item.cpu_number, data.total_cpu),
        gpu_use_rate: getUsageRate(item.gpu_number, data.total_gpu),
      }
    })
  }, [data, list])

  const { TASK_STATUS_OPTIONS, renderTaskStatus } = hashRateFilter()
  const columns = [
    { headerName: '任务', field: 'task_name', flex: 2, minWidth: 200 },
    { headerName: '节点总数', field: 'nodes', flex: 1,  minWidth: 100 },
    {
      headerName: '节点使用率',
      field: 'node_use_rate',
      flex: 1,
      minWidth: 160,
    },
    {
      headerName: 'CPU使用率',
      field: 'cpu_use_rate',
      flex: 1,
      minWidth: 160,
    },
    {
      headerName: 'GPU使用率',
      field: 'gpu_use_rate',
      flex: 1,
      minWidth: 160,
    },
    {
      headerName: '任务状态',
      field: 'status',
      flex: 1,
      minWidth: 160,
      valueOptions: TASK_STATUS_OPTIONS,
      renderCell: (params) => renderTaskStatus(params.value),
    },
  ]

  return (
      <CustomTable
          column={columns}
          tableData={tableData}
          rowKeyProp="id"
          hideFooter
      />
  )
}
export default Count6;