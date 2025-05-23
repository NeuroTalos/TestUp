import React, { useContext, useState } from 'react';
import { FaBriefcase } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const TaskCard = ({ id, employer_name, title, difficulty, status, fullTask, logoUrl }) => {
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AuthContext);
    const [imgError, setImgError] = useState(false);

    const handleClick = () => {
        if (!isAuthenticated) {
            toast.warn(
                "Пожалуйста, авторизуйтесь или зарегистрируйтесь, чтобы просматривать задания.", 
                {
                    autoClose: 3000,
                    className: 'custom-toast-error',
                }
            );
            return;
        }

        navigate(`/tasks/${id}`, { state: { task: fullTask } });
    };

    const difficultyColor = () => {
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

    const statusColor = () => {
        switch (status) {
            case 'Активно':
                return 'text-lime-600';
            case 'Завершено':
                return 'text-slate-400';
        }
    };

    return (
        <div 
            onClick={handleClick}
            className="rounded-lg shadow-md p-4 w-full max-w-md transition hover:shadow-lg hover:scale-[1.01]"
            style={{ backgroundColor: '#343F4D', color: '#ffffff' }}
        >
            <div className="flex items-center mb-2">
                {logoUrl && !imgError ? (
                    <img
                        src={logoUrl}
                        alt={`${employer_name} logo`}
                        className="w-8 h-8 rounded mr-2 object-contain"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <FaBriefcase className="text-white text-2xl mr-2" />
                )}
                <span className="font-semibold text-lg">{employer_name}</span>
            </div>
            <div className="text-lg font-bold mb-1">{title}</div>
            <div className="text-sm mb-1 ml-4">
                <span className="text-white">Сложность:</span> 
                <span className={`ml-2 ${difficultyColor()}`}>{difficulty}</span>
            </div>
            <div className="text-sm ml-4">
                <span className="text-white">Статус:</span> 
                <span className={`ml-2 ${statusColor()}`}>{status}</span>
            </div>
        </div>
    );
};

export default TaskCard;
