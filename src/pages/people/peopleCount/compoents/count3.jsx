import {useMemo} from 'react'
import {Grid, Box, Typography} from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import CustomCard from '@/components/customCard'
import {getAreaChartData} from '@/pages/people/mock'
import {renderRadiusContained} from "@/filters/index.js";

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
        <tspan x="50%" dy={dy}>{data.label} { data.value }人</tspan>
      </text>
  );
}

const PieColor = (props) => {
  const { data } = props

  const pieData = useMemo(() => {
    if (data.length > 0) {
      return getAreaChartData(data)
    }
    return []
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
            { item.title }区域
          </Typography>
          <Typography component="div" variant="div">
            {
              renderRadiusContained('今日 ')('rgb(55, 111, 208)')()
            }
          </Typography>
        </Box>
    )
  }

  const renderPieCount = (item) => {
    const seriesData = [
      { value: 150, label: '总数', },
      { value: item.used, label: '已聚集', },
    ]
    return (
        <PieChart
            colors={item.colors}
            series={[
              {
                data: seriesData,
                innerRadius: 60,
                outerRadius: 100,
                faded: { additionalRadius: -5 },
              },
            ]}
            {...pieParams}
        >
          <PieCenterLabel data={ seriesData[1] } dy="0" />
        </PieChart>
    )
  }

  return (
      <Grid container spacing={2} sx={{ flex: 1, minWidth: '100%'}}>
        {
          pieData.map((item, index) => (
              <Grid size={3} key={index}>
                <CustomCard
                    cardType="outlined"
                    actionChildren={cardAction(item)}
                    // cardActionStyle={{
                    //   backgroundColor: 'var(--custom-card-action-background)',
                    //   color: 'var(--custom-menu-color)'
                    // }}
                >
                  <Box sx={{pt: 2, pb: 2}}>
                    { renderPieCount(item) }
                  </Box>
                </CustomCard>
              </Grid>
          ))
        }
      </Grid>
  );
}
export default PieColor
