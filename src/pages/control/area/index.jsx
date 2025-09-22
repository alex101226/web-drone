import { useState, useEffect } from 'react';
import {Box} from '@mui/material';
import CustomTable from "@/components/customTable";
import { getRegion } from "@/services";
import {renderCellExpand} from "@/components/CustomCellExpand/index.jsx";

const Area = () => {
  const getColumn = [
    { headerName: '序号', field: 'id', flex: 1, minWidth: 270, renderCell: renderCellExpand },
    { headerName: '区域名称', field: 'name', flex: 1, minWidth: 150 },
    {
      headerName: '区域编码',
      field: 'district_id',
      flex: 1,
      minWidth: 150,
    },
    {
      headerName: '经纬度',
      field: 'route_name',
      flex: 1, minWidth: 150,
      renderCell: (params) => {
        return renderCellExpand({ ...params, value: `${params.row.lng}, ${params.row.lat}`})
      }
    },
  ]
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([])
  const fetchRegion = () => {
    setLoading(true)
    getRegion().then(res => {
      if (res.code === 0) {
        setTableData(res.data)
      }
      setLoading(false)
    }).catch(err => {
      setLoading(false)
    })
  }
  useEffect(() => {
    fetchRegion()
  }, [])

  return (
      <Box sx={{ height: 'calc(100vh - 100px)' }}>
        <CustomTable
            loading={loading}
            column={getColumn}
            tableData={tableData}
            rowKeyProp="id"
            rowHeight={80}
            hideFooter
        />
      </Box>
  )
}
export default Area