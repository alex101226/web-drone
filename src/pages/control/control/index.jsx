import { useState, useEffect } from 'react';
import {Box, IconButton, Typography, styled, Autocomplete, Stack, TextField} from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CustomTable from '@/components/customTable'
import { renderCellExpand } from '@/components/CustomCellExpand'
import CustomPagination from '@/components/customPagination'
import {renderEmptyFilter, dispatchStatusFilter} from '@/filters';
import {getDict, getDispatch} from '@/services'
import {useUtils} from '@/hooks/useUtils.js'

const Text = styled(Typography)({
  WebkitLineClamp: 2,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  fontSize: '14px',
  whiteSpace: 'break-spaces',
})

const PAGE_SIZE = 10
const CarControl = () => {
  const { onCopy } = useUtils()

  const [statusOptions, setStatusOptions] = useState([])
  const fetchDict = () => {
    getDict({ type: 'nest_task_status' }).then((res) => {
      if (res.code === 0) {
        setStatusOptions(res.data)
      }
    })
  }
  useEffect(() => {
    fetchDict()
  }, []);

  const {DISPATCH_STATUS_OPTIONS, renderDispatchStatus} = dispatchStatusFilter()
  const getColumn = () => {
    return [
      { headerName: '任务名称', field: 'task_name', flex: 1, minWidth: 270, renderCell: renderCellExpand },
      { headerName: '无人机名称', field: 'drone_name', flex: 1, minWidth: 150 },
      {
        headerName: '调度状态',
        field: 'status',
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
      { headerName: '预计时长（H）', field: 'expect_complete_time', flex: 1, minWidth: 150, renderCell: renderEmptyFilter },
      {
        headerName: '飞手',
        field: 'operator_name',
        flex: 2,
        minWidth: 150,
      },
    ]
  }
  const [tableData, setTableData] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  const [searchParams, setSearchParams] = useState({
    page: 1,
    status: ''
  })
  const [loading, setLoading] = useState(false);

  const fetchDispatch = (p = 1) => {
    const params = {
      ...searchParams,
      pageSize: PAGE_SIZE,
    }
    setLoading(true)
    getDispatch(params).then(({ data, code }) => {
      if (code === 0) {
        setTotalPage(data.totalPages)
        setTotal(data.total)
        setTableData(data.data)
      }
      setLoading(false)
    }).catch((err) => {
      setLoading(false)
    })
  }
  useEffect(() => {
    fetchDispatch()
  }, [searchParams])

  //  分页
  const savePage = (page) => {
    setSearchParams({
      ...searchParams,
      page
    })
  }

  //  状态搜索
  const handleSearch = (event, row) => {
    setSearchParams({ ...searchParams, status: row.sort})
  }

  //  重置
  const resetSearch = () => {
    setSearchParams({ ...searchParams, status: '' })
  }

  return (
      <Box sx={{ width: '100%' }}>
        <Stack spacing={2} direction="row" alignItems="center" sx={{my: 2}}>
          <Typography component="p" variant="p">选择调度状态：</Typography>
          <Autocomplete
              freeSolo
              disableClearable
              sx={{ width: 300 }}
              options={statusOptions}
              getOptionKey={(option) => option.sort}
              getOptionLabel={(option) => option.dict_label || ''}
              isOptionEqualToValue={(option, value) => option.sort === value.sort}
              onChange={handleSearch}
              onInputChange={resetSearch}
              renderInput={(params) => (
                  <TextField
                      {...params}
                      size="small"
                      label=""
                      placeholder="请选择调度状态"
                      slotProps={{
                        input: {
                          ...params.InputProps,
                          type: 'search',
                        },
                      }}
                  />
              )}
          />
        </Stack>
        <Box sx={{ height: 'calc(100vh - 250px)' }}>
          <CustomTable
              loading={loading}
              column={getColumn()}
              tableData={tableData}
              rowKeyProp="id"
              rowHeight={80}
              hideFooter
          />
        </Box>
        <CustomPagination
            total={total}
            pageSize={PAGE_SIZE}
            page={searchParams.page}
            totalPage={totalPage}
            savePage={savePage}
        />

        {/*<ControlErrorDialog*/}
        {/*    open={open}*/}
        {/*    data={errorText}*/}
        {/*    onClose={() => onClose('info')}*/}
        {/*/>*/}
      </Box>
  )
}
export default CarControl