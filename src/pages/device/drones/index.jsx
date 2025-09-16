import {useState, useEffect} from 'react';
import {Box, Button} from '@mui/material'
import CustomTable from "@/components/customTable";
import CustomPagination from '@/components/customPagination';
import CustomImage from '@/components/customImage'
import { renderCellExpand } from '@/components/CustomCellExpand'
import PermissionButton from "@/components/permissionButton";
import SaveDroneDrawer from './components/saveDroneDrawer'
import { getDrones } from '@/services'
import {droneStatusFilter} from '@/filters';

const PAGE_SIZE = 10
const CarRegister = () => {
  const {DRONE_STATUS_OPTIONS, renderDroneStatus} = droneStatusFilter()
  const getColumn = () => {
    return [
      {
        headerName: '无人机照片',
        field: 'drone_photo',
        flex: 1,
        minWidth: 100,
        renderCell: (params) => {
          return params.value ? <CustomImage
              w={60}
              h={60}
              fit="cover"
              mt="calc((80px - 60px) / 2)"
              radius={1}
              img={globalThis.CONSTANTS.STATIC_URL + params.value}
          /> : <Box sx={{
            width: 60,
            height: 60,
            borderRadius: 1,
            backgroundColor: '#ccc',
            mt: 'calc((80px - 60px) / 2)' }}
          />
        }
      },
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
          return <Box>
            <Button onClick={() => onAction('edit', params.row)}>
              修改
            </Button>
          </Box>
        }
      },
    ]
  }

  //  获取车辆信息
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const fetchDrone =  (p = 1) => {
    const params = {
      page: p,
      pageSize: PAGE_SIZE,
    }
    getDrones(params).then((res) => {
      if (res.code === 0) {
        setTotal(res.data.total)
        setTotalPages(res.data.totalPages)
        setData(res.data.data)
      }
    })
  }

  useEffect(() => {
    fetchDrone()
  }, [])

  //  分页查看
  const savePage = (page) => {
    fetchDrone(page)
    setPage(page)
  }

  //  添加修改open
  const [saveOpen, setSaveOpen] = useState(false);
  const [record, setRecord] = useState(null);
  const [type, setType] = useState('add');
  const onAction = (type, row) => {
    console.log('检查问题', type)
    setRecord(row ? row : null)
    setType(type)
    setSaveOpen(true)
  };

  //  关闭活动窗口
  const onClose = (type, flag) => {
    if (flag) {
      fetchDrone(page)
    }
    setSaveOpen(false)
  }

  return (
    <Box>
      <PermissionButton module="device" page="drones" action="create" onClick={() => onAction('add', null)}>
        添加无人机
      </PermissionButton>

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
          page={page}
          totalPage={totalPages}
          savePage={savePage}
      />
      <SaveDroneDrawer
          open={saveOpen}
          data={ record }
          type={type}
          onClose={ (flag) => onClose('save', flag) }
      />

      {/*<DetailsDrawer open={openDetails} onDetailsClose={onDetailsClose} data={record} />*/}
    </Box>
  )
}
export default CarRegister