import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskCard from './TaskCard';
import Pagination from './Pagination';
import SolvedTasksListWidget from './SolvedTasksList'; // Подключаем компонент решённых заданий
import { Tabs } from 'antd';

axios.defaults.withCredentials = true;

const { TabPane } = Tabs;

const TasksListWidget = () => {
    const [tasks, setTasks] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const tasksPerPage = 6;

    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        if (activeTab === 'all') {
            axios
                .get(`http://127.0.0.1:8000/tasks?page=${currentPage}&limit=${tasksPerPage}`)
                .then((response) => {
                    setTasks(response.data.tasks);
                    setTotalPages(response.data.total_pages);
                });
        }
    }, [currentPage, activeTab]);

    const getDifficultyLabel = (difficulty) => {
        switch (difficulty) {
            case 'easy':
                return 'Легко';
            case 'medium':
                return 'Нормально';
            case 'hard':
                return 'Сложно';
            default:
                return difficulty;
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'active':
                return 'Активно';
            case 'completed':
                return 'Завершено';
            default:
                return status;
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const getLogoUrl = (companyName) => {
        if (!companyName) return null;
        return `http://127.0.0.1:8000/files/get_logo/${encodeURIComponent(companyName)}`;
    };

    return (
        <div className="w-screen min-h-screen p-8 flex flex-col" style={{ backgroundColor: '#002040' }}>
            <h2 className="text-2xl font-bold mb-4 text-center text-white">Список Заданий</h2>

            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                centered
                tabBarStyle={{ color: 'white' }}
                items={[
                    {
                        label: <span className="text-white text-lg">Все задания</span>,
                        key: 'all',
                        children: (
                            <>
                                <div className="flex flex-col">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-0.5 md:gap-x-2 place-items-center">
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
                                        onPageChange={(page) => setCurrentPage(page)}
                                    />
                                </div>
                                </div>
                            </>
                        ),
                    },
                    {
                        label: <span className="text-white text-lg">Решённые</span>,
                        key: 'solved',
                        children: <SolvedTasksListWidget />,
                    },
                ]}
            />
        </div>
    );
};

export default TasksListWidget;
