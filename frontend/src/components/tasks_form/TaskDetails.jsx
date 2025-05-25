import React, { useContext } from 'react';
import TaskInfo from './TaskInfo';
import TaskStudentSolutionForm from './TaskStudentSolutionForm';
import SolutionList from '../solutions_form/SolutionList';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { useMediaQuery } from 'react-responsive';

const TaskDetails = () => {
    const { state } = useLocation();
    const { task, taskFiles } = state || {};
    const { role } = useContext(AuthContext);

    const isSmallScreen = useMediaQuery({ maxWidth: 750 });

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <div
            className="flex h-full"
            style={{
                flexDirection: isSmallScreen ? 'column' : 'row',
                gap: isSmallScreen ? 16 : 0,
            }}
        >
            {/* Левый столбец - Информация о задаче */}
            <TaskInfo task={task} taskFiles={taskFiles} isEmployer={role === 'employer'} />

            <div
                style={{
                    width: isSmallScreen ? '100%' : 2,
                    height: isSmallScreen ? 2 : 'auto',
                    backgroundColor: '#4f46e5',
                    margin: isSmallScreen ? '16px 0' : '0 16px',
                    alignSelf: isSmallScreen ? 'stretch' : 'auto',
                }}
            />

            {/* Правый столбец - Форма для добавления или отображения решений */}
            {role === 'student' ? (
                <TaskStudentSolutionForm />
            ) : (
                <SolutionList taskId={task.id} />
            )}
        </div>
    );
};

export default TaskDetails;
