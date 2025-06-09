import React, { useContext, useState } from 'react';
import { FaBriefcase } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import JSZip from 'jszip';
import axios from 'axios';

const TaskCard = ({ id, employer_name, title, difficulty, status, created_at, fullTask, logoUrl }) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();
    const { isAuthenticated, role } = useContext(AuthContext);
    const [imgError, setImgError] = useState(false);

    const handleClick = async () => {
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

        try {
            const filePaths = fullTask.files?.map(f => f.file_path) || [];

            if (filePaths.length === 0) {
                navigate(`/tasks/${id}`, {
                    state: {
                        task: fullTask,
                        taskFiles: [],
                    },
                });
                return;
            }

            const res = await axios.post(
                `${API_URL}/files/get_task_files/`,
                filePaths,
                {
                    withCredentials: true,
                    responseType: 'blob',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            const blob = res.data;
            const zip = await JSZip.loadAsync(blob);
            const files = [];

            for (const [filename, file] of Object.entries(zip.files)) {
                if (!file.dir) {
                    const content = await file.async("blob");
                    files.push({ filename, content });
                }
            }

            navigate(`/tasks/${id}`, {
                state: {
                    task: fullTask,
                    taskFiles: files,
                },
            });

        } catch (error) {
            console.error(error);
            toast.error("Ошибка при загрузке файлов задания");
        }
    };


    const difficultyColor = () => {
        switch (difficulty) {
            case 'Легко': return 'text-green-500';
            case 'Нормально': return 'text-orange-500';
            case 'Сложно': return 'text-red-500';
            default: return 'text-white';
        }
    };

    const statusColor = () => {
        switch (status) {
            case 'Активно': return 'text-lime-600';
            case 'Завершено': return 'text-slate-400';
            default: return 'text-white';
        }
    };

    const formatDate = (isoDate) => {
        if (!isoDate) return '';
        const date = new Date(isoDate);
        return date.toLocaleDateString('ru-RU');
    };

    const hasUnviewedSolutions = role === 'employer' && Array.isArray(fullTask.solutions)
        ? fullTask.solutions.some(solution => solution.viewed === false)
        : false;
    
    const hasViewedByEmployer = role === 'student' && Array.isArray(fullTask.solutions)
        ? fullTask.solutions.some(solution => solution.viewed === true)
        : false;

    const dateTextColor = "text-gray-300";

    return (
        <div
            onClick={handleClick}
            className="relative rounded-lg shadow-md p-4 w-full max-w-md transition hover:shadow-lg hover:scale-[1.01] cursor-pointer"
            style={{ backgroundColor: '#343F4D', color: '#ffffff' }}
        >
            {hasUnviewedSolutions && (
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-yellow-400 text-black text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-md animate-pulse z-10">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                        <path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm1 13H9v-2h2v2zm0-4H9V7h2v4z" />
                    </svg>
                    Новые решения
                </div>
            )}
            
            {hasViewedByEmployer && (
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-blue-500 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-md z-10">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 4.5C7.305 4.5 3.135 7.675 1.5 12c1.635 4.325 5.805 7.5 10.5 7.5s8.865-3.175 10.5-7.5C20.865 7.675 16.695 4.5 12 4.5zm0 12a4.5 4.5 0 110-9 4.5 4.5 0 010 9zm0-7a2.5 2.5 0 100 5 2.5 2.5 0 000-5z"/>
                    </svg>
                    Просмотрено
                </div>
            )}

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
            <div className="text-sm mb-1 ml-4">
                <span className="text-white">Статус:</span>
                <span className={`ml-2 ${statusColor()}`}>{status}</span>
            </div>
            <div className={`text-sm mb-1 ml-4 ${dateTextColor}`}>
                <span className="text-white">Дата создания:</span>
                <span className="ml-2">{formatDate(created_at)}</span>
            </div>
            <div className={`text-sm mb-1 ml-4 ${dateTextColor}`}>
                <span className="text-white">Дата завершения:</span>
                <span className="ml-2">
                    {fullTask.due_date ? formatDate(fullTask.due_date) : 'не указана'}
                </span>
            </div>
        </div>
    );
};

export default TaskCard;
