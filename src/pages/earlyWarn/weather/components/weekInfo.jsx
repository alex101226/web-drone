import CustomCard from "@/components/customCard";
import {Box, Divider, Grid, Typography} from "@mui/material";
import {Fragment} from "react";
import {weatherIconFilter} from "@/filters";

const WeekInfo = ({list}) => {

  const { renderWeatherIcon } = weatherIconFilter()

  const renderContent = (item) => {
    return (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}>
          <Typography textAlign="center">
            {item.week}
          </Typography>
          <Box sx={{ mb: 2 }} />
          <Divider sx={{ width: '100%' }} />
          <Box sx={{ mb: 2 }} />
          {renderWeatherIcon(item.text_day, 24, '#000')}
          <Box sx={{ mb: 2 }} />
          <Typography textAlign="center" component="p" variant="body2">
            {item.low}° ~ {item.high}°
          </Typography>
          <Box sx={{ mb: 2 }} />
          <Typography textAlign="center" component="p" variant="body2">
            {item.wc_day}风
          </Typography>
          <Box sx={{ mb: 2 }} />
          <Typography textAlign="center" component="p" variant="body2">
            {item.wd_day}
          </Typography>
        </Box>
    )
  }
  return list.map((item, index) => (
      <Grid key={index} spacing={2} size={3}>
        <CustomCard
            sx={{borderRadius: 8}}
            cardType="outlined"
            children={renderContent(item)}
        />
      </Grid>
  ))
}
export default WeekInfo