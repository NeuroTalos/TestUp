import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TaskCard from './TaskCard';
import Pagination from './Pagination';
import SolvedTasksListWidget from './SolvedTasksList';
import UnsolvedTasksListWidget from './UnsolvedTasksListWidget';
import { useSearchParams } from 'react-router-dom';

axios.defaults.withCredentials = true;

const TasksListWidget = () => {
  const [tasks, setTasks] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const tasksPerPage = 6;

  const [searchParams, setSearchParams] = useSearchParams();

  const pageFromUrl = parseInt(searchParams.get('page')) || 1;
  const [currentPage, setCurrentPage] = useState(pageFromUrl);

  const tabs = {
    all: 'Все задания',
    unsolved: 'Нерешённые задания',
    solved: 'Решённые задания',
  };

  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    setSearchParams({ page: currentPage.toString() });
  }, [currentPage, setSearchParams]);

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
    <div
      className="w-screen min-h-screen p-8 flex flex-col"
      style={{ backgroundColor: '#002040' }}
    >
      <h2 className="text-2xl font-bold mb-4 text-center text-white">Список Заданий</h2>

      {/* Вкладки */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 24,
          borderBottom: '2px solid #4f46e5',
          marginBottom: 16,
        }}
        role="tablist"
      >
        {Object.entries(tabs).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            role="tab"
            aria-selected={activeTab === key}
            style={{
              padding: '8px 24px',
              cursor: 'pointer',
              borderBottom: activeTab === key ? '4px solid #6366f1' : '4px solid transparent',
              background: 'transparent',
              color: activeTab === key ? '#6366f1' : '#d1d5db',
              fontWeight: activeTab === key ? '700' : '500',
              fontSize: 18,
              borderRadius: 4,
              transition: 'all 0.3s ease',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Контент вкладок */}
      {activeTab === 'all' && (
        <div
          className="w-full mx-auto p-8 flex flex-col"
          style={{ backgroundColor: '#002040', maxWidth: '1200px' }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-2 place-items-center">
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
      )}

      {activeTab === 'unsolved' && <UnsolvedTasksListWidget />}

      {activeTab === 'solved' && <SolvedTasksListWidget />}
    </div>
  );
};

export default TasksListWidget;
