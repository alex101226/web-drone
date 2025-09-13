import * as React from 'react';
import {CardContent, Card, CardActions} from '@mui/material';

/**
 *@children CardContent jsx
 * @cardType Card type, contained | outlined
 * @actionChildren CardActions jsx
 * @cardActionStyle CardActions style
 */
const CustomCard = (props) => {
  const { children, cardType = 'contained', actionChildren, cardActionStyle, ...resetProps } = props
  return (
    <Card variant={cardType} {...resetProps}>
      {
        actionChildren && <CardActions sx={cardActionStyle}>{actionChildren}</CardActions>
      }
      <CardContent>
        { children }
      </CardContent>
    </Card>
  )
}
export default CustomCard;