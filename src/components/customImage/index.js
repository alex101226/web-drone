import {Box} from "@mui/material";

const CustomImage = (props) => {
  const {w, h, radius, img, mt, fit} = props
  return (
      <Box
          component="img"
          src={ img }
          alt=""
          sx={{ width: w, height: h, objectFit: fit, mt: mt, borderRadius: radius, }}
      />
  )
}
export default CustomImage;