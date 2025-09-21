// theme.js
import { createTheme } from '@mui/material/styles';
import { zhCN } from '@mui/material/locale';
import { zhCN as dataGridZhCN } from '@mui/x-data-grid/locales';
import { zhCN as dateZhCN } from '@mui/x-date-pickers/locales';

const themes = {
  light: {
    mode: 'light',
    primary: {
      main: '#fff',
      paper: '#333',
    },
  },
  blue: {
    mode: 'light',
    primary: {
      main: '#376fd0',
      paper: '#fff',
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
        defaultProps: {
          disableRipple: true,
        },
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
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--custom-input-border-color)",
            },
          },
          input: {
            '&:-webkit-autofill': {
              WebkitBoxShadow: '0 0 0 100px transparent inset',
              WebkitTextFillColor: 'var(--custom-palette-typography)',
              caretColor: 'var(--custom-palette-typography)',
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
      MuiCheckbox: {
        styleOverrides: {
          root: {
            '&.Mui-checked': {
              color: 'var(--custom-palette-color-3)',
            }
          }
        }
      }
    },
  }, zhCN, dataGridZhCN, dateZhCN);
};
