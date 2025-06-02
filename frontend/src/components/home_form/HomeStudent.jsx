import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaClipboardList, FaSearch, FaCheckCircle } from 'react-icons/fa';
import TaskCard from '../tasks_form/TaskCard';

const HomeStudent = () => {
  const [name, setName] = useState('студент');
  const [loadingName, setLoadingName] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/students/current_name')
      .then(response => {
        if (response.data && response.data.name) {
          setName(response.data.name);
        }
      })
      .catch(error => {
        console.error('Ошибка при получении имени:', error);
      })
      .finally(() => setLoadingName(false));

    axios.get('http://127.0.0.1:8000/tasks/get_last_tasks?limit=3&page=1')
      .then(response => {
        if (response.data && Array.isArray(response.data.tasks)) {
          setTasks(response.data.tasks);
        } else if (response.data && Array.isArray(response.data)) {
          setTasks(response.data);
        }
      })
      .catch(error => {
        console.error('Ошибка при получении заданий:', error);
      })
      .finally(() => setLoadingTasks(false));
  }, []);

  const getLogoUrl = (companyName) => {
    if (!companyName) return null;
    return `http://127.0.0.1:8000/files/get_logo/${encodeURIComponent(companyName)}`;
  };

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

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-500';
      case 'medium':
        return 'text-orange-500';
      case 'hard':
        return 'text-red-500';
      default:
        return 'text-white';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-lime-600';
      case 'completed':
        return 'text-slate-400';
      default:
        return 'text-white';
    }
  };

  if (loadingName || loadingTasks) {
    return (
      <div className="bg-gray-800 text-white text-center p-8">
        Загрузка...
      </div>
    );
  }

  return (
    <div
      className="bg-gray-800 rounded-lg shadow-md p-8 w-full max-w-6xl mx-auto text-white"
    >
      <h1 className="text-4xl font-bold mb-6">Привет, {name}!</h1>

      <p className="text-lg text-gray-300 mb-10 leading-relaxed">
        Добро пожаловать на платформу для практики и роста. Здесь ты можешь найти реальные задания от работодателей,
        отправить свои решения и получить обратную связь — или даже стажировку!
      </p>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="rounded-lg p-6 flex flex-col items-start" style={{ backgroundColor: '#2a2f3a' }}>
          <FaClipboardList className="text-blue-400 text-3xl mb-4" />
          <h3 className="text-xl font-semibold mb-2">Выбирай задание</h3>
          <p className="text-gray-300 text-sm">
            Просматривай задания по сложности, интересу или компании. У каждого задания есть описание и файлы.
          </p>
        </div>
        <div className="rounded-lg p-6 flex flex-col items-start" style={{ backgroundColor: '#2a2f3a' }}>
          <FaSearch className="text-orange-400 text-3xl mb-4" />
          <h3 className="text-xl font-semibold mb-2">Изучай и решай</h3>
          <p className="text-gray-300 text-sm">
            Ознакомься с материалами, реши задачу и загрузи свой ответ. Ты можешь прикрепить файлы и написать пояснение.
          </p>
        </div>
        <div className="rounded-lg p-6 flex flex-col items-start" style={{ backgroundColor: '#2a2f3a' }}>
          <FaCheckCircle className="text-green-400 text-3xl mb-4" />
          <h3 className="text-xl font-semibold mb-2">Получай обратную связь</h3>
          <p className="text-gray-300 text-sm">
            Работодатель оставит комментарии к твоему решению и сможет связаться с тобой для обсуждения стажировки или дальнейших шагов.
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Новые задания</h2>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tasks.length === 0 ? (
          <p className="text-gray-400">Нет доступных заданий</p>
        ) : (
          tasks.map(task => (
            <TaskCard
              key={task.id}
              id={task.id}
              employer_name={task.employer_name}
              title={task.title}
              difficulty={getDifficultyLabel(task.difficulty)}
              difficultyColor={getDifficultyColor(task.difficulty)}
              status={getStatusLabel(task.status)}
              statusColor={getStatusColor(task.status)}
              created_at={task.created_at}
              fullTask={task}
              logoUrl={getLogoUrl(task.employer_name)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default HomeStudent;
