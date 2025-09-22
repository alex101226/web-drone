import CustomCard from "@/components/customCard";
import {Box, Grid, Typography} from "@mui/material";
import { renderEmptyFilter } from "@/filters";

const TodayInfo = ({ data }) => {

  const renderAction = () => {
    return (
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          flex: 1,
          p: 0.5,
        }}>
          <Typography component="h6" variant="h6">
            { renderEmptyFilter({value: data.city_name}, false) }
          </Typography>
          <Typography component="h6" variant="h6">
            { renderEmptyFilter({value: data.uptime}, false) }
          </Typography>
        </Box>
    )
  }

  const renderContent = () => {
    return (
        <Box sx={{position: 'relative'}}>
          <Typography component="h2" variant="h3" fontWeight="bold">
            {renderEmptyFilter({value: data.temperature}, false)}℃
          </Typography>
          <Typography component="div" variant="body2">
            湿度：{ renderEmptyFilter({value: data.humidity}, false) }%
          </Typography>
          <Typography component="div" variant="body2">
            风力等级：{ renderEmptyFilter({value: data.wind_class}, false) }
          </Typography>
          <Grid container spacing={1}>
            <Grid size={6}>
              <Typography component="div" variant="body2">
                风向：{ renderEmptyFilter({value: data.wind}, false) }
              </Typography>
            </Grid>
            <Grid size={6}>
              <Typography component="div" variant="body2">
                风向角度：{ renderEmptyFilter({value: data.wind_angle}, false) }°
              </Typography>
            </Grid>
          </Grid>

          <Grid container spacing={1}>
            <Grid size={6}>
              <Typography component="div" variant="body2">
                气压：{ renderEmptyFilter({value: data.pressure}, false) }
              </Typography>
            </Grid>
            <Grid size={6}>
              <Typography component="div" variant="body2">
                能见度：{ renderEmptyFilter({value: data.vis}, false) }m
              </Typography>
            </Grid>
          </Grid>
         <Box sx={{position: 'absolute', top: '-13px', right: '5px'}}>
           {data.icon}
         </Box>
        </Box>
    )
  }
  return (
      <CustomCard
          actionChildren={renderAction()}
          children={renderContent()}
          cardActionStyle={{
            backgroundColor: '#0F828C',
          }}
          cardContentStyle={{
            backgroundColor: '#78B9B5',
            p: 1
          }}
          sx={{
            borderRadius: 8
          }}
      />
  )
}
export default TodayInfo