import {Box, Typography, Stack, styled} from '@mui/material'
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { useAnimate } from '@mui/x-charts/hooks';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { interpolateObject } from '@mui/x-charts-vendor/d3-interpolate';
// import dayjs from 'dayjs';

import CustomCard from "@/components/customCard/index.jsx";

const Text = styled('text')(({ theme }) => ({
  ...theme?.typography?.body2,
  stroke: 'none',
  fill: (theme.vars || theme)?.palette?.text?.primary,
  transition: 'opacity 0.2s ease-in, fill 0.2s ease-in',
  textAnchor: 'middle',
  dominantBaseline: 'central',
  pointerEvents: 'none',
}));

function BarLabel(props) {
  const {
	seriesId,
	dataIndex,
	color,
	isFaded,
	isHighlighted,
	classes,
	xOrigin,
	yOrigin,
	x,
	y,
	width,
	height,
	layout,
	skipAnimation,
	...otherProps
  } = props;

  const animatedProps = useAnimate(
	{ x: x + width / 2, y: y - 8 },
	{
	  initialProps: { x: x + width / 2, y: yOrigin },
	  createInterpolator: interpolateObject,
	  transformProps: (p) => p,
	  applyProps: (element, p) => {
		element.setAttribute('x', p.x.toString());
		element.setAttribute('y', p.y.toString());
	  },
	  skip: skipAnimation,
	},
  );

  return (
	<Text {...otherProps} fill={color} textAnchor="middle" {...animatedProps} />
  );
}

const Count2 = (props) => {
	const {xAxis = [], totalData = []} = props
  // 生成24小时折线图数据
  // const last7Days = Array.from({ length: 7 }).map((_, i) =>
	// dayjs().subtract(6 - i, "day").format("MM/DD")
  // );

  const renderHeader = () => {
	return (
	  <Stack direction="row" spacing={1} alignItems="center">
		<Box sx={{width: 4, height: 16, background: 'var(--custom-input-border-color)'}}/>
		<Stack direction="row" alignItems="baseline">
		  <Typography component="p" variant="body2">
			飞行时长
		  </Typography>
		  <Typography component="p" variant="caption" color="textSecondary">
			小时
		  </Typography>
		</Stack>
	  </Stack>
	)
  }

  return (
	<CustomCard
	  cardType="outlined"
	  actionChildren={renderHeader()}
	>
	  <ChartContainer
		xAxis={[{ scaleType: 'band', data: xAxis }]}
		series={[{ type: 'bar', id: 'base', data: totalData }]}
		yAxis={[{ width: 16 }]}
		margin={{ left: 0, right: 0 }}
	  >
		<BarPlot barLabel="value" slots={{ barLabel: BarLabel }} />
		<ChartsXAxis />
		<ChartsYAxis />
	  </ChartContainer>
	</CustomCard>
  )
}
export default Count2