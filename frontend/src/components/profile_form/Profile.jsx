import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Spin, Alert } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Sidebar from './Sidebar';
import StudentPersonalInfo from './StudentPersonalInfo';
import EmployerPersonalInfo from './EmployerPersonalInfo';
import AuthInfo from './AuthInfo';
import TaskCard from '../tasks_form/TaskCard';
import Pagination from '../tasks_form/Pagination';
import SolvedTasksListWidget from '../tasks_form/SolvedTasksList';
import { AuthContext } from '../contexts/AuthContext';

const ProfileWidget = () => {
    const { role } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTab, setSelectedTab] = useState('info');
    const [currentPage, setCurrentPage] = useState(1);
    const tasksPerPage = 6;

    const getGenderText = (gender) => {
        switch (gender) {
            case 'male': return 'Мужской';
            case 'female': return 'Женский';
            default: return '';
        }
    };

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
        const fetchProfile = async () => {
            try {
                let url;

                if (role === 'student') {
                    url = 'http://127.0.0.1:8000/students/current_student';
                } else if (role === 'employer') {
                    url = 'http://127.0.0.1:8000/employers/current_employer';
                } else {
                    setError('Неизвестная роль');
                    setLoading(false);
                    return;
                }

                const response = await axios.get(url, { withCredentials: true });

                setProfile(response.data);
                setError(null);
            } catch (error) {
                setError('Ошибка при загрузке профиля');
                console.error('Ошибка при загрузке профиля:', error);
            } finally {
                setLoading(false);
            }
        };

        if (role) {
            fetchProfile();
        }
    }, [role]);

    if (loading) {
        return (
            <div className="flex justify-center items-center w-screen h-screen">
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center w-screen h-screen">
                <Alert message={error} type="error" showIcon />
            </div>
        );
    }

    const tasks = role === 'employer' && profile.tasks ? profile.tasks : [];
    const totalPages = Math.ceil(tasks.length / tasksPerPage);
    const displayedTasks = tasks.slice((currentPage - 1) * tasksPerPage, currentPage * tasksPerPage);
    const logoUrl = role === 'employer' && profile?.company_name ? getLogoUrl(profile.company_name) : null;

    return (
        <div className="flex w-screen h-screen" style={{ backgroundColor: '#002040' }}>
            <Sidebar
                fullName={
                    role === 'employer'
                        ? profile.company_name
                        : `${profile.first_name} ${profile.middle_name ? profile.middle_name + ' ' : ''}${profile.last_name}`
                }
                selectedKey={selectedTab}
                onSelect={setSelectedTab}
                logoUrl={logoUrl}
                role={role}
            />
            <div className="flex-1 overflow-auto">
                {selectedTab === 'info' && (
                    <div className="grid grid-cols-1">
                        <AuthInfo email={profile.email} />
                        {role === 'student' ? (
                            <StudentPersonalInfo profile={{ ...profile, gender: getGenderText(profile.gender) }} />
                        ) : role === 'employer' ? (
                            <EmployerPersonalInfo profile={profile} />
                        ) : null}
                    </div>
                )}

                {selectedTab === 'tasks' && role === 'employer' && (
                    <div className="w-full p-8 overflow-y-auto flex flex-col" style={{ backgroundColor: '#002040' }}>
                        <h2 className="text-2xl font-bold mb-14 text-center text-white">Список размещённых заданий</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-0.5 md:gap-x-2 place-items-center">
                            {Array.isArray(displayedTasks) && displayedTasks.length === 0 ? (
                                <div className="text-center col-span-full">
                                    <p className="text-white text-lg mb-2">Нет размещённых заданий</p>
                                    <p className="text-gray-300 mt-10 mb-6">Вы можете добавить своё первое задание </p>
                                    <button
                                        onClick={() => window.location.href = '/tasks/add'}
                                        className="inline-flex items-center bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-3 px-6 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    >
                                        <PlusOutlined className="mr-2 text-lg" />
                                        Добавить задание
                                    </button>
                                </div>
                            ) : (
                                displayedTasks.map((task) => (
                                    <TaskCard
                                        key={task.id}
                                        id={task.id}
                                        employer_name={profile.company_name}
                                        title={task.title}
                                        difficulty={getDifficultyLabel(task.difficulty)}
                                        status={getStatusLabel(task.status)}
                                        created_at={task.created_at}
                                        fullTask={task}
                                        logoUrl={logoUrl}
                                    />
                                ))
                            )}
                        </div>

                        {tasks.length > 0 && (
                            <div className="mt-auto">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        )}
                    </div>
                )}

                {selectedTab === 'tasks' && role === 'student' && (
                    <div className="w-full p-4 overflow-y-auto flex flex-col" style={{ backgroundColor: '#002040' }}>
                        <h2 className="text-2xl font-bold mb-10 text-center text-white">Список решённых заданий</h2>
                        <SolvedTasksListWidget compact />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileWidget;
