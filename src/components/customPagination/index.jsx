import {Box, Pagination, Typography} from '@mui/material';


const CustomPagination = (props) => {
  const { page, total, totalPage, savePage } = props

  return(
      <Box sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        mt: 2,
      }}>
        <Typography component="p" variant="p">
          总共{ total }条数据
        </Typography>
        <Pagination
            page={page}
            count={totalPage}
            color="primary"
            onChange={(event, page) => savePage(page)}
        />
      </Box>
  )
}
export default CustomPagination;