import * as React from 'react';
import CustomCard from '@/components/customCard'
import { BarChart } from '@mui/x-charts/BarChart';

export function valueFormatter(value) {
  return `${value}人`;
}

const chartSetting = {
  series: [{ dataKey: 'people_number', valueFormatter }],
  height: 300,
  margin: { left: 0 },
  hideLegend: true,
  borderRadius: 10,
  showToolbar: false,
}

export default function TickPlacementBars(props) {
  const { data } = props;

  return (
      <CustomCard>
        <BarChart
            dataset={data}
            xAxis={[{
              dataKey: 'area_name',
              tickPlacement: 'middle',
              tickLabelPlacement: 'middle',
              scaleType: 'band'
            }]}
            {...chartSetting}
        />
      </CustomCard>
  );
}
