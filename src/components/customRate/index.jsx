import {Box} from "@mui/material";

const CustomRate = (props) => {
  const { rate = '0%', color = 'rgb(47, 103, 201)' } = props;

  return (
      <Box component="div" sx={{
        position: 'relative',
        width: '100%',
        height: '24px',
        border: `1px solid ${color}`,
        display: 'inline-flex',
        alignItems: 'center',
        overflow: 'hidden',
        borderRadius: '2px'
      }}>
        <Box
            component="div"
            sx={{
              position: 'absolute',
              width: '100%',
              lineHeight: '22px',
              display: 'flex',
              justifyContent: 'center',
        }}>
          {rate}
        </Box>
        <Box sx={{
          width: rate,
          height: '100%',
          backgroundColor: color,
        }} />
      </Box>
  )
}
export default CustomRate