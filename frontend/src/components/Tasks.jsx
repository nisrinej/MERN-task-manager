import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import Loader from './utils/Loader';
import Tooltip from './utils/Tooltip';

const Tasks = () => {

  const authState = useSelector(state => state.authReducer);
  const [tasks, setTasks] = useState([]);
  const [fetchData, { loading }] = useFetch();
   const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

  const fetchTasks = useCallback(() => {
    const config = { url: "/tasks", method: "get", headers: { Authorization: authState.token } };
    fetchData(config, { showSuccessToast: false }).then(data => setTasks(data.tasks));
  }, [authState.token, fetchData]);

  useEffect(() => {
    if (!authState.isLoggedIn) return;
    fetchTasks();
  }, [authState.isLoggedIn, fetchTasks]);


  const handleDelete = (id) => {
    const config = { url: `/tasks/${id}`, method: "delete", headers: { Authorization: authState.token } };
    fetchData(config).then(() => fetchTasks());
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || (filter === "completed" && task.completed) || (filter === "notCompleted" && !task.completed);
    return matchesSearch && matchesFilter;
  });


  return (
    <>
      <div className="my-2 mx-auto max-w-[700px] py-4">
      
        <div className="flex justify-between mb-4">
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="notCompleted">Not Completed</option>
          </select>
        </div>
        

        {tasks.length !== 0 && <h2 className='my-2 ml-2 md:ml-0 text-xl'>Your tasks ({filteredTasks.length})</h2>}
        {loading ? (
          <Loader />
        ) : (
          <div>
            {filteredTasks.length === 0 ? (

              <div className='w-[600px] h-[300px] flex items-center justify-center gap-4'>
                <span>No tasks found</span>
                <Link to="/tasks/add" className="bg-blue-500 text-white hover:bg-blue-600 font-medium rounded-md px-4 py-2">+ Add new task </Link>
              </div>

            ) : (
              filteredTasks.map((task, index) => (
                <div key={task._id} className='bg-white my-4 p-4 text-gray-600 rounded-md shadow-md'>
                  <div className='flex'>

                    <span className='font-medium'>Task #{index + 1}</span>

                    <Tooltip text={"Edit this task"} position={"top"}>
                      <Link to={`/tasks/${task._id}`} className='ml-auto mr-2 text-green-600 cursor-pointer'>
                        <i className="fa-solid fa-pen"></i>
                      </Link>
                    </Tooltip>

                    <Tooltip text={"Delete this task"} position={"top"}>
                      <span className='text-red-500 cursor-pointer' onClick={() => handleDelete(task._id)}>
                        <i className="fa-solid fa-trash"></i>
                      </span>
                    </Tooltip>

                  </div>
                  <div className='whitespace-pre'>{task.description}</div>
                </div>
              ))

            )}
          </div>
        )}
      </div>
    </>
  )

}

export default Tasks