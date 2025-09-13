//  轻微圆角
import {Box} from "@mui/material";

export const renderRadiusContained = (value) =>
(c = 'grey') =>
    (radius = 1) => (
        <Box
            component="div"
            sx={{
              width: 'auto',
              height: '24px',
              backgroundColor: c,
              borderRadius: radius,
              display: 'inline-flex',
              alignItems: 'center',
              px: 1,
              color: 'white',
              fontSize: '14px',
            }}>
          {value}
        </Box>
    )

//  圆形
export const renderCircleContained = (params) => (classname) => (s) => {
  return (
      <Box
          sx={{
            width: s,
            height: s,
            backgroundColor: classname,
            borderRadius: '50%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}>
        {params.value}
      </Box>
  )
}