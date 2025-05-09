import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskCard from './TaskCard';
import Pagination from './Pagination';

axios.defaults.withCredentials = true;

const TasksListWidget = () => {
    const [tasks, setTasks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const tasksPerPage = 6;

    useEffect(() => {
        const fetchTasks = () => {

        const response = axios.get(`http://127.0.0.1:8000/tasks?page=${currentPage}&limit=${tasksPerPage}`)
        .then((response) => {
            setTasks(response.data.tasks);
            setTotalPages(response.data.total_pages);
        });
    };
    
        fetchTasks();
    }, [currentPage]);

    const getDifficultyLabel = (difficulty) => {
        switch (difficulty) {
            case 'easy':
                return 'Легко';
            case 'medium':
                return 'Нормально';
            case 'hard':
                return 'Сложно';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'active':
                return 'Активно';
            case 'completed':
                return 'Завершено';
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="w-screen h-screen p-8 overflow-y-auto flex flex-col" style={{ backgroundColor: '#002040' }}>
            <h2 className="text-2xl font-bold mb-14 text-center text-white">Список заданий</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-0.5 md:gap-x-2 place-items-center">
                {tasks.map((task) => (
                    <TaskCard
                    key={task.id}
                    id={task.id}
                    employer_name={task.employer_name}
                    title={task.title}
                    difficulty={getDifficultyLabel(task.difficulty)} 
                    status={getStatusLabel(task.status)}
                    fullTask={task}
                />
                ))}
            </div>
            
            <div className="mt-auto">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>
    </div>
    );
};

export default TasksListWidget;