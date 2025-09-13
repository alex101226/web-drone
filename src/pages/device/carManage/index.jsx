import {useState, useEffect} from 'react';
import {Box, Button} from '@mui/material'
import {carStatusFilter} from '@/filters';
import CustomTable from "@/components/customTable";
import CustomPagination from '@/components/customPagination';
import CustomImage from '@/components/customImage'
import { renderCellExpand } from '@/components/CustomCellExpand'
import SaveCarDrawer from './components/saveCarDrawer'
import DetailsDrawer from './components/deletesDrawer'
import { getVehicle } from '@/services'
import { useUserStore } from '@/store'


const CarRegister = () => {
  const { userInfo } = useUserStore()

  const isRoot = () => {
    return userInfo?.role_name === 'root'
  }

  const {CAR_STATUS_OPTIONS, renderCarStatus} = carStatusFilter()
  const getColumn = () => {
    const columns = [
      {
        headerName: '车辆照片',
        field: 'vehicle_photo',
        flex: 1,
        minWidth: 80,
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
      { headerName: '车辆名称', field: 'vehicle_alias', renderCell: renderCellExpand, flex: 1, minWidth: 150,},
      // { headerName: '车辆品牌', field: 'brand', renderCell: renderCellExpand, flex: 1, minWidth: 150, },
      // { headerName: '系列号', field: 'series_number', renderCell: renderCellExpand, flex: 1, minWidth: 150,},
      // { headerName: 'VIN码', field: 'vin_code', renderCell: renderCellExpand, flex: 1, minWidth: 150,},
      { headerName: '里程数/KG', field: 'mileage', renderCell: renderCellExpand, flex: 1, minWidth: 150,},
      { headerName: '燃油类型', field: 'fuel_type', renderCell: renderCellExpand, flex: 1, minWidth: 150,},
      // { headerName: '发动机号', field: 'engine_number', renderCell: renderCellExpand, flex: 1, minWidth: 150,},
      // {
      //   headerName: '车辆位置',
      //   field: 'location',
      //   renderCell: renderCellExpand,
      //   flex: 1, minWidth: 150,
      // },
      { headerName: '所属部门', field: 'department', renderCell: renderCellExpand, flex: 1, minWidth: 150, },
      { headerName: '负责人', field: 'operator_nickname', renderCell: renderCellExpand, flex: 1, minWidth: 150, },
      {
        headerName: '车辆状态',
        field: 'status',
        flex: 1, minWidth: 150,
        renderCell: (params) => renderCarStatus(params.value.toString()),
        valueOptions: CAR_STATUS_OPTIONS,
      },
      { headerName: '备注信息', field: 'remark', flex: 1, minWidth: 150, renderCell: renderCellExpand, },
    ]
    if (!isRoot()) {
      return columns
    }
    return [
      ...columns,
      {
        headerName: '操作',
        field: 'action',
        flex: 1, minWidth: 180,
        renderCell: (params) => {
          return <Box>
            <Button onClick={onEdit('edit', params.row)}>
              修改
            </Button>
            <Button onClick={() => handleOpenDetails(params.row)}>
              查看详情
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
  const fetchVehicle =  (p = 1) => {
    const params = {
      page: p,
      pageSize: 10,
    }
    getVehicle(params).then((res) => {
      if (res.code === 0) {
        setTotal(res.data.total)
        setTotalPages(res.data.totalPages)
        setData(res.data.data)
      }
    })
  }

  useEffect(() => {
    fetchVehicle()
  }, [])

  //  分页查看
  const savePage = (page) => {
    fetchVehicle(page)
    setPage(page)
  }

  //  添加修改open
  const [saveOpen, setSaveOpen] = useState(false);
  const [record, setRecord] = useState(null);
  const [type, setType] = useState('add');
  const onEdit = (type, row) => () => {
    setRecord(row ? row : null)
    setType(type)
    setSaveOpen(true)
  };

  //  关闭活动窗口
  const onClose = (type, flag) => {
    setRecord(null)
    switch (type) {
      case 'save':
        setSaveOpen(false)
          if (flag) {
            fetchVehicle(page)
          }
        break;
    }
  }

  //  查看详情
  const [openDetails, setOpenDetails] = useState(false)
  const handleOpenDetails = (row) => {
    setRecord(row)
    setOpenDetails(true)
  }
  //  关闭
  const onDetailsClose = () => {
    setRecord(null)
    setOpenDetails(false)
  }

  return (
    <Box sx={{ width: '100%' }}>
      { isRoot() && <Button variant="contained" sx={{mb: 2}} onClick={onEdit('add', null)}>
        添加车辆
      </Button>}

      <Box sx={{ height: 'calc(100vh) - 250px' }}>
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
          pageSize={5}
          page={page}
          totalPage={totalPages}
          savePage={savePage}
      />
      <SaveCarDrawer
          open={saveOpen}
          data={ record }
          type={type}
          onClose={ (flag) => onClose('save', flag) }
      />

      <DetailsDrawer open={openDetails} onDetailsClose={onDetailsClose} data={record} />
    </Box>
  )
}
export default CarRegister