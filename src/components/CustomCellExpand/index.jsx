import { memo, useRef, useState, useEffect } from 'react';
import {Box, Paper, Popper, Typography} from "@mui/material";

function isOverflown(element) {
  return (
      element.scrollHeight > element.clientHeight ||
      element.scrollWidth > element.clientWidth
  );
}

const GridCellExpand = memo(function GridCellExpand(props) {
  const { width, value } = props;
  const wrapper = useRef(null);
  const cellDiv = useRef(null);
  const cellValue = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showFullCell, setShowFullCell] = useState(false);
  const [showPopper, setShowPopper] = useState(false);

  const handleMouseEnter = () => {
    const isCurrentlyOverflown = isOverflown(cellValue.current);
    setShowPopper(isCurrentlyOverflown);
    setAnchorEl(cellDiv.current);
    setShowFullCell(true);
  };

  const handleMouseLeave = () => {
    setShowFullCell(false);
  };

  useEffect(() => {
    if (!showFullCell) {
      return undefined;
    }

    function handleKeyDown(nativeEvent) {
      if (nativeEvent.key === 'Escape') {
        setShowFullCell(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [setShowFullCell, showFullCell]);

  return (
      <Box
          ref={wrapper}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          sx={{
            alignItems: 'center',
            lineHeight: '24px',
            width: '100%',
            height: '100%',
            position: 'relative',
            display: 'flex',
          }}
      >
        <Box
            ref={cellDiv}
            sx={{
              height: '100%',
              width,
              display: 'block',
              position: 'absolute',
              top: 0,
            }}
        />
        <Box
            ref={cellValue}
            sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {value}
        </Box>
        {showPopper && (
            <Popper
                open={showFullCell && anchorEl !== null}
                anchorEl={anchorEl}
                style={{ width, marginLeft: -17, zIndex: 2000 }}
            >
              <Paper
                  elevation={1}
                  style={{ minHeight: wrapper.current.offsetHeight - 3 }}
              >
                <Typography variant="body2" style={{ padding: 8 }}>
                  {value}
                </Typography>
              </Paper>
            </Popper>
        )}
      </Box>
  );
});


export const renderCellExpand = (params) => {
  return (
      <GridCellExpand value={params.value || ''} width={params.colDef.computedWidth} />
  );
}
export default GridCellExpand;
