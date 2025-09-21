import CustomCard from "@/components/customCard";
import {Box, Grid, Typography} from "@mui/material";
import {weatherIconFilter} from "@/filters";
import CloudIcon from "@mui/icons-material/Cloud";

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
              <Grid key={idx} item xs={12} sm={6} md={3}>
                <Box
                    sx={{
                      border: '1px solid #ccc',
                      borderRadius: 2,
                      p: 1,
                      textAlign: 'center',
                    }}
                >
                  {/*<Typography variant="body2">{hour.time.slice(11,16)}</Typography>*/}
                  <Box sx={{ fontSize: 40, my: 1 }}>
                    {renderWeatherIcon(hour.text_day) || <CloudIcon />}
                  </Box>
                  <Typography variant="body1">{hour.weather_text}</Typography>
                  <Typography variant="body2">{hour.temperature}℃</Typography>
                  <Typography variant="body2">
                    {hour.wind_dir} 风 {hour.wind_class}
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