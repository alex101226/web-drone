import {Box} from "@mui/material";

const CustomImage = (props) => {
  const {w = 60, h = 60, radius = 1, img, fit = 'cover'} = props
  return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        height: '100%',
      }}>
        <Box
            component="img"
            src={ img ? globalThis.CONSTANTS.STATIC_URL + img : null }
            alt=""
            sx={{
              width: w,
              height: h,
              objectFit: fit,
              borderRadius: radius,
              backgroundColor: '#ccc',
            }}
        />
      </Box>
  )
}
export default CustomImage;