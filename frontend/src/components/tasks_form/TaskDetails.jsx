import React from 'react';
import TaskInfo from './TaskInfo';
import TaskStudentSolutionForm from './TaskStudentSolutionForm';
import { useLocation } from 'react-router-dom';


const TaskDetails = () => {
    const { state } = useLocation();
    const { task, taskFiles, isEmployer } = state || {};

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <div className="flex h-full">
            {/* Левый столбец - Информация о задаче */}
            <TaskInfo task={task} taskFiles={taskFiles} isEmployer={isEmployer} />

            <div className="w-2 bg-indigo-600" />

            {/* Правый столбец - Форма для решения задачи */}
            { !isEmployer && (
                <TaskStudentSolutionForm handleSubmit={handleSubmit} />
            )}
        </div>
    );
};

export default TaskDetails;
