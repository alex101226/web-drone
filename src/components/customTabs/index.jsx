import { Tabs, Tab } from '@mui/material';

//   scrollButtons
//   allowScrollButtonsMobile
//   aria-label="scrollable force tabs example"
export default function ScrollableTabsButtonForce(props) {
  const {
    tabs = [],
    fields = { label: 'label', value: 'id' },
    activeTabValue, saveTab,
    ...restProps
  } = props

  const handleChange = (_, newValue) => {
    const findIndex = tabs.findIndex(tab => tab[fields.value] === newValue)
    if (findIndex > -1) {
      saveTab(newValue, findIndex);
    }
  };

  return tabs.length > 0
      ? (
          <Tabs
              value={activeTabValue}
              onChange={handleChange}
              variant="scrollable"
              {...restProps}
          >
            {
              tabs.map(tab => (
                  <Tab
                      key={tab[fields.value]}
                      label={tab[fields.label]}
                      value={tab[fields.value]}
                  />
              ))
            }
          </Tabs>
      ) : null
}
