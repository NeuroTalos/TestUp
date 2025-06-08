import React from 'react';
import { FaPlusCircle, FaTasks, FaUsers, FaClipboardList } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const HomeEmployer = () => {
  const navigate = useNavigate();

  const handleCreateTask = () => {
    navigate('/tasks/add');
  };

  const handleViewPostedTasks = () => {
    navigate('/employer/tasks');
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-8 w-full max-w-6xl mx-auto text-white">
      <h1 className="text-4xl font-bold mb-6">Добро пожаловать, работодатель!</h1>

      <p className="text-gray-300 mb-10 leading-relaxed">
        Здесь вы можете публиковать новые задания, отслеживать их статус и управлять откликами студентов.
      </p>

      <div className="flex flex-col items-stretch md:flex-row md:justify-center gap-6 mb-12">
        <div
          className="w-full md:w-80 min-h-[220px] rounded-lg p-6 flex flex-col justify-between"
          style={{ backgroundColor: '#2a2f3a' }}
        >
          <div>
            <FaTasks className="text-blue-400 text-3xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">Мои задания</h3>
            <p className="text-gray-300 text-sm">
              Публикуйте задания в свободной форме — вы можете описать задачу текстом, приложить файлы, указать уровень сложности и дату завершения, после которой студенты не смогут отправлять свои решения.
            </p>
          </div>
        </div>

        <div
          className="w-full md:w-80 min-h-[220px] rounded-lg p-6 flex flex-col justify-between"
          style={{ backgroundColor: '#2a2f3a' }}
        >
          <div>
            <FaUsers className="text-green-400 text-3xl mb-4" />
            <h3 className="text-xl font-semibold mb-2">Отклики студентов</h3>
            <p className="text-gray-300 text-sm">
              Просматривайте решения студентов, оставляйте комментарии и выходите на связь с авторами лучших решений.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-4">
        <button
          type="button"
          onClick={handleCreateTask}
          className="flex items-center bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-3 px-6 rounded-lg shadow-md cursor-pointer"
        >
          <FaPlusCircle className="mr-3 text-xl" />
          Создать новое задание
        </button>

        <button
          type="button"
          onClick={handleViewPostedTasks}
          className="flex items-center bg-cyan-800 hover:bg-cyan-700 transition text-white font-semibold py-3 px-6 rounded-lg shadow-md cursor-pointer"
        >
          <FaClipboardList className="mr-3 text-xl" />
          Посмотреть размещённые задания
        </button>
      </div>
    </div>
  );
};

export default HomeEmployer;
