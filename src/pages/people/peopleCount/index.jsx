import { useEffect, useState } from 'react';
import {Box, Grid} from '@mui/material'
import CustomTable from "@/components/customTable";
// import CustomRate from '@/components/customRate';
import Count1 from './compoents/count1'
import Count2 from './compoents/count2'
import Count3 from './compoents/count3'
import { renderRadiusContained } from '@/filters'
import { getAreaList } from '@/pages/people/mock'

const PeopleCount = () => {

  const [tableData, setTableData] = useState([])
  useEffect(() => {
    const data = getAreaList()
    setTableData(data)
  }, [])
  const getColumn = [
    { headerName: '风险区域名称', field: 'area_name', flex: 1, },
    {
      headerName: '风险等级',
      field: 'risks',
      flex: 1,
      renderCell: (params) => {
        return renderRadiusContained(params.value?.text)(params.value?.color)()
      }
    },
    {
      headerName: '人员数量',
      field: 'people_number',
      flex: 1,
    },
    {
      headerName: '状态',
      field: 'risk_status',
      flex: 1,
      renderCell: (params) => {
        const color = params.value === '正常' ? 'green' : 'red'
        return renderRadiusContained(params.value)(color)()
      }
    },
    // {
    //   headerName: '风险概率',
    //   field: 'risk_rate',
    //   flex: 1,
    //   renderCell: (params) => {
    //     return <CustomRate rate={params.value} />
    //   }
    // }
  ]

  //  重大风险，较大风险，一般风险，低风险
  return (
      <Box>
        <Count3 data={tableData} />
        <Box sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          <Grid size={8}>
            <CustomTable
                rowKeyProp="id"
                column={ getColumn }
                tableData={tableData}
                hideFooter
            />
          </Grid>
          <Grid size={4}>
            <Box sx={{ height: 340 }}>
              <Count2 data={tableData} />
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mb: 2 }} />
        <Count1 />
      </Box>
  )
}
export default PeopleCount