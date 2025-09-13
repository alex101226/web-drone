import {useEffect, useState} from "react";
import {Box} from '@mui/material'
import Count1 from './components/count1'
import { genTasks } from '../mock'
import {getTasks, taskStats} from '@/services'

const HashrateTaskResource = () => {

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

  return (
      <Box>
        <Box sx={{ mb: 2 }}/>
        <Count1 data={counts} list={taskList} />
      </Box>
  )
}
export default HashrateTaskResource;