import {Drawer as MuiDrawer, List, Toolbar, styled} from '@mui/material';
import { useSidebar } from '@/store/index.js';
import SystemLogo from "@/layout/components/systemLogo.jsx";

const openedMixin = (theme) => ({
  width: 240,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme }) => ({
      flexShrink: 0,
      whiteSpace: 'nowrap',
      boxSizing: 'border-box',
      variants: [
        {
          props: ({ open }) => open,
          style: {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': {
              backgroundColor: 'var(--custom-palette-background-paper)',
              color: 'var(--custom-menu-color)',
              ...openedMixin(theme)
            },
          },
        },
        {
          props: ({ open }) => !open,
          style: {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
          },
        },
      ],
    }),
);

const Sidebar = ({ children }) => {
  const { openSidebar } = useSidebar();
  //  修改
  const onClose = () => {
    // setSidebar(false)
  }

  return (
      <Drawer
          variant="permanent"
          elevation={0}
          open={openSidebar}
          onClose={onClose}
      >
        <Toolbar>
          <SystemLogo show={false} />
        </Toolbar>
        <List>
          {children}
        </List>
      </Drawer>
  );
}
export default Sidebar;
