// TaskInfo.js
import React, { useState } from 'react';
import { FaBriefcase, FaRegFile, FaFilePdf, FaRegFileImage } from 'react-icons/fa'; // Иконки для файлов

const TaskInfo = ({ task, isEmployer }) => {
    const [logoError, setLogoError] = useState(false);

    const difficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Легко':
                return 'text-green-500';
            case 'Нормально':
                return 'text-orange-500';
            case 'Сложно':
                return 'text-red-500'; 
            default:
                return 'text-white'; 
        }
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
                return 'Неизвестно';
        }
    };

    const difficultyLabel = getDifficultyLabel(task.difficulty);

    const companyNameEncoded = encodeURIComponent(task.employer_name);

    return (
        <div className="flex-shrink-0 bg-gray-800 p-6 rounded-lg overflow-y-auto card-scroll" style={{ flexBasis: '40%' }}>
            <h2 className="text-3xl font-bold text-white mb-4">Информация о задаче</h2>
            <div className="border-b-2 border-gray-600 mb-10"></div>

            <div className="flex items-center mb-6">
                {!logoError ? (
                    <img 
                        src={`http://127.0.0.1:8000/files/get_logo/${companyNameEncoded}`} 
                        alt={`${task.employer_name} логотип`} 
                        className="w-20 h-20 object-contain rounded mr-4"
                        onError={() => setLogoError(true)}
                    />
                ) : (
                    <FaBriefcase className="text-white w-20 h-20 mr-4" style={{ fontSize: '80px' }} />
                )}
                <span className="text-3xl font-semibold text-lg text-white" style={{ fontSize: '1.5rem' }}>
                    {task.employer_name}
                </span>
            </div>
            <div className="text-2xl font-bold text-white mb-6">{task.title}</div>

            <div className="mb-10 flex items-center">
                <h3 className="font-semibold text-lg mr-1" style={{ fontSize: '1.25rem' }}>Сложность:</h3>
                <p className={`text-xl ml-1 ${difficultyColor(difficultyLabel)}`}>{difficultyLabel}</p>
            </div>

            <div className="mb-10">
                <h3 className="font-semibold text-lg text-white mb-3" style={{ fontSize: '1.25rem' }}>Описание задачи:</h3>
                <p className="text-white">{task.description}</p>
            </div>

            <div>
                <h3 className="font-semibold text-lg text-white mb-6">Прикреплённые файлы:</h3>
                <div className="flex gap-4">
                    <FaRegFile className="text-2xl text-white" title="Документ" />
                    <FaFilePdf className="text-2xl text-white" title="PDF" />
                    <FaRegFileImage className="text-2xl text-white" title="Изображение" />
                </div>
            </div>

            {isEmployer && (
                <div className="mt-20">
                    <button
                        className="w-full py-3 bg-yellow-600 text-white rounded-md hover:bg-yellow-500"
                        onClick={(e) => e.preventDefault()}
                    >
                        Редактировать задачу
                    </button>
                </div>
            )}
        </div>
    );
};

export default TaskInfo;
