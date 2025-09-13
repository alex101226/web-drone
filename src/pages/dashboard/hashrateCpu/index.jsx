import { useState, useEffect } from 'react';
import {Box} from '@mui/material'
import CustomTabs from '@/components/customTabs'
import CustomCard from '@/components/customCard'
import Count5 from './components/count5'
import Count6 from './components/count6'
import {genTasks} from '../mock'
import {getTasks, taskStats} from '@/services'


const HashrateCpu = () => {
  //  切换tab
  const [activeTab, setActiveTab] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const [tabs, setTabs] = useState([])

  //  统计数据
  const [counts, setCounts] = useState({})
  const fetchTaskCounts = () => {
    taskStats().then((res) => {
      if (res.code === 0) {
        setCounts(res.data)
      }
    })
  }

  //  任务数据
  const [taskList, setTaskList] = useState([])
  const fetchTasks = () => {
    const params = {
      page: 1,
      pageSize: 1000
    }
    getTasks(params).then((res) => {
      if (res.code === 0) {
        setTaskList(res.data.data)
      }
    })
  }

  const initFetch = () => {
    fetchTaskCounts()
    fetchTasks()
  }
  useEffect(() => {
    initFetch()
  }, [])

  //  初始化赋值给tabs
  useEffect(() => {
    const tasks = genTasks(30)
    const allTab = {
      id: 0,
      label: '概览',
      key: 'all',
      children: counts,
    }
    setTabs([allTab])
    //  初始化默认tab选项
    setActiveTab(allTab.id)
  }, [])

  const setTab = (id, index) => {
    setActiveTab(id)
    setActiveIndex(index)
  }

  const currentChildren = () => {
    const find = tabs.find((tab) => tab.id === activeTab)
    return find ? find.children : []
  }

  return (
      <Box sx={{ flex: 1, minHeight: 0 }}>
        <CustomCard>
          <CustomTabs
              activeTabValue={activeTab}
              tabs={tabs}
              fields={{ label: 'label', value: 'id' }}
              saveTab={setTab}
          />
          <Box sx={{ mt: 3 }} />
          <Count5 activeIndex={activeIndex} data={counts} />
        </CustomCard>

        <Box sx={{ mt: 4 }}>
          <Count6 list={taskList} data={counts} />
        </Box>
      </Box>
  );
}
export default HashrateCpu;