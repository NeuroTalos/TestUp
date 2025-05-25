import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Spin, Alert } from 'antd';
import TaskCard from '../tasks_form/TaskCard';
import Pagination from '../tasks_form/Pagination';
import { AuthContext } from '../contexts/AuthContext';

const EmployerTasksPage = () => {
  const { role } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const tasksPerPage = 6;

  const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'Легко';
      case 'medium': return 'Нормально';
      case 'hard': return 'Сложно';
      default: return 'Неизвестно';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Активно';
      case 'completed': return 'Завершено';
      default: return 'Неизвестно';
    }
  };

  const getLogoUrl = (companyName) => {
    if (!companyName) return null;
    return `http://127.0.0.1:8000/files/get_logo/${encodeURIComponent(companyName)}`;
  };

  useEffect(() => {
    if (role !== 'employer') {
      setError('Доступ запрещён: данная страница доступна только работодателям.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    axios.get(`http://127.0.0.1:8000/employers/current_tasks?page=${currentPage}&limit=${tasksPerPage}`, {
      withCredentials: true,
    })
      .then((response) => {
        setTasks(response.data.tasks || []);
        setTotalPages(response.data.total_pages || 1);
      })
      .catch((err) => {
        console.error('Ошибка при загрузке заданий:', err);
        setError('Ошибка при загрузке заданий');
      })
      .finally(() => setLoading(false));
  }, [currentPage, role]);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-screen h-screen" style={{ backgroundColor: '#002040' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center w-screen h-screen" style={{ backgroundColor: '#002040' }}>
        <Alert message={error} type="error" showIcon style={{ color: 'white' }} />
      </div>
    );
  }

  return (
    <div className="w-screen h-screen p-8 overflow-y-auto flex flex-col" style={{ backgroundColor: '#002040' }}>
      <h2 className="text-2xl font-bold mb-14 text-center text-white">Список размещённых заданий</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-0.5 md:gap-x-2 place-items-center">
        {tasks.length === 0 && (
          <p className="text-white text-center col-span-full">Нет размещённых заданий</p>
        )}

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

      <div className="mt-auto">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default EmployerTasksPage;
