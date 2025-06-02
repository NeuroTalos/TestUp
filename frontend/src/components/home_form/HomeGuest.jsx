import React from 'react';
import { FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const HomeGuest = () => {
  const navigate = useNavigate();

  return (
    <div
      className="rounded-lg shadow-md p-6 sm:p-8 w-full max-w-[95vw] sm:max-w-2xl text-white mx-auto"
      style={{ backgroundColor: '#343F4D' }}
    >
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center sm:text-left">
        Добро пожаловать на TestUP!
      </h1>

      <p className="text-base sm:text-lg text-gray-300 mb-8 leading-relaxed text-center sm:text-left">
        Эта платформа соединяет студентов и работодателей через реальные задачи.
        Получите практический опыт или найдите талантливого стажёра.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mb-10 justify-center sm:justify-start">
        <button
          className="flex items-center justify-center gap-2 border border-blue-500 text-blue-500 hover:text-white hover:bg-blue-500 px-3 py-2 rounded-md text-base sm:text-lg font-semibold transition cursor-pointer"
          onClick={() => navigate('/registration')}
        >
          <FaUserPlus />
          Зарегистрироваться
        </button>

        <button
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-base sm:text-lg font-semibold transition cursor-pointer"
          onClick={() => navigate('/auth')}
        >
          <FaSignInAlt />
          Войти
        </button>
      </div>

      <div className="border-t border-gray-500 pt-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center sm:text-left">
          Как это работает?
        </h2>
        <ul className="space-y-3 text-gray-300 text-sm sm:text-base text-center sm:text-left">
          <li>📌 Работодатель публикует задание</li>
          <li>🧑‍🎓 Студент решает и отправляет ответ</li>
          <li>🤝 Работодатель оценивает и связывается</li>
        </ul>
      </div>
    </div>
  );
};

export default HomeGuest;
