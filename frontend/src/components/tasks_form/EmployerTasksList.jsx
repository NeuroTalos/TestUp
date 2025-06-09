import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Spin, Alert } from 'antd';
import TaskCard from '../tasks_form/TaskCard';
import Pagination from '../tasks_form/Pagination';
import { AuthContext } from '../contexts/AuthContext';
import { PlusOutlined } from '@ant-design/icons';


const EmployerTasksPage = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
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
    return `${API_URL}/files/get_logo/${encodeURIComponent(companyName)}`;
  };

  useEffect(() => {
    if (role !== 'employer') {
      setError('Доступ запрещён: данная страница доступна только работодателям.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    axios.get(`${API_URL}/employers/current_tasks?page=${currentPage}&limit=${tasksPerPage}`, {
      withCredentials: true,
    })
      .then((response) => {
        setTasks(response.data.tasks || []);
        setTotalPages(response.data.total_pages || 1);
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
    <div className="w-screen min-h-screen p-8 flex flex-col" style={{ backgroundColor: '#002040' }}>
      <h2 className="text-2xl font-bold mb-14 text-center text-white">Список размещённых заданий</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-0.5 md:gap-x-2 place-items-center">
        {!Array.isArray(tasks) || tasks.length === 0 ? (
          <div className="text-center col-span-full">
            <p className="text-white text-lg mb-2">Нет размещённых заданий</p>
            <p className="text-gray-300 mt-10 mb-6">Вы можете добавить своё первое задание </p>
            <button
              onClick={() => navigate('/tasks/add')}
              className="inline-flex items-center bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-3 px-6 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <PlusOutlined className="mr-2 text-lg" />
              Добавить задание
            </button>
          </div>
        ) : (
          tasks.map((task) => (
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
          ))
        )}
      </div>

      {Array.isArray(tasks) && tasks.length > 0 && (
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default EmployerTasksPage;
