import {useState, useEffect} from 'react';
import {Box, Button} from '@mui/material';
import CustomDialog from '@/components/CustomDialog'
import CustomTable from '@/components/customTable'
import {getUserTrafficHistory} from '@/services'
import {renderCellExpand} from '@/components/CustomCellExpand'
import {coverDateString} from "@/utils/index.js";

const HistoryDataDialog = (props) => {
  const { open, onClose, data } = props;

  const columns = [
    {
      headerName: '序号',
      field: 'index',
      flex: 1,
      renderCell: (params) => {
        const rowIndex = params.api.getRowIndexRelativeToVisibleRows(params.id);
        return rowIndex + 1
      },
    },
    {
      headerName: '用户',
      field: 'nickname',
      flex: 1,
      renderCell: () => {
        return data.nickname
      },
    },
    {
      headerName: '所在位置',
      field: 'location_text',
      flex: 1,
      renderCell: renderCellExpand,
    },
    {
      headerName: '坐标',
      field: 'coordinate',
      flex: 1,
      renderCell: (params) => {
        return renderCellExpand({...params, value: `${params.row.longitude }, ${params.row.latitude}`})
      },
    },
    {
      headerName: '定位时间',
      field: 'created_at',
      flex: 1,
      renderCell: (params) => renderCellExpand({ ...params, value: coverDateString(params.value, '4') }),
    },
  ]

  //  历史轨迹查询
  const [historyData, setHistoryData] = useState([])
  const onHistory = () => {
    getUserTrafficHistory(data.user_id).then((res) => {
      // console.log('res', res)
      if (res.code === 0) {
        setHistoryData(res.data)
      }
    })
  }
  useEffect(() => {
    if (open) {
      onHistory()
    }
  }, [open]);

  //  内容
  const renderContent = () => {
    return <CustomTable columns={columns} tableData={historyData} rowKeyProp="id" />
  }

  //  关闭按钮
  const handleClose = () => {
    onClose(false)
  }

  //  底部
  const renderAction = () => {
    return <Button variant="contained" onClick={handleClose}>
      关闭
    </Button>
  }
  return (
      <CustomDialog
          open={open}
          maxWidth="md"
          title="历史轨迹"
          content={renderContent()}
          actions={renderAction()}
      />
  )
}
export default HistoryDataDialog;