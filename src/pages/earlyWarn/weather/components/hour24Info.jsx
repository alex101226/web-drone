import CustomCard from "@/components/customCard";
import {Box, Grid, Typography} from "@mui/material";
import {weatherIconFilter} from "@/filters";
import CloudIcon from "@mui/icons-material/Cloud";
import {coverDateString} from "@/utils/index.js";

const Hour24Info = ({ list }) => {

  const renderAction = () => {
    return (
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          flex: 1,
          p: 0.5,
        }}>
          <Typography component="p" variant="p" fontWeight="700">
            24小时天气预报
          </Typography>
        </Box>
    )
  }

  const { renderWeatherIcon } = weatherIconFilter()
  const renderContent = () => {
    return (
        <Grid container spacing={2}>
          {list.map((hour, idx) => (
              <Grid key={idx} size={2}>
                <Box
                    sx={{
                      border: '1px solid #ccc',
                      borderRadius: 2,
                      p: 1,
                      textAlign: 'center',
                    }}
                >
                  <Typography variant="body2">
                    {coverDateString(hour.data_time, '12')}
                  </Typography>
                  <Box sx={{ my: 1 }}>
                    {renderWeatherIcon(hour.text, 24, '#333')}
                  </Box>
                  <Typography variant="body1">{hour.weather_text}</Typography>
                  <Typography variant="body2">{hour.temp_fc}℃</Typography>
                  <Typography variant="body2">
                    {hour.wind_dir}  {hour.wind_class}
                  </Typography>
                </Box>
              </Grid>
          ))}
        </Grid>
    )
  }
  return (
      <CustomCard
          actionChildren={renderAction()}
          children={renderContent()}
      />
  )
}
export default Hour24Info