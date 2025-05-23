import React from 'react';
import TaskInfo from './TaskInfo';
import TaskStudentSolutionForm from './TaskStudentSolutionForm';


const TaskDetails = ({ task, isEmployer }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <div className="flex h-full">
            {/* Левый столбец - Информация о задаче */}
            <TaskInfo task={task} isEmployer={isEmployer} />

            <div className="w-2 bg-indigo-600" />

            {/* Правый столбец - Форма для решения задачи */}
            { !isEmployer && (
                <TaskStudentSolutionForm handleSubmit={handleSubmit} />
            )}
        </div>
    );
};

export default TaskDetails;
