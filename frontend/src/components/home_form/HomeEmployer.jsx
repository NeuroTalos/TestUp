import React from 'react';
import { FaPlusCircle, FaTasks, FaUsers, FaChartLine } from 'react-icons/fa';

const HomeEmployer = () => {
  return (
    <div className="max-w-6xl mx-auto p-8 text-white" style={{ backgroundColor: '#343F4D', minHeight: '100vh' }}>
      <h1 className="text-4xl font-bold mb-6">Добро пожаловать, работодатель!</h1>
      <p className="text-gray-300 mb-10 max-w-xl leading-relaxed">
        Здесь вы можете публиковать новые задания, отслеживать их статус и управлять откликами студентов.
      </p>

      <button
        type="button"
        className="flex items-center bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-3 px-6 rounded-lg mb-12 shadow-md"
      >
        <FaPlusCircle className="mr-3 text-xl" />
        Опубликовать новое задание
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-[#2a2f3a] rounded-lg p-6 shadow-md hover:shadow-lg transition cursor-pointer">
          <FaTasks className="text-blue-400 text-4xl mb-4" />
          <h3 className="text-xl font-semibold mb-2">Мои задания</h3>
          <p className="text-gray-400 text-sm">
            Просматривайте, редактируйте и отслеживайте статус опубликованных заданий.
          </p>
        </div>
        <div className="bg-[#2a2f3a] rounded-lg p-6 shadow-md hover:shadow-lg transition cursor-pointer">
          <FaUsers className="text-green-400 text-4xl mb-4" />
          <h3 className="text-xl font-semibold mb-2">Отклики студентов</h3>
          <p className="text-gray-400 text-sm">
            Просматривайте решения, комментарии и выбирайте лучших кандидатов для стажировки.
          </p>
        </div>
        <div className="bg-[#2a2f3a] rounded-lg p-6 shadow-md hover:shadow-lg transition cursor-pointer">
          <FaChartLine className="text-orange-400 text-4xl mb-4" />
          <h3 className="text-xl font-semibold mb-2">Статистика</h3>
          <p className="text-gray-400 text-sm">
            Анализируйте популярность ваших заданий и эффективность откликов.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeEmployer;
