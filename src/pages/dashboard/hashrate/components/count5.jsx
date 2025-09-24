import {useMemo} from 'react'
import {Grid, Box, Typography, Divider} from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import CustomCard from '@/components/customCard'
import {getTaskChartData} from '@/pages/dashboard/mock'

const pieParams = {
  height: 200,
  margin: { right: 5 },
  hideLegend: true,
};

function PieCenterLabel({ data, dy }) {
  return (
      <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fontSize: 14, fill: '#555' }}
      >
        <tspan x="50%" dy={dy}>{data.label} { data.value }</tspan>
      </text>
  );
}

const PieColor = (props) => {
  const { data } = props
  const currentData = useMemo(() => {
    return data ? getTaskChartData(data) : []
  }, [data])

  //  card action
  const cardAction = (item) => {
    return (
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          flex: 1,
          p: 0.5,
        }}>
          <Typography component="p" variant="p" fontWeight="700">
            { item.title }
          </Typography>
          <Typography component="p" variant="p">
            {item.subTitle} {item.total}
          </Typography>
        </Box>
    )
  }

  //  任务
  const renderTaskCount = (item) => {
    return (
        <Box>
          <Box>
            <Box sx={{ pb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography component="h2" variant="h2" color="rgb(229 225 146)" fontWeight="700">
                {item.running}
              </Typography>
              <Typography component="p" variant="p" fontWeight="700">
                运行中
              </Typography>
            </Box>
            <Divider />
          </Box>
          <Box sx={{ pt: 2 }}>
            <Box>
              <Box sx={{ pb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography component="h2" variant="h2" color="rgb(165, 142, 116)" fontWeight="700">
                  {item.pending}
                </Typography>
                <Typography component="p" variant="p" fontWeight="700">
                  排队中
                </Typography>
              </Box>
              <Divider />
            </Box>
            <Divider />
          </Box>
        </Box>
    )
  }

  const renderPieCount = (item) => {
    return (
        <PieChart
            colors={item.colors}
            series={[
              {
                data: item.seriesData,
                innerRadius: 60,
                outerRadius: 100,
                faded: { additionalRadius: -5 },
              },
            ]}
            {...pieParams}
        >
          <PieCenterLabel data={ item.seriesData[0] } dy="-0.5em" />
          <PieCenterLabel data={ item.seriesData[1] } dy="1.5em" />
        </PieChart>
    )
  }

  return (
      <Grid container spacing={2} sx={{ flex: 1, minWidth: '100%'}}>
        {
          currentData.map((item, index) => (
              <Grid size={ 3 } key={index}>
                <CustomCard
                    cardType="outlined"
                    actionChildren={cardAction(item)}
                    cardActionStyle={{
                      backgroundColor: 'var(--custom-card-action-background)',
                      color: 'var(--custom-menu-color)'
                    }}
                >
                  <Box sx={{pt: 2, pb: 2}}>
                    {
                      index === 3 ? renderTaskCount(item) : renderPieCount(item)
                    }
                  </Box>
                </CustomCard>
              </Grid>
          ))
        }
      </Grid>
  );
}
export default PieColor
