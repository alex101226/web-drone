// theme.js
import { createTheme } from '@mui/material/styles';
import { zhCN } from '@mui/material/locale';
import { zhCN as dataGridZhCN } from '@mui/x-data-grid/locales';
import { zhCN as dateZhCN } from '@mui/x-date-pickers/locales';


const themes = {
  dark: {
    mode: 'dark',
    primary: {
      main: '#1b2635',
      // paper: '#233044',
    },
    background: {
      paper: '#233044',
    }
  },
  light: {
    mode: 'light',
    primary: {
      main: '#fff',
      // paper: '#fff',
    },
  },
  blue: {
    mode: 'light',
    primary: {
      main: '#376fd0',
      // paper: '#376fd0',
    },
  },
}
export const getMuiTheme = (mode = 'light') => {
  return createTheme({
    cssVariables: true,
    palette: themes[mode],
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: 'var(--custom-appbar-background)',
            color: 'var(--custom-palette-typography)',
          }
        }
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            "&:hover": {
              backgroundColor: "transparent",
            },
          },
        },
      },
      MuiGridColumnMenu: {
        defaultProps: {
          disableRipple: true,
        },
        styleOverrides: {
          root: {
            backgroundColor: 'var(--custom-appbar-background)',
          }
        }
      },
      MuiDataGrid: {
        styleOverrides: {
          root: {
            borderColor: 'transparent',
            backgroundColor: 'var(--custom-card-background)',
            '& .MuiDataGrid-columnHeaders': {
              '.MuiDataGrid-scrollbarFiller': {
                backgroundColor: 'var(--custom-card-background)',
              },
              '.MuiDataGrid-filler': {
                backgroundColor: 'var(--custom-card-background)',
              }
            },
            '& .MuiDataGrid-columnSeparator': {
              width: '0',
            },
            // 单个表头单元格
            '& .MuiDataGrid-columnHeader': {
              fontWeight: 'bold',
              backgroundColor: 'var(--custom-card-background)',
              // pointerEvents: 'none',
              // cursor: 'not-allowed',
              '&:hover': {
                backgroundColor: 'var(--custom-card-background)',
              },
            },
            '& .MuiDataGrid-row': {
              '&:hover': {
                backgroundColor: 'var(--custom-card-background)',
              },
              '&.Mui-selected': {
                backgroundColor: 'var(--custom-card-background)',
                '&:hover': {
                  backgroundColor: 'var(--custom-card-background)',
                },
              }
            }
          },
        }
      },
      MuiButton: {
        defaultProps: {
          disableRipple: true,
        },
        styleOverrides: {
          textPrimary: {
            color: 'rgb(14, 115, 208)',
            textDecoration: 'underline'
          },
          containedPrimary: {
            // backgroundColor: 'var(--custom-palette-primary-color)',
            // color: 'var(--custom-palette-color-2)',
            "&:hover": {
              backgroundColor: 'var(--custom-palette-background-paper)',
            },
          },
          outlinedPrimary: {
            borderColor: 'var(--custom-input-border-color)',
            color: 'var(--custom-input-border-color)',
            "&:hover": {
              borderColor: 'var(--custom-input-border-color)',
              backgroundColor: 'none',
            },
          },
        }
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            // "&:hover .MuiOutlinedInput-notchedOutline": {
            //   borderColor: "#4caf50",
            // },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--custom-input-border-color)",
              // borderWidth: "2px",
            },
          },
          input: {
            '&:-webkit-autofill': {
              //  aliceblue
              // WebkitBoxShadow: 'aliceblue',
              WebkitBoxShadow: '0 0 0 100px transparent inset',
              WebkitTextFillColor: 'var(--custom-palette-typography)',
              caretColor: 'var(--custom-palette-typography)',
            },
            '&:-internal-autofill-selected': {
              // backgroundColor: 'transparent',
            },
          },
        }
      },
      MuiListItemButton: {
        defaultProps: {
          disableRipple: true,
        },
      },
      MuiTabs: {
        styleOverrides: {
          indicator: {
            backgroundColor: 'var(--custom-palette-color-3)',
          }
        }
      },
      MuiTab: {
        defaultProps: {
          disableRipple: true,
        },
        styleOverrides: {
          root: {
            '&.Mui-selected': {
              color: 'var(--custom-palette-color-3)',
            }
          }
        }
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            "&.Mui-focused": {
              color: 'var(--custom-input-border-color)',
            },
          },
        },
      },
    },
  }, zhCN, dataGridZhCN, dateZhCN);
};
