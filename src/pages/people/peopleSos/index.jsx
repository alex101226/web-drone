import { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import CustomTable from '@/components/customTable'
import { getUserSos } from '../mock'
import {renderRadiusContained} from "@/filters/index.js";

const PeopleSos = () => {
  const [tableData, setTableData] = useState([])

  useEffect(() => {
    const data = getUserSos()
    // console.log('data', data)
    setTableData(data)
  }, [])

  const getColumn = [
    {
      headerName: '序号',
      field: 'id',
      flex: 1,
      minWidth: 150
    },
    { headerName: '告警人员', field: 'alert_name', flex: 1, minWidth: 150 },
    { headerName: '告警时间', field: 'alert_time', flex: 1, minWidth: 150 },
    { headerName: '告警位置', field: 'alert_location', flex: 1, minWidth: 150 },
    {
      headerName: '处理状态',
      field: 'status',
      flex: 1,
      minWidth: 150,
      renderCell: (params) => {
        let str = '处理中'
        switch (params.value) {
          case '未处理':
            str = 'red'
            break;
          case '已处理':
            str = 'green';
            break;
          case '处理中':
            str = 'orange'
            break;
        }
        return renderRadiusContained(params.value)(str)(1)
      },
    },
  ]

  return (
      <Box sx={{ height: 'calc(100vh - 100px)' }}>
        <CustomTable
            column={getColumn}
            tableData={tableData}
            rowKeyProp="id"
            hideFooter
        />
      </Box>
  )
}
export default PeopleSos