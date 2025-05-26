import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskCard from './TaskCard';
import Pagination from './Pagination';

axios.defaults.withCredentials = true;

const SolvedTasksListWidget = ({ compact = false }) => {
    const [tasks, setTasks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const tasksPerPage = 6;

    useEffect(() => {
        const fetchSolvedTasks = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/tasks/get_solved_tasks?page=${currentPage}&limit=${tasksPerPage}`);
                setTasks(response.data.tasks);
                setTotalPages(response.data.total_pages);
            } catch (error) {
                console.error('Ошибка при получении решённых заданий:', error);
            }
        };

        fetchSolvedTasks();
    }, [currentPage]);

    const getDifficultyLabel = (difficulty) => {
        switch (difficulty) {
            case 'easy': return 'Легко';
            case 'medium': return 'Нормально';
            case 'hard': return 'Сложно';
            default: return difficulty;
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'active': return 'Активно';
            case 'completed': return 'Завершено';
            default: return status;
        }
    };

    const getLogoUrl = (companyName) => {
        if (!companyName) return null;
        return `http://127.0.0.1:8000/files/get_logo/${encodeURIComponent(companyName)}`;
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div 
            className="w-full mx-auto p-8 flex flex-col" 
            style={{ backgroundColor: '#002040', maxWidth: compact ? '900px' : '1200px' }}
        >
            <div className={`grid grid-cols-1 ${compact ? 'sm:grid-cols-1 lg:grid-cols-2' : 'md:grid-cols-2'} gap-y-4 gap-x-2 place-items-center`}>
                {tasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        id={task.id}
                        employer_name={task.employer_name}
                        title={task.title}
                        difficulty={getDifficultyLabel(task.difficulty)} 
                        status={getStatusLabel(task.status)}
                        created_at={task.created_at}
                        fullTask={task}
                        logoUrl={getLogoUrl(task.employer_name)}
                    />
                ))}
            </div>

            <div className="mt-4">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default SolvedTasksListWidget;
