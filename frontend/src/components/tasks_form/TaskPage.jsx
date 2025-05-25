import React, { useContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import TaskDetails from './TaskDetails';

const TaskPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const { role } = useContext(AuthContext);

    const task = location.state?.task;

    if (!task) {
        return (
            <div className="w-screen h-screen text-white" style={{ backgroundColor: '#002040' }}>
                <h1 className="text-2xl font-bold text-red-400">Ошибка</h1>
                <p>Данные о задании не были переданы. Пожалуйста, вернитесь на список заданий и выберите задание заново.</p>
            </div>
        );
    }

    return (
        <div className="w-screen h-screen text-white p-8" style={{ backgroundColor: '#002040' }}>
            <TaskDetails task={task} />
        </div>
    );
};

export default TaskPage;
