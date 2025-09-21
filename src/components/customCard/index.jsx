import * as React from 'react';
import {CardContent, Card, CardActions} from '@mui/material';

/**
 *@children CardContent jsx
 * @cardType Card type, contained | outlined
 * @actionChildren CardActions jsx
 * @cardActionStyle CardActions style
 * @cardContentStyle CardContent style
 */
const CustomCard = (props) => {
  const {
    children, cardType = 'contained', actionChildren, cardActionStyle,
    cardContentStyle, ...resetProps } = props
  return (
    <Card variant={cardType} {...resetProps}>
      {
        actionChildren && <CardActions sx={cardActionStyle}>{actionChildren}</CardActions>
      }
      <CardContent sx={cardContentStyle}>
        { children }
      </CardContent>
    </Card>
  )
}
export default CustomCard;